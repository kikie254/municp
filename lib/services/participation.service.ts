import "server-only";

import { FieldValue, type DocumentData } from "firebase-admin/firestore";

import { COLLECTIONS } from "../firebase/collections";
import { col, addDoc, getDocById, getDocByField, list, updateDoc } from "../firebase/db";
import { firestore } from "../firebase/admin";
import type { ParticipationOpportunityRecord, ParticipationResponseRecord } from "../firebase/types";

const PUBLISHED = "PUBLISHED";

export type OpportunityWrite = Omit<ParticipationOpportunityRecord, "id" | "createdAt" | "updatedAt" | "responsesCount">;

export async function createOpportunity(data: OpportunityWrite): Promise<{ id: string; slug: string }> {
  const created = await addDoc(
    COLLECTIONS.participationOpportunities,
    { ...data, responsesCount: 0, createdAt: new Date(), updatedAt: new Date() } as never,
  );
  return { id: created.id, slug: data.slug };
}

export async function updateOpportunity(id: string, data: Partial<OpportunityWrite>): Promise<void> {
  await updateDoc(COLLECTIONS.participationOpportunities as never, id, { ...data, updatedAt: new Date() } as never);
}

export async function getOpportunityById(id: string) {
  return getDocById(COLLECTIONS.participationOpportunities, id);
}

export async function getOpportunityBySlug(slug: string) {
  return getDocByField(COLLECTIONS.participationOpportunities, "slug", slug);
}

export async function listAllOpportunities(): Promise<(ParticipationOpportunityRecord & { id: string })[]> {
  return list(COLLECTIONS.participationOpportunities, (c) => c.orderBy("createdAt", "desc"));
}

export async function listPublishedOpportunities(): Promise<(ParticipationOpportunityRecord & { id: string })[]> {
  // DB-02 fix: the previous query filtered `publishedAt` with a range but ordered by `closesAt`
  // first — Firestore requires the range field to lead the orderBy, so the query was rejected and
  // the public page silently rendered "no consultation open". It now orders by publishedAt
  // (matching the declared index shape); closings are sorted in memory below, with open-ended
  // consultations (no closesAt) listed after dated ones instead of being dropped.
  const rows = await list(
    COLLECTIONS.participationOpportunities,
    (c) => c.where("status", "==", PUBLISHED).where("publishedAt", "<=", new Date()).orderBy("publishedAt", "desc"),
    100,
  );
  return rows.sort((a, b) => {
    if (!a.closesAt && !b.closesAt) return 0;
    if (!a.closesAt) return 1;
    if (!b.closesAt) return -1;
    return a.closesAt.getTime() - b.closesAt.getTime();
  });
}

export async function countPublishedOpportunities(): Promise<number> {
  const snap = await col(COLLECTIONS.participationOpportunities).where("status", "==", PUBLISHED).count().get();
  return snap.data().count;
}

/* ───────────────────────── Responses ───────────────────────── */

export async function createResponse(data: Omit<ParticipationResponseRecord, "id" | "createdAt">): Promise<{ id: string }> {
  // DB-04 fix: the response document and the parent counter increment are committed in one atomic
  // batch — a crash between the two writes can no longer desynchronise `responsesCount`.
  const batch = firestore().batch();
  const responseRef = col(COLLECTIONS.participationResponses).doc();
  batch.set(responseRef, { ...data, createdAt: new Date() } as unknown as DocumentData);
  batch.update(col(COLLECTIONS.participationOpportunities).doc(data.opportunityId), { responsesCount: FieldValue.increment(1) });
  await batch.commit();
  return { id: responseRef.id };
}

export async function listResponsesForOpportunity(opportunityId: string): Promise<(ParticipationResponseRecord & { id: string })[]> {
  return list(
    COLLECTIONS.participationResponses,
    (c) => c.where("opportunityId", "==", opportunityId).orderBy("createdAt", "asc"),
    5000,
  );
}

export async function countAllResponses(): Promise<number> {
  const snap = await col(COLLECTIONS.participationResponses).count().get();
  return snap.data().count;
}
