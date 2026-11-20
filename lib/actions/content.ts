"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { assertPermission } from "@/lib/auth/session";
import { recordAudit } from "@/lib/auth/audit";
import { hashIp, slugify, randomToken } from "@/lib/security/tokens";
import { inspectUpload, sanitiseFileName } from "@/lib/security/upload";
import { uploadObject, privateDocumentPath } from "@/lib/services/storage.service";
import * as newsService from "@/lib/services/news.service";
import * as projectService from "@/lib/services/project.service";
import * as noticeService from "@/lib/services/notice.service";
import * as documentService from "@/lib/services/document.service";
import * as participationService from "@/lib/services/participation.service";
import { logError } from "@/lib/firebase/errors";
import { fieldErrors, newsSchema, projectSchema, noticeSchema, documentSchema, participationSchema } from "@/lib/validation/schemas";
import type { ActionState } from "./types";

const h = async () => headers();
const ipHash = async () => hashIp((await h()).get("x-forwarded-for")?.split(",")[0]?.trim() || undefined);

/**
 * Unique slug. Appending a short random suffix rather than a counter avoids a race between two
 * simultaneous creates producing the same slug.
 */
async function uniqueSlug(
  exists: (slug: string) => Promise<unknown>,
  base: string,
): Promise<string> {
  const slug = slugify(base);
  return (await exists(slug)) ? `${slug}-${randomToken(3).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 4)}` : slug;
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  // DB-08 fix: a bare calendar date ("2026-12-31") is a DEADLINE for this application, so it is
  // interpreted as end-of-day Africa/Nairobi (23:59:59 +03:00) instead of 00:00 UTC — which closed
  // "31 December" consultations and notices at 03:00 on the 31st, roughly 21 hours early.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return new Date(`${value.trim()}T23:59:59+03:00`);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Start-of-day Africa/Nairobi for a bare calendar date — used for opening dates (opensAt). */
function parseDateStart(value?: string | null): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return new Date(`${value.trim()}T00:00:00+03:00`);
  return parseDate(value);
}

/* ─────────────────────────── NEWS ─────────────────────────── */

export async function saveNewsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await assertPermission("news:write");
  if ("error" in auth) return { status: "error", message: auth.error };
  const parsed = newsSchema.safeParse(Object.fromEntries(formData) as Record<string, string>);
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  const d = parsed.data;
  const scheduledFor = parseDate(d.scheduledFor);

  try {
    if (d.id) {
      const before = await newsService.getNewsById(d.id);
      if (!before) return { status: "error", message: "That article no longer exists." };
      // RBAC-03 fix (edit-after-approval): editing returns the item to DRAFT unless it already is
      // one. Previously only PUBLISHED items were reset, so text could be altered after a
      // reviewer had approved it while the approval (and its contentHash basis) stayed valid.
      const needsReapproval = before.status !== "DRAFT";
      await newsService.updateNews(d.id, {
        title: d.title, category: d.category, summary: d.summary, body: d.body,
        imagePath: d.imagePath || null, imageAlt: d.imageAlt || null,
        seoTitle: d.seoTitle || null, seoDescription: d.seoDescription || null,
        scheduledFor,
        ...(needsReapproval ? { status: "DRAFT" as const, publishedAt: null, reviewerId: null } : {}),
      });
      await recordAudit({
        actorId: auth.user.id, actorEmail: auth.user.email, action: "NEWS_UPDATED", entityType: "NewsArticle",
        entityId: d.id, summary: `Updated "${d.title}"${needsReapproval ? " (returned to draft for re-approval)" : ""}.`, ipHash: await ipHash(),
      });
      revalidatePath("/admin/news"); revalidatePath("/news"); revalidatePath(`/news/${before.slug}`);
      return { status: "ok", message: "Article saved." };
    }
    const slug = await uniqueSlug((s) => newsService.getNewsBySlug(s), d.slug || d.title);
    const created = await newsService.createNews({
      slug, title: d.title, category: d.category, summary: d.summary, body: d.body,
      imagePath: d.imagePath || null, imageAlt: d.imageAlt || null,
      seoTitle: d.seoTitle || null, seoDescription: d.seoDescription || null,
      scheduledFor, status: "DRAFT", publishedAt: null, archivedAt: null,
      authorId: auth.user.id, reviewerId: null,
    });
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "NEWS_CREATED", entityType: "NewsArticle",
      entityId: created.id, summary: `Created draft "${d.title}".`, ipHash: await ipHash(),
    });
    revalidatePath("/admin/news");
    return { status: "ok", message: `Draft created (${slug}).` };
  } catch (error) {
    logError("news.save", error);
    return { status: "error", message: "The article could not be saved." };
  }
}

