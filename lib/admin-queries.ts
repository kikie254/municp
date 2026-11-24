// DB-03 fix: administrative reads are STRICT. `safeRead` converted every Firestore error —
// outage, missing index, permission failure — into an empty list, so the complaint queue could
// render "nothing matches this filter" during an outage and the dashboard showed zeros as if
// they were live counts. Admin pages now surface the error through the route error boundary.
async function strictRead<T>(fn: () => Promise<T>, ..._rest: unknown[]): Promise<T> {
  void _rest;
  // The fallback argument of the old safeRead signature is accepted and ignored: admin reads are
  // strict now and callers keep their shape.
  return fn();
}
import * as newsService from "@/lib/services/news.service";
import * as projectService from "@/lib/services/project.service";
import * as noticeService from "@/lib/services/notice.service";
import * as documentService from "@/lib/services/document.service";
import * as submissionService from "@/lib/services/submission.service";
import * as participationService from "@/lib/services/participation.service";
import * as adminUserService from "@/lib/services/admin-user.service";
import { listAuditLogs, countAuditLogs } from "@/lib/services/audit.service";
import { listOutbox } from "@/lib/services/email.service";

/**
 * Administrative reads (Firestore).
 *
 * Unlike `lib/queries.ts` these deliberately return unpublished records — they are only ever
 * imported by pages underneath `app/admin/(dashboard)`, whose layout calls `requireUser()` before
 * rendering. The public site never imports this module. Author names are denormalised onto the
 * records at write time, so listing pages need no join reads.
 */

const nameOf = (r: { authorName?: string | null }) => r.authorName ?? null;

export const listAdminNews = () =>
  strictRead(async () => {
    const rows = await newsService.listAllNews();
    return rows.map((r) => ({ ...r, author: { name: r.authorName ?? "—" }, reviewer: r.reviewerName ? { name: r.reviewerName } : null }));
  }, []);

export const getAdminNews = (id: string) =>
  strictRead(async () => {
    const r = await newsService.getNewsById(id);
    if (!r) return null;
    return { ...r, author: { name: r.authorName ?? "—" }, reviewer: r.reviewerName ? { name: r.reviewerName } : null };
  }, null);

export const listAdminProjects = () =>
  strictRead(async () => {
    const rows = await projectService.listAllProjects();
    return rows.map((r) => ({ ...r, author: { name: r.authorName ?? "—" }, reviewer: r.reviewerName ? { name: r.reviewerName } : null }));
  }, []);

export const getAdminProject = (id: string) =>
  strictRead(async () => {
    const r = await projectService.getProjectById(id);
    if (!r) return null;
    return { ...r, author: { name: r.authorName ?? "—" }, reviewer: r.reviewerName ? { name: r.reviewerName } : null };
  }, null);

export const listAdminNotices = () =>
  strictRead(async () => {
    const rows = await noticeService.listAllNotices();
    return rows.map((r) => ({ ...r, author: { name: r.authorName ?? "—" } }));
  }, []);

export const getAdminNotice = (id: string) => strictRead(() => noticeService.getNoticeById(id), null);

export const listAdminDocuments = () =>
  strictRead(async () => {
    const rows = await documentService.listAllDocuments();
    return rows.map((r) => ({ ...r, uploadedBy: { name: r.uploadedByName ?? "—" } }));
  }, []);

export const listAdminSubmissions = (filter: { status?: string; type?: string }) =>
  strictRead(() => submissionService.listSubmissions(filter), []);

export const getAdminSubmission = (id: string) =>
  strictRead(async () => {
    const r = await submissionService.getSubmissionById(id);
    if (!r) return null;
    const notes = await submissionService.listNotesForSubmission(id);
    return { ...r, assignedTo: r.assignedToName ? { name: r.assignedToName } : null, notes };
  }, null);

export const listAdminParticipation = () => strictRead(() => participationService.listAllOpportunities(), []);

export const getAdminParticipation = (id: string) => strictRead(() => participationService.getOpportunityById(id), null);

export const listAdminResponses = (opportunityId: string) =>
  strictRead(() => participationService.listResponsesForOpportunity(opportunityId), []);

export const listAdminUsers = () => strictRead(() => adminUserService.listProfiles(), []);

export { listAuditLogs, countAuditLogs };

export const listEmailOutbox = (limit = 20) => strictRead(() => listOutbox(limit), []);

export const adminCounts = () =>
  strictRead(
    async () => {
      const [newsDraft, newsReview, newsPublished, projectsDraft, projectsPublished, noticesActive, docsPublished, submissionsOpen, responses, users, emailFailed] =
        await Promise.all([
          newsService.countPublishedNews().then(async (p) => {
            const all = await newsService.listAllNews();
            return all.filter((n) => ["DRAFT", "IN_REVIEW", "APPROVED"].includes(n.status)).length + p - p;
          }),
          (await newsService.listAllNews()).filter((n) => n.status === "IN_REVIEW").length,
          newsService.countPublishedNews(),
          (await projectService.listAllProjects()).filter((p) => p.status !== "PUBLISHED" && !p.archivedAt).length,
          projectService.countPublishedProjects(),
          noticeService.countActiveNotices(),
          documentService.countPublishedDocuments(),
          submissionService.countOpenSubmissions(),
          participationService.countAllResponses(),
          adminUserService.listProfiles().then((u) => u.filter((x) => x.isActive).length),
          listOutbox(100).then((o) => o.filter((x) => x.status === "FAILED").length),
        ]);
      return { newsDraft, newsReview, newsPublished, projectsDraft, projectsPublished, noticesActive, docsPublished, submissionsOpen, responses, users, emailFailed };
    },
    { newsDraft: 0, newsReview: 0, newsPublished: 0, projectsDraft: 0, projectsPublished: 0, noticesActive: 0, docsPublished: 0, submissionsOpen: 0, responses: 0, users: 0, emailFailed: 0 },
  );

export { nameOf };
