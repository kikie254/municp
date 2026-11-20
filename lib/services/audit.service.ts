import "server-only";

import { FieldValue, type DocumentData } from "firebase-admin/firestore";

import { COLLECTIONS } from "../firebase/collections";
import { firestore } from "../firebase/admin";
import { col, addDoc, getDocById, list, updateDoc } from "../firebase/db";
import type { AuditLogRecord, SettingRecord, SubmissionRecord, SubmissionNoteRecord, NewsRecord, ProjectRecord, NoticeRecord, DocumentRecord, ParticipationOpportunityRecord, ParticipationResponseRecord, EmailOutboxRecord, AdminUserProfile } from "../firebase/types";

/**
 * Audit service — append-only from the application's perspective.
 *
 * Ordinary administrators can never edit or delete audit records: there is no application code path
 * that updates or deletes from /auditLogs, and the Firestore security rules deny all client access.
 * A separate scheduled export to a protected Google Cloud Storage bucket (see BACKUP_AND_RECOVERY.md)
 * provides tamper resistance beyond Firestore itself — Firestore alone is NOT immutable storage.
 *
 * For high-risk operations the caller uses `recordAuditStrict`, which throws when the audit write
 * fails so the operation cannot be reported as successful without its audit trail.
 */

export type AuditInput = {
  actorId?: string | null;
  actorEmail: string;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  ipHash?: string | null;
  correlationId?: string | null;
  outcome?: "SUCCESS" | "FAILURE" | "DENIED";
};

/** Writes one audit entry. Returns the created ID. Throws only in strict mode (recordAuditStrict). */
export async function writeAudit(input: AuditInput): Promise<string> {
  const { id } = await addDoc(COLLECTIONS.auditLogs, {
    actorId: input.actorId ?? null,
    actorEmail: input.actorEmail,
    actorRole: input.actorRole ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    summary: input.summary.slice(0, 500),
    ipHash: input.ipHash ?? null,
    correlationId: input.correlationId ?? null,
    outcome: input.outcome ?? "SUCCESS",
    createdAt: new Date(),
  } as unknown as AuditLogRecord);
  return id;
}

/** Fire-and-remember audit write for availability-critical paths. Failures are logged loudly. */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    await writeAudit(input);
  } catch (error) {
    console.error(
      "[audit] FAILED to record entry — audit trail is incomplete:",
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Strict audit write for high-risk operations (role changes, exports, administrator lifecycle).
 * A failure propagates so the surrounding operation is aborted — it must not be treated as
 * completed when its mandatory audit record could not be written.
 */
export async function recordAuditStrict(input: AuditInput): Promise<void> {
  await writeAudit(input);
}

export async function listAuditLogs(limit = 100, offset = 0): Promise<(AuditLogRecord & { id: string })[]> {
  const rows = await list(
    COLLECTIONS.auditLogs,
    (c) => c.orderBy("createdAt", "desc"),
    offset + limit,
  );
  return rows.slice(offset, offset + limit);
}

export async function countAuditLogs(): Promise<number> {
  // An aggregate count avoids reading every document.
  const snap = await col(COLLECTIONS.auditLogs).count().get();
  return snap.data().count;
}

/* ───────────────────────── Admin user profiles ───────────────────────── */

export async function getAdminProfile(uid: string): Promise<AdminUserProfile | null> {
  return getDocById(COLLECTIONS.adminUsers, uid);
}

export async function getAdminProfileByEmail(email: string): Promise<(AdminUserProfile & { id: string }) | null> {
  const snap = await col(COLLECTIONS.adminUsers).where("email", "==", email.toLowerCase()).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return { id: d.id, ...(d.data() as Omit<AdminUserProfile, "id">) };
}

export async function listAdminUsers(): Promise<(AdminUserProfile & { id: string })[]> {
  return list(COLLECTIONS.adminUsers, (c) => c.orderBy("createdAt", "asc"));
}

export async function createAdminProfile(profile: Omit<AdminUserProfile, "id">): Promise<string> {
  const ref = firestore().collection(COLLECTIONS.adminUsers).doc(profile.uid);
  await ref.set(profile as unknown as DocumentData);
  return ref.id;
}

export async function updateAdminProfile(
  uid: string,
  data: Partial<Omit<AdminUserProfile, "id">>,
): Promise<void> {
  await col(COLLECTIONS.adminUsers).doc(uid).update({ ...data, updatedAt: new Date() } as unknown as DocumentData);
}

export async function touchLastLogin(uid: string): Promise<void> {
  await col(COLLECTIONS.adminUsers).doc(uid).update({ lastLoginAt: new Date() } as unknown as DocumentData);
}

/** Batched counter increments keep denormalised counts consistent with their parent documents. */
export async function incrementCounter(
  collection: "submissions" | "participationOpportunities",
  id: string,
  field: "notesCount" | "responsesCount",
  by = 1,
): Promise<void> {
  await col(collection).doc(id).update({ [field]: FieldValue.increment(by) } as unknown as DocumentData);
}

export { COLLECTIONS, updateDoc };
export type { SettingRecord, SubmissionRecord, SubmissionNoteRecord, NewsRecord, ProjectRecord, NoticeRecord, DocumentRecord, ParticipationOpportunityRecord, ParticipationResponseRecord, EmailOutboxRecord };