/** Editorial workflow transition. Enforces the four-eyes rule on the server. */
export async function transitionNewsAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || "");
  const note = String(formData.get("note") || "").slice(0, 400);

  const permission = action === "publish" || action === "approve" || action === "reject" ? "news:review" : "news:write";
  const auth = await assertPermission(permission);
  if ("error" in auth) return;

  const article = await newsService.getNewsById(id).catch(() => null);
  if (!article) return;

  // RBAC-03 fix (state machine): every transition declares the status it may start from. Server
  // actions are plain POSTs — hiding buttons is not a control — so a crafted request could
  // previously publish a DRAFT that was never submitted or approved.
  const EXPECTED_STATUS: Record<string, string[]> = {
    submit: ["DRAFT"],
    approve: ["IN_REVIEW"],
    reject: ["IN_REVIEW"],
    publish: ["APPROVED"],
    unpublish: ["PUBLISHED"],
    archive: ["PUBLISHED"],
  };
  if (!EXPECTED_STATUS[action]?.includes(article.status)) {
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "WORKFLOW_DENIED", entityType: "NewsArticle",
      entityId: id, summary: `Blocked "${action}" on "${article.title}" — invalid from status ${article.status}.`,
      ipHash: await ipHash(), outcome: "DENIED",
    });
    return;
  }

  // Nobody may approve or publish their own submission (four-eyes rule).
  if (["approve", "reject", "publish"].includes(action) && article.authorId === auth.user.id) {
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "WORKFLOW_DENIED", entityType: "NewsArticle",
      entityId: id, summary: `Blocked self-approval of "${article.title}" (four-eyes rule).`, ipHash: await ipHash(), outcome: "DENIED",
    });
    return;
  }

  let patch: Partial<newsService.NewsWrite> = {};
  let summary = "";
  switch (action) {
    case "submit": patch = { status: "IN_REVIEW" }; summary = `Submitted "${article.title}" for review.`; break;
    case "approve": patch = { status: "APPROVED", reviewerId: auth.user.id }; summary = `Approved "${article.title}".${note ? ` Note: ${note}` : ""}`; break;
    case "reject": patch = { status: "DRAFT", reviewerId: auth.user.id }; summary = `Returned "${article.title}" for revision.${note ? ` Reason: ${note}` : ""}`; break;
    case "publish": {
      // Scheduled publication is honoured: publishing a future-dated item waits for its time.
      const publishAt = article.scheduledFor && article.scheduledFor.getTime() > Date.now() ? article.scheduledFor : new Date();
      patch = { status: "PUBLISHED", publishedAt: publishAt, reviewerId: article.reviewerId ?? auth.user.id };
      summary = `Published "${article.title}"${publishAt > new Date() ? ` scheduled for ${publishAt.toISOString()}` : ""}.`;
      break;
    }
    case "unpublish": patch = { status: "APPROVED", publishedAt: null }; summary = `Unpublished "${article.title}".`; break;
    case "archive": patch = { status: "ARCHIVED", archivedAt: new Date() }; summary = `Archived "${article.title}".`; break;
    default: return;
  }

  await newsService.updateNews(id, patch);
  await recordAudit({
    actorId: auth.user.id, actorEmail: auth.user.email, action: `NEWS_${action.toUpperCase()}`, entityType: "NewsArticle",
    entityId: id, summary, ipHash: await ipHash(),
  });
  revalidatePath("/admin/news"); revalidatePath("/news"); revalidatePath(`/news/${article.slug}`); revalidatePath("/");
}

/* ───────────────────────── PROJECTS ───────────────────────── */

