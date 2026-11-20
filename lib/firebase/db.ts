import "server-only";

import type { CollectionReference, DocumentData, Query } from "firebase-admin/firestore";

import { firestore } from "./admin";
import type { RecordOf } from "./types";
import type { CollectionName } from "./collections";

/**
 * Firestore data-access primitives.
 *
 * Every service reads and writes through these helpers so that:
 *  - Firestore Timestamps are converted to JS `Date` at the boundary (pages never see Firestore types);
 *  - the "no unbounded collection reads" rule has one place to be enforced (`list`);
 *  - document IDs are Firestore auto IDs — 20 random characters, never sequential or guessable,
 *    which is what protects citizen submissions from enumeration.
 */

type AnyTimestamp = { toDate(): Date };

function isTimestamp(value: unknown): value is AnyTimestamp {
  return typeof value === "object" && value !== null && typeof (value as AnyTimestamp).toDate === "function";
}

/** Recursively converts Firestore Timestamps (and arrays of them) to Dates. */
export function fromTimestamps<T>(data: DocumentData): T {
  const out: Record<string, unknown> = { ...data };
  for (const [key, value] of Object.entries(out)) {
    if (isTimestamp(value)) out[key] = value.toDate();
    else if (Array.isArray(value)) out[key] = value.map((v) => (isTimestamp(v) ? v.toDate() : v));
  }
  return out as T;
}

/** Typed handle on a collection. */
export function col<C extends CollectionName>(name: C): CollectionReference {
  return firestore().collection(name);
}

/** Fetches one document by ID and returns its typed record (with `id`), or null when absent. */
export async function getDocById<C extends CollectionName>(
  name: C,
  id: string,
): Promise<(RecordOf<C> & { id: string }) | null> {
  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) return null; // reject malformed IDs outright
  const snap = await col(name).doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...fromTimestamps<RecordOf<C>>(snap.data() as DocumentData) };
}

/** Fetches one document by a unique field (e.g. slug, reference). Returns null when absent. */
export async function getDocByField<C extends CollectionName>(
  name: C,
  field: string,
  value: string,
): Promise<(RecordOf<C> & { id: string }) | null> {
  const snap = await col(name).where(field, "==", value).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return { id: doc.id, ...fromTimestamps<RecordOf<C>>(doc.data() as DocumentData) };
}

/** Hard result cap enforced on every list operation — no page can scan an entire collection. */
export const MAX_PAGE = 500;

/**
 * Runs a bounded query. The builder receives the typed collection reference and returns a query; the
 * result cap is applied here so an omitted `.limit()` can never read a whole collection.
 */
export async function list<C extends CollectionName>(
  name: C,
  build: (c: CollectionReference) => Query,
  max: number = MAX_PAGE,
): Promise<(RecordOf<C> & { id: string })[]> {
  const snap = await build(col(name)).limit(max).get();
  return snap.docs.map((d) => ({ id: d.id, ...fromTimestamps<RecordOf<C>>(d.data() as DocumentData) }));
}

/** Adds a document with a Firestore auto ID (unguessable — protects citizen records). */
export async function addDoc<C extends CollectionName>(
  name: C,
  data: RecordOf<C>,
): Promise<{ id: string }> {
  const ref = await col(name).add(data as unknown as DocumentData);
  return { id: ref.id };
}

/** Creates or overwrites a document with a known ID (settings, rate-limit counters). */
export async function setDoc<C extends CollectionName>(
  name: C,
  id: string,
  data: RecordOf<C>,
): Promise<void> {
  await col(name).doc(id).set(data as unknown as DocumentData);
}

/** Updates specific fields of a document. */
export async function updateDoc<C extends CollectionName>(
  name: C,
  id: string,
  data: Partial<RecordOf<C>>,
): Promise<void> {
  await col(name).doc(id).update(data as unknown as DocumentData);
}
