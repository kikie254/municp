import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { COLLECTIONS } from "../firebase/collections";
import { col, addDoc, getDocById, getDocByField, list, updateDoc } from "../firebase/db";
import { firestore } from "../firebase/admin";
import type { SubmissionRecord, SubmissionNoteRecord } from "../firebase/types";

/**
 * Citizen submission service.
 *
 * Document IDs are Firestore auto IDs — 20 random characters, never sequential or guessable — which
 * is what prevents enumeration of citizen records. The human-readable reference (ITM-ENQ-XXXX-XXXX)
 * is for citizens to quote, not a lookup key exposed to the public.
 */

const OPEN_STATUSES = ["RECEIVED", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS"];

export type SubmissionWrite = Omit<SubmissionRecord, "id" | "createdAt" | "updatedAt">;

export async function createSubmission(data: SubmissionWrite): Promise<{ id: string; reference: string }> {
  const created = await addDoc(COLLECTIONS.submissions, { ...data, notesCount: 0, createdAt: new Date(), updatedAt: new Date() } as never);
  return { id: created.id, reference: data.reference };
}

/** Guard against the (astronomically unlikely) reference collision: regenerate once. */
export async function referenceExists(reference: string): Promise<boolean> {
  return (await getDocByField(COLLECTIONS.submissions, "reference", reference)) !== null;
}

export async function getSubmissionById(id: string) {
  return getDocById(COLLECTIONS.submissions, id);
}

export async function listSubmissions(filter: { status?: string; type?: string }): Promise<(SubmissionRecord & { id: string })[]> {
  return list(
    COLLECTIONS.submissions,
    (c) => {
      let q = c as ReturnType<typeof col>;
      if (filter.status) q = q.where("status", "==", filter.status) as typeof q;
      if (filter.type) q = q.where("type", "==", filter.type) as typeof q;
      return q.orderBy("createdAt", "desc");
    },
    200,
  );
}

export async function updateSubmission(id: string, data: Partial<SubmissionWrite>): Promise<void> {
  await updateDoc(COLLECTIONS.submissions as never, id, { ...data, updatedAt: new Date() } as never);
}

export async function countOpenSubmissions(): Promise<number> {
  const snap = await col(COLLECTIONS.submissions).where("status", "in", OPEN_STATUSES).count().get();
  return snap.data().count;
}

export async function listAllSubmissionsForExport(max = 5000): Promise<(SubmissionRecord & { id: string })[]> {
  return list(COLLECTIONS.submissions, (c) => c.orderBy("createdAt", "desc"), max);
}

/* ───────────────────────── Notes ───────────────────────── */

export async function addSubmissionNote(data: Omit<SubmissionNoteRecord, "id" | "createdAt">): Promise<void> {
  // DB-04 fix: the note document and the parent `notesCount` increment are committed in one atomic
  // batch — a crash between the two writes can no longer desynchronise the counter.
  const batch = firestore().batch();
  const noteRef = col(COLLECTIONS.submissionNotes).doc();
  batch.set(noteRef, { ...data, createdAt: new Date() } as unknown as { [key: string]: unknown });
  batch.update(col(COLLECTIONS.submissions).doc(data.submissionId), { notesCount: FieldValue.increment(1) });
  await batch.commit();
}

/** Notes are fetched by explicit service call only — never through a public endpoint. */
export async function listNotesForSubmission(submissionId: string): Promise<(SubmissionNoteRecord & { id: string })[]> {
  return list(
    COLLECTIONS.submissionNotes,
    (c) => c.where("submissionId", "==", submissionId).orderBy("createdAt", "desc"),
    200,
  );
}
