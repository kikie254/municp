"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { firebaseAdminAuth } from "@/lib/firebase/admin";
import { assertPermission } from "@/lib/auth/session";
import { recordAudit, recordAuditStrict } from "@/lib/auth/audit";
import { hashIp } from "@/lib/security/tokens";
import { passwordPolicyIssues } from "@/lib/auth/password";
import { fieldErrors, userSchema } from "@/lib/validation/schemas";
import * as adminUserService from "@/lib/services/admin-user.service";
import * as submissionService from "@/lib/services/submission.service";
import { requeueEmail, countFailedEmails, listOutbox } from "@/lib/services/email.service";
import { logError } from "@/lib/firebase/errors";
import type { ActionState } from "./types";

const SUBMISSION_STATUSES = ["RECEIVED", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

async function ipHash() {
  const h = await headers();
  return hashIp(h.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined);
}

/** Case management: status change and assignment, both audited. */
export async function updateSubmissionAction(formData: FormData): Promise<void> {
  const auth = await assertPermission("submissions:manage");
  if ("error" in auth) return;

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const assignedToId = String(formData.get("assignedToId") || "");
  if (!SUBMISSION_STATUSES.includes(status as (typeof SUBMISSION_STATUSES)[number])) return;

  const before = await submissionService.getSubmissionById(id).catch(() => null);
  if (!before) return;

  let assignedToName: string | null = before.assignedToName;
  if (assignedToId && assignedToId !== before.assignedToId) {
    const assignee = await adminUserService.getProfile(assignedToId);
    assignedToName = assignee?.name ?? assignedToName;
  }

  await submissionService.updateSubmission(id, {
    status: status as (typeof SUBMISSION_STATUSES)[number],
    assignedToId: assignedToId || null,
    assignedToName,
    resolvedAt: status === "RESOLVED" || status === "CLOSED" ? (before.resolvedAt ?? new Date()) : null,
  });
  await recordAudit({
    actorId: auth.user.id, actorEmail: auth.user.email, action: "SUBMISSION_STATUS_CHANGED",
    entityType: "Submission", entityId: id,
    summary: `${before.reference}: ${before.status} → ${status}${assignedToId ? ", assigned" : ""}.`,
    ipHash: await ipHash(),
  });
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function addSubmissionNoteAction(formData: FormData): Promise<void> {
  const auth = await assertPermission("submissions:manage");
  if ("error" in auth) return;
  const submissionId = String(formData.get("submissionId") || "");
  const body = String(formData.get("body") || "").trim();
  if (body.length < 3) return;

  const submission = await submissionService.getSubmissionById(submissionId).catch(() => null);
  if (!submission) return;

  // Internal notes live in their own collection with no public read path anywhere in the rules.
  await submissionService.addSubmissionNote({
    submissionId,
    authorId: auth.user.id,
    authorName: auth.user.name,
    body: body.slice(0, 4000),
    internal: true,
  });
  await recordAudit({
    actorId: auth.user.id, actorEmail: auth.user.email, action: "SUBMISSION_NOTE_ADDED",
    entityType: "Submission", entityId: submissionId, summary: `Internal note added to ${submission.reference}.`,
    ipHash: await ipHash(),
  });
  revalidatePath(`/admin/submissions/${submissionId}`);
}

/**
 * User administration — super administrators only. Roles are written to the trusted Firestore
 * profile, mirrored into Firebase custom claims, and every change revokes the target's sessions.
 * The four-eyes protection here: you cannot change or deactivate your own account, and the last
 * active super administrator cannot be removed or demoted.
 */
export async function saveUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await assertPermission("users:manage");
  if ("error" in auth) return { status: "error", message: auth.error };

  const parsed = userSchema.safeParse({
    id: String(formData.get("id") || "") || undefined,
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    role: String(formData.get("role") || "CONTENT_ADMIN"),
    password: String(formData.get("password") || ""),
  });
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), message: "Please correct the highlighted fields." };
  const d = parsed.data;

  if (d.id === auth.user.id && d.role !== "SUPER_ADMIN") {
    return { status: "error", message: "You cannot change your own role. Ask another super administrator." };
  }

  try {
    if (d.id) {
      const before = await adminUserService.getProfile(d.id);
      if (!before) return { status: "error", message: "That account no longer exists." };

      if (d.role !== before.role) {
        // Protects the last active super administrator from demotion.
        if (before.role === "SUPER_ADMIN" && d.role !== "SUPER_ADMIN") {
          const supers = await adminUserService.countActiveSuperAdmins();
          if (supers <= 1) return { status: "error", message: "At least one active super administrator must remain." };
        }
        await adminUserService.changeRole(d.id, d.role, { uid: auth.user.id, email: auth.user.email });
      }
      await adminUserService.updateAdminProfileRaw(d.id, { name: d.name });
      if (d.email !== before.email) {
        await firebaseAdminAuth().updateUser(d.id, { email: d.email, emailVerified: true });
        await adminUserService.updateAdminProfileRaw(d.id, { email: d.email });
      }
      if (d.password) {
        const issues = passwordPolicyIssues(d.password);
        if (issues.length) return { status: "error", errors: { password: issues.join(" ") } };
        await adminUserService.setAdminPassword(d.id, d.password, { uid: auth.user.id, email: auth.user.email });
      }
      await recordAudit({
        actorId: auth.user.id, actorEmail: auth.user.email, action: "USER_UPDATED", entityType: "AdminUser",
        entityId: d.id, summary: `Updated account ${d.email}${d.password ? " (password reset, sessions revoked)" : ""}.`,
        ipHash: await ipHash(),
      });
      revalidatePath("/admin/users");
      return { status: "ok", message: "Account updated." };
    }

    // New accounts are provisioned through the controlled path — never public registration.
    if (!d.password) return { status: "error", errors: { password: "Set an initial password." } };
    const issues = passwordPolicyIssues(d.password);
    if (issues.length) return { status: "error", errors: { password: issues.join(" ") } };

    const existing = await adminUserService.getProfileByEmail(d.email);
    if (existing) return { status: "error", errors: { email: "An account with that address already exists." } };

    const created = await adminUserService.provisionAdmin({
      email: d.email, name: d.name, role: d.role, password: d.password,
      createdByUid: auth.user.id, createdByEmail: auth.user.email,
    });
    await recordAuditStrict({
      actorId: auth.user.id, actorEmail: auth.user.email, actorRole: auth.user.role, action: "USER_CREATED",
      entityType: "AdminUser", entityId: created.uid, summary: `Created ${d.role} account for ${d.email}.`,
      ipHash: await ipHash(),
    });
    revalidatePath("/admin/users");
    return { status: "ok", message: `Account created for ${d.email}.` };
  } catch (error) {
    logError("user.save", error);
    return { status: "error", message: "The account could not be saved." };
  }
}

