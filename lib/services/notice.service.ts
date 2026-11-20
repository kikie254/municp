import "server-only";

import { COLLECTIONS } from "../firebase/collections";
import { col, addDoc, getDocById, getDocByField, list, updateDoc } from "../firebase/db";
import type { NoticeRecord } from "../firebase/types";

const PUBLISHED = "PUBLISHED";

export type NoticeWrite = Omit<NoticeRecord, "id" | "createdAt" | "updatedAt">;

export async function createNotice(data: Omit<NoticeWrite, never>): Promise<{ id: string; slug: string }> {
  const created = await addDoc(COLLECTIONS.notices, { ...data, createdAt: new Date(), updatedAt: new Date() } as never);
  return { id: created.id, slug: data.slug };
}

export async function updateNotice(id: string, data: Partial<NoticeWrite>): Promise<void> {
  await updateDoc(COLLECTIONS.notices as never, id, { ...data, updatedAt: new Date() } as never);
}

export async function getNoticeById(id: string) {
  return getDocById(COLLECTIONS.notices, id);
}

export async function getNoticeBySlug(slug: string) {
  return getDocByField(COLLECTIONS.notices, "slug", slug);
}

export async function listAllNotices(): Promise<(NoticeRecord & { id: string })[]> {
  return list(COLLECTIONS.notices, (c) => c.orderBy("updatedAt", "desc"));
}

/** Published and not past expiry. */
export async function listActiveNotices(limit?: number): Promise<(NoticeRecord & { id: string })[]> {
  const rows = await list(
    COLLECTIONS.notices,
    (c) => c.where("status", "==", PUBLISHED).where("publishedAt", "<=", new Date()).where("archivedAt", "==", null).orderBy("publishedAt", "desc"),
    limit ?? 50,
  );
  const now = Date.now();
  return rows.filter((r) => !r.expiresAt || r.expiresAt.getTime() > now);
}

/** Published but past expiry — shown in an explicitly labelled archive list. */
export async function listExpiredNotices(limit = 20): Promise<(NoticeRecord & { id: string })[]> {
  const rows = await list(
    COLLECTIONS.notices,
    (c) => c.where("status", "==", PUBLISHED).where("archivedAt", "==", null).orderBy("publishedAt", "desc"),
    100,
  );
  const now = Date.now();
  return rows.filter((r) => r.expiresAt && r.expiresAt.getTime() <= now).slice(0, limit);
}

export async function searchPublishedNotices(term: string, max = 8): Promise<(NoticeRecord & { id: string })[]> {
  const t = term.toLowerCase();
  const active = await listActiveNotices(60);
  return active.filter((r) => r.title.toLowerCase().includes(t) || r.body.toLowerCase().includes(t)).slice(0, max);
}

export async function countActiveNotices(): Promise<number> {
  const snap = await col(COLLECTIONS.notices).where("status", "==", PUBLISHED).where("archivedAt", "==", null).count().get();
  const now = Date.now();
  const rows = await list(
    COLLECTIONS.notices,
    (c) => c.where("status", "==", PUBLISHED).where("archivedAt", "==", null),
    1000,
  );
  void snap;
  return rows.filter((r) => !r.expiresAt || r.expiresAt.getTime() > now).length;
}