export async function saveProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await assertPermission("projects:write");
  if ("error" in auth) return { status: "error", message: auth.error };
  const parsed = projectSchema.safeParse(Object.fromEntries(formData) as Record<string, string>);
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  const d = parsed.data;
  try {
    if (d.id) {
      const before = await projectService.getProjectById(d.id);
      if (!before) return { status: "error", message: "That project record no longer exists." };
      // RBAC-03 fix (edit-after-approval): same rule as news — any non-draft edit restarts review.
      const needsReapproval = before.status !== "DRAFT";
      await projectService.updateProject(d.id, {
        title: d.title, category: d.category, projectStatus: d.projectStatus, location: d.location,
        summary: d.summary, description: d.description, objectives: d.objectives || "",
        budget: d.budget || null, startDate: d.startDate || null, completionDate: d.completionDate || null,
        implementingAgency: d.implementingAgency || null, imagePath: d.imagePath || null, imageAlt: d.imageAlt || null,
        ...(needsReapproval ? { status: "DRAFT" as const, publishedAt: null, reviewerId: null } : {}),
      });
      await recordAudit({
        actorId: auth.user.id, actorEmail: auth.user.email, action: "PROJECT_UPDATED", entityType: "ProjectRecord",
        entityId: d.id, summary: `Updated project "${d.title}".`, ipHash: await ipHash(),
      });
      revalidatePath("/admin/projects"); revalidatePath("/projects");
      return { status: "ok", message: "Project record saved." };
    }
    const slug = await uniqueSlug((s) => projectService.getProjectBySlug(s), d.slug || d.title);
    const created = await projectService.createProject({
      slug, title: d.title, category: d.category, projectStatus: d.projectStatus, location: d.location,
      summary: d.summary, description: d.description, objectives: d.objectives || "",
      budget: d.budget || null, startDate: d.startDate || null, completionDate: d.completionDate || null,
      implementingAgency: d.implementingAgency || null, imagePath: d.imagePath || null, imageAlt: d.imageAlt || null,
      status: "DRAFT", publishedAt: null, archivedAt: null, authorId: auth.user.id, reviewerId: null,
    });
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "PROJECT_CREATED", entityType: "ProjectRecord",
      entityId: created.id, summary: `Created draft project "${d.title}".`, ipHash: await ipHash(),
    });
    revalidatePath("/admin/projects");
    return { status: "ok", message: `Project draft created (${slug}).` };
  } catch (error) {
    logError("project.save", error);
    return { status: "error", message: "The project record could not be saved." };
  }
}

export async function transitionProjectAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || "");
  const auth = await assertPermission(["approve", "reject", "publish"].includes(action) ? "projects:review" : "projects:write");
  if ("error" in auth) return;
  const project = await projectService.getProjectById(id).catch(() => null);
  if (!project) return;
  if (["approve", "reject", "publish"].includes(action) && project.authorId === auth.user.id) {
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "WORKFLOW_DENIED", entityType: "ProjectRecord",
      entityId: id, summary: `Blocked self-approval of project "${project.title}".`, ipHash: await ipHash(), outcome: "DENIED",
    });
    return;
  }
  const map: Record<string, Partial<projectService.ProjectWrite>> = {
    submit: { status: "IN_REVIEW" },
    approve: { status: "APPROVED", reviewerId: auth.user.id },
    reject: { status: "DRAFT" },
    publish: { status: "PUBLISHED", publishedAt: new Date() },
    unpublish: { status: "APPROVED", publishedAt: null },
    archive: { status: "ARCHIVED", archivedAt: new Date() },
  };
  if (!map[action]) return;
  await projectService.updateProject(id, map[action]);
  await recordAudit({
    actorId: auth.user.id, actorEmail: auth.user.email, action: `PROJECT_${action.toUpperCase()}`,
    entityType: "ProjectRecord", entityId: id, summary: `${action} — "${project.title}".`, ipHash: await ipHash(),
  });
  revalidatePath("/admin/projects"); revalidatePath("/projects"); revalidatePath(`/projects/${project.slug}`); revalidatePath("/");
}

/* ────────────────────────── NOTICES ────────────────────────── */

