import "server-only";

import { COLLECTIONS } from "../firebase/collections";
import { col, addDoc, getDocById, getDocByField, list, updateDoc } from "../firebase/db";
import { ServiceError } from "../firebase/errors";
import type { NewsRecord } from "../firebase/types";

/**
 * News service — Firestore implementation of the editorial workflow
 * DRAFT → IN_REVIEW → APPROVED → PUBLISHED → ARCHIVED.
 * State transitions themselves are enforced in lib/actions/content.ts (authorisation lives there);
 * this service owns reads, writes and uniqueness.
 */

export type NewsWrite = Omit<NewsRecord, "id" | "createdAt" | "updatedAt">;

const PUBLISHED = "PUBLISHED";

/** Lower-cased keyword set used by site search (Firestore has no full-text contains). */
export function searchTermsFor(fields: { title: string; summary: string; body: string; location?: string }): string[] {
  const text = [fields.title, fields.summary, fields.body, fields.location ?? ""]
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");
  return Array.from(new Set(text.split(/\s+/).filter((w) => w.length >= 3))).slice(0, 200);
}

export async function createNews(data: Omit<NewsWrite, "searchTerms">): Promise<{ id: string; slug: string }> {
  const doc: NewsWrite = {
    ...data,
    searchTerms: searchTermsFor({ title: data.title, summary: data.summary, body: data.body }),
  };
  const created = await addDoc(COLLECTIONS.news, { ...doc, createdAt: new Date(), updatedAt: new Date() } as never);
  return { id: created.id, slug: data.slug };
}

export async function updateNews(id: string, data: Partial<NewsWrite>): Promise<void> {
  const patch: Record<string, unknown> = { ...data, updatedAt: new Date() };
  if (data.title || data.summary || data.body) {
    const current = await getDocById(COLLECTIONS.news, id);
    if (!current) throw new ServiceError("News article not found.", "not-found");
    patch.searchTerms = searchTermsFor({
      title: data.title ?? current.title,
      summary: data.summary ?? current.summary,
      body: data.body ?? current.body,
    });
  }
  await updateDoc(COLLECTIONS.news as never, id, patch as never);
}

export async function getNewsById(id: string) {
  return getDocById(COLLECTIONS.news, id);
}

export async function getNewsBySlug(slug: string) {
  return getDocByField(COLLECTIONS.news, "slug", slug);
}

export async function listAllNews(): Promise<(NewsRecord & { id: string })[]> {
  return list(COLLECTIONS.news, (c) => c.orderBy("updatedAt", "desc"));
}

/** Public reads: only PUBLISHED, published in the past, and not archived — filtered in the query. */
export async function listPublishedNews(limit?: number): Promise<(NewsRecord & { id: string })[]> {
  const rows = await list(
    COLLECTIONS.news,
    (c) => c.where("status", "==", PUBLISHED).where("publishedAt", "<=", new Date()).where("archivedAt", "==", null).orderBy("publishedAt", "desc"),
    limit ?? 100,
  );
  return rows;
}

/** Bounded in-memory term match over a capped window of published documents. */
export async function searchPublishedNews(term: string, max = 8): Promise<(NewsRecord & { id: string })[]> {
  const t = term.toLowerCase();
  const rows = await listPublishedNews(60);
  return rows.filter((r) => r.title.toLowerCase().includes(t) || r.summary.toLowerCase().includes(t) || r.body.toLowerCase().includes(t)).slice(0, max);
}

export async function countPublishedNews(): Promise<number> {
  const snap = await col(COLLECTIONS.news).where("status", "==", PUBLISHED).where("archivedAt", "==", null).count().get();
  return snap.data().count;
}
