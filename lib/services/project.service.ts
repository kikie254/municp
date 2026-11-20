import "server-only";

import { COLLECTIONS } from "../firebase/collections";
import { col, addDoc, getDocById, getDocByField, list, updateDoc } from "../firebase/db";
import { searchTermsFor } from "./news.service";
import type { ProjectRecord } from "../firebase/types";

/**
 * Project service — Firestore implementation of ProjectRecord. Financial figures are stored only
 * when the Municipality supplied them; this service never generates values.
 */

export type ProjectWrite = Omit<ProjectRecord, "id" | "createdAt" | "updatedAt">;

const PUBLISHED = "PUBLISHED";

export async function createProject(data: Omit<ProjectWrite, "searchTerms">): Promise<{ id: string; slug: string }> {
  const doc: ProjectWrite = {
    ...data,
    searchTerms: searchTermsFor({ title: data.title, summary: data.summary, body: data.description, location: data.location }),
  };
  const created = await addDoc(COLLECTIONS.projects, { ...doc, createdAt: new Date(), updatedAt: new Date() } as never);
  return { id: created.id, slug: data.slug };
}

export async function updateProject(id: string, data: Partial<ProjectWrite>): Promise<void> {
  const patch: Record<string, unknown> = { ...data, updatedAt: new Date() };
  if (data.title || data.summary || data.description || data.location) {
    const current = await getDocById(COLLECTIONS.projects, id);
    if (!current) throw new Error("Project record not found.");
    patch.searchTerms = searchTermsFor({
      title: data.title ?? current.title,
      summary: data.summary ?? current.summary,
      body: data.description ?? current.description,
      location: data.location ?? current.location,
    });
  }
  await updateDoc(COLLECTIONS.projects as never, id, patch as never);
}

export async function getProjectById(id: string) {
  return getDocById(COLLECTIONS.projects, id);
}

export async function getProjectBySlug(slug: string) {
  return getDocByField(COLLECTIONS.projects, "slug", slug);
}

export async function listAllProjects(): Promise<(ProjectRecord & { id: string })[]> {
  return list(COLLECTIONS.projects, (c) => c.orderBy("updatedAt", "desc"));
}

export async function listPublishedProjects(limit?: number): Promise<(ProjectRecord & { id: string })[]> {
  return list(
    COLLECTIONS.projects,
    (c) => c.where("status", "==", PUBLISHED).where("publishedAt", "<=", new Date()).where("archivedAt", "==", null).orderBy("publishedAt", "desc"),
    limit ?? 100,
  );
}

export async function searchPublishedProjects(term: string, max = 8): Promise<(ProjectRecord & { id: string })[]> {
  const t = term.toLowerCase();
  const rows = await listPublishedProjects(60);
  return rows
    .filter((r) => r.title.toLowerCase().includes(t) || r.summary.toLowerCase().includes(t) || r.location.toLowerCase().includes(t))
    .slice(0, max);
}

export async function countPublishedProjects(): Promise<number> {
  const snap = await col(COLLECTIONS.projects).where("status", "==", PUBLISHED).where("archivedAt", "==", null).count().get();
  return snap.data().count;
}
