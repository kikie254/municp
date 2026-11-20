import "server-only";

import { firestore } from "@/lib/firebase/admin";

/**
 * Firestore connectivity check used by the health endpoint and the sign-in screen.
 * Never discloses infrastructure details — only an up/down boolean.
 */
export async function databaseReachable(): Promise<boolean> {
  try {
    await firestore().collection("systemMetadata").limit(1).get();
    return true;
  } catch {
    return false;
  }
}

/**
 * Runs a read and returns `fallback` when Firestore is unreachable. Public pages use this so a
 * database outage degrades to a labelled empty state rather than a 500 — the same availability
 * trade-off the Prisma layer made, now over Firestore.
 */
export async function safeRead<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[firestore] read failed:", error instanceof Error ? error.message : error);
    return fallback;
  }
}