export async function toggleUserAction(formData: FormData): Promise<void> {
  const auth = await assertPermission("users:manage");
  if ("error" in auth) return;
  const id = String(formData.get("id") || "");
  if (id === auth.user.id) return; // never deactivate yourself

  const user = await adminUserService.getProfile(id).catch(() => null);
  if (!user) return;

  const supers = await adminUserService.countActiveSuperAdmins();
  if (user.role === "SUPER_ADMIN" && user.isActive && supers <= 1) return; // keep the last one

  try {
    await adminUserService.setActive(id, !user.isActive, { uid: auth.user.id, email: auth.user.email });
  } catch (error) {
    logError("user.toggle", error);
    return;
  }
  revalidatePath("/admin/users");
}

export async function retryEmailAction(formData: FormData): Promise<void> {
  // RBAC-07 fix: a mutating action must be gated by a manage permission, not a read permission
  // (previously every role could re-queue notifications because all roles hold settings:read).
  const auth = await assertPermission("users:manage");
  if ("error" in auth) return;
  const id = String(formData.get("id") || "");
  // Re-queue only; the provider call is performed when the queue is next processed, so this never
  // claims a send that has not happened.
  await requeueEmail(id);
  await recordAudit({
    actorId: auth.user.id, actorEmail: auth.user.email, action: "EMAIL_REQUEUED", entityType: "EmailOutbox",
    entityId: id, summary: "Re-queued notification.", ipHash: await ipHash(),
  });
  revalidatePath("/admin/settings");
}

export { listOutbox, countFailedEmails };