export async function saveNoticeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await assertPermission("notices:write");
  if ("error" in auth) return { status: "error", message: auth.error };
  const parsed = noticeSchema.safeParse(Object.fromEntries(formData) as Record<string, string>);
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  const d = parsed.data;
  try {
    if (d.id) {
      await noticeService.updateNotice(d.id, {
        title: d.title, category: d.category, body: d.body, expiresAt: parseDate(d.expiresAt), documentId: d.documentId || null,
      });
      await recordAudit({
        actorId: auth.user.id, actorEmail: auth.user.email, action: "NOTICE_UPDATED", entityType: "PublicNotice",
        entityId: d.id, summary: `Updated notice "${d.title}".`, ipHash: await ipHash(),
      });
      revalidatePath("/admin/notices"); revalidatePath("/news");
      return { status: "ok", message: "Notice saved." };
    }
    const slug = await uniqueSlug((s) => noticeService.getNoticeBySlug(s), d.slug || d.title);
    const created = await noticeService.createNotice({
      slug, title: d.title, category: d.category, body: d.body, expiresAt: parseDate(d.expiresAt),
      documentId: d.documentId || null, status: "DRAFT", publishedAt: null, archivedAt: null, authorId: auth.user.id,
    });
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "NOTICE_CREATED", entityType: "PublicNotice",
      entityId: created.id, summary: `Created notice "${d.title}".`, ipHash: await ipHash(),
    });
    revalidatePath("/admin/notices");
    return { status: "ok", message: `Notice draft created (${slug}).` };
  } catch (error) {
    logError("notice.save", error);
    return { status: "error", message: "The notice could not be saved." };
  }
}

export async function transitionNoticeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || "");
  const auth = await assertPermission("notices:write");
  if ("error" in auth) return;
  const notice = await noticeService.getNoticeById(id).catch(() => null);
  if (!notice) return;
  const map: Record<string, Partial<noticeService.NoticeWrite>> = {
    publish: { status: "PUBLISHED", publishedAt: new Date() },
    withdraw: { status: "DRAFT", publishedAt: null },
    archive: { status: "ARCHIVED", archivedAt: new Date() },
  };
  if (!map[action]) return;
  await noticeService.updateNotice(id, map[action]);
  await recordAudit({
    actorId: auth.user.id, actorEmail: auth.user.email, action: `NOTICE_${action.toUpperCase()}`,
    entityType: "PublicNotice", entityId: id, summary: `${action} — "${notice.title}".`, ipHash: await ipHash(),
  });
  revalidatePath("/admin/notices"); revalidatePath("/news"); revalidatePath("/");
}

/* ───────────────────────── DOCUMENTS ───────────────────────── */

export async function uploadDocumentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await assertPermission("documents:write");
  if ("error" in auth) return { status: "error", message: auth.error };
  const parsed = documentSchema.safeParse({
    title: String(formData.get("title") || ""),
    category: String(formData.get("category") || ""),
    description: String(formData.get("description") || ""),
    documentDate: String(formData.get("documentDate") || ""),
  });
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), message: "Please correct the highlighted fields." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", errors: { file: "Choose a file to upload." } };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  // Signature inspection, extension and MIME validation — the browser-supplied type is never trusted.
  const check = inspectUpload(file.name, buffer);
  if (!check.ok) return { status: "error", errors: { file: check.error } };

  try {
    const created = await documentService.createDocument({
      title: parsed.data.title, category: parsed.data.category, description: parsed.data.description,
      documentDate: parseDate(parsed.data.documentDate),
      // ST-01 fix: the stored name must be ASCII-safe — it is echoed back in the download route's
      // Content-Disposition header, which only accepts Latin-1 values.
      fileName: sanitiseFileName(file.name),
      // Placeholder path replaced immediately after the object upload below.
      storagePath: "pending", mimeType: check.mimeType, sizeBytes: buffer.length,
      checksum: check.checksum, status: "DRAFT", publishedAt: null, archivedAt: null,
      uploadedById: auth.user.id,
    });
    const storagePath = privateDocumentPath(created.id, file.name);
    await uploadObject(storagePath, buffer, check.mimeType);
    await documentService.updateDocument(created.id, { storagePath });
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "DOCUMENT_UPLOADED", entityType: "DocumentRecord",
      entityId: created.id, summary: `Uploaded "${file.name}" (${buffer.length} bytes, ${check.mimeType}).`, ipHash: await ipHash(),
    });
    revalidatePath("/admin/documents"); revalidatePath("/resources");
    return { status: "ok", message: "Document stored as a draft. Publish it when the content is approved." };
  } catch (error) {
    logError("document.upload", error);
    return { status: "error", message: "The document could not be stored." };
  }
}

