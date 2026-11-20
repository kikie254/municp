import "server-only";

import { COLLECTIONS } from "../firebase/collections";
import { col, addDoc, getDocById, list, updateDoc } from "../firebase/db";
import { storageBucket } from "../firebase/admin";
import type { DocumentRecord } from "../firebase/types";

/**
 * Document metadata service — Firestore records + Cloud Storage bytes.
 * Bytes are NEVER stored in Firestore (no Base64 documents) and metadata records point at private
 * /private/documents/{documentId}/{filename} objects that no public URL can reach.
 */

const PUBLISHED = "PUBLISHED";

export type DocumentWrite = Omit<DocumentRecord, "id" | "createdAt" | "updatedAt">;

export async function createDocument(data: Omit<DocumentWrite, never>): Promise<{ id: string }> {
  return addDoc(COLLECTIONS.documents, { ...data, createdAt: new Date(), updatedAt: new Date() } as never);
}

export async function updateDocument(id: string, data: Partial<DocumentWrite>): Promise<void> {
  await updateDoc(COLLECTIONS.documents as never, id, { ...data, updatedAt: new Date() } as never);
}

export async function getDocumentById(id: string) {
  return getDocById(COLLECTIONS.documents, id);
}

export async function listAllDocuments(): Promise<(DocumentRecord & { id: string })[]> {
  return list(COLLECTIONS.documents, (c) => c.orderBy("createdAt", "desc"));
}

export async function listPublishedDocuments(limit?: number): Promise<(DocumentRecord & { id: string })[]> {
  return list(
    COLLECTIONS.documents,
    (c) => c.where("status", "==", PUBLISHED).where("publishedAt", "<=", new Date()).where("archivedAt", "==", null).orderBy("publishedAt", "desc"),
    limit ?? 100,
  );
}

export async function searchPublishedDocuments(term: string, max = 8): Promise<(DocumentRecord & { id: string })[]> {
  const t = term.toLowerCase();
  const rows = await listPublishedDocuments(60);
  return rows
    .filter((r) => r.title.toLowerCase().includes(t) || r.description.toLowerCase().includes(t) || r.category.toLowerCase().includes(t))
    .slice(0, max);
}

export async function countPublishedDocuments(): Promise<number> {
  const snap = await col(COLLECTIONS.documents).where("status", "==", PUBLISHED).where("archivedAt", "==", null).count().get();
  return snap.data().count;
}

/**
 * Deletes the stored object bytes. The metadata record is archived (never hard-deleted) so the
 * download history and audit trail remain meaningful.
 */
export async function deleteStoredObject(storagePath: string): Promise<void> {
  try {
    await storageBucket().file(storagePath).delete({ ignoreNotFound: true });
  } catch (error) {
    // The metadata record is archived regardless; a missing object must not fail the archive flow.
    console.error("[storage] object delete failed:", error instanceof Error ? error.message : error);
  }
}

/** Streams the stored object. Returns null when the object is missing. */
export async function readStoredObject(storagePath: string): Promise<Buffer | null> {
  try {
    const [buffer] = await storageBucket().file(storagePath).download();
    return buffer;
  } catch {
    return null;
  }
}