export async function transitionDocumentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const action = String(formData.get("id") && formData.get("action") || "");
  const auth = await assertPermission("documents:write");
  if ("error" in auth) return;
  const doc = await documentService.getDocumentById(id).catch(() => null);
  if (!doc) return;
  // ST-04 fix: a record whose upload never completed (storagePath still "pending") has no bytes —
  // publishing it would create a document that every download reports as unavailable.
  if (action === "publish" && doc.storagePath === "pending") return;
  if (action === "delete") {
    // ST-03 fix: "delete" now archives ONLY. The stored bytes are never destroyed by this action —
    // permanent disposal of official records requires the out-of-band, bucket-level process
    // documented in BACKUP_AND_RECOVERY.md (soft-delete + object versioning on the bucket).
    await documentService.updateDocument(id, { status: "ARCHIVED", archivedAt: new Date() });
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "DOCUMENT_ARCHIVED", entityType: "DocumentRecord",
      entityId: id, summary: `Archived "${doc.fileName}" — stored bytes retained for records recovery.`, ipHash: await ipHash(),
    });
  } else {
    const map: Record<string, Partial<documentService.DocumentWrite>> = {
      publish: { status: "PUBLISHED", publishedAt: new Date() },
      withdraw: { status: "DRAFT", publishedAt: null },
    };
    if (!map[action]) return;
    await documentService.updateDocument(id, map[action]);
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: `DOCUMENT_${action.toUpperCase()}`,
      entityType: "DocumentRecord", entityId: id, summary: `${action} — "${doc.title}".`, ipHash: await ipHash(),
    });
  }
  revalidatePath("/admin/documents"); revalidatePath("/resources");
}

/* ─────────────────────── PARTICIPATION ─────────────────────── */

export async function saveParticipationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await assertPermission("participation:manage");
  if ("error" in auth) return { status: "error", message: auth.error };
  const parsed = participationSchema.safeParse(Object.fromEntries(formData) as Record<string, string>);
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  const d = parsed.data;
  try {
    if (d.id) {
      await participationService.updateOpportunity(d.id, {
        title: d.title, description: d.description, kind: d.kind, location: d.location || null,
        instructions: d.instructions || null, opensAt: parseDateStart(d.opensAt), closesAt: parseDate(d.closesAt),
      });
      await recordAudit({
        actorId: auth.user.id, actorEmail: auth.user.email, action: "PARTICIPATION_UPDATED",
        entityType: "ParticipationOpportunity", entityId: d.id, summary: `Updated "${d.title}".`, ipHash: await ipHash(),
      });
      revalidatePath("/admin/participation"); revalidatePath("/public-participation");
      return { status: "ok", message: "Consultation saved." };
    }
    const slug = await uniqueSlug((s) => participationService.getOpportunityBySlug(s), d.slug || d.title);
    const created = await participationService.createOpportunity({
      slug, title: d.title, description: d.description, kind: d.kind, location: d.location || null,
      instructions: d.instructions || null, opensAt: parseDateStart(d.opensAt), closesAt: parseDate(d.closesAt),
      status: "DRAFT", publishedAt: null,
    });
    await recordAudit({
      actorId: auth.user.id, actorEmail: auth.user.email, action: "PARTICIPATION_CREATED",
      entityType: "ParticipationOpportunity", entityId: created.id, summary: `Created "${d.title}".`, ipHash: await ipHash(),
    });
    revalidatePath("/admin/participation");
    return { status: "ok", message: `Consultation draft created (${slug}).` };
  } catch (error) {
    logError("participation.save", error);
    return { status: "error", message: "The consultation could not be saved." };
  }
}

export async function transitionParticipationAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || "");
  const auth = await assertPermission("participation:manage");
  if ("error" in auth) return;
  const map: Record<string, Partial<participationService.OpportunityWrite>> = {
    publish: { status: "PUBLISHED", publishedAt: new Date() },
    close: { status: "DRAFT", publishedAt: null },
  };
  if (!map[action]) return;
  await participationService.updateOpportunity(id, map[action]);
  await recordAudit({
    actorId: auth.user.id, actorEmail: auth.user.email, action: `PARTICIPATION_${action.toUpperCase()}`,
    entityType: "ParticipationOpportunity", entityId: id, summary: `${action} consultation.`, ipHash: await ipHash(),
  });
  revalidatePath("/admin/participation"); revalidatePath("/public-participation");
}
