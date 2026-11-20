import "server-only";

import { randomBytes } from "node:crypto";
import type { Readable } from "node:stream";

import { storageBucket } from "../firebase/admin";
import { logError } from "../firebase/errors";

/**
 * Firebase Cloud Storage — private document storage.
 *
 * Objects live under /private/… which no public rule can read (see storage.rules). The ONLY way to
 * retrieve a private file is the authorised download route, which checks the session, the record's
 * publication state and the caller's permission before streaming. Public content images (news and
 * project covers) are served through /public/… with a controlled cache lifetime.
 */

/** Randomised object name so stored names cannot be guessed or traversed. */
export function randomObjectName(originalName: string): string {
  const ext = originalName.includes(".") ? originalName.slice(originalName.lastIndexOf(".")).toLowerCase() : "";
  const rand = randomBytes(12).toString("base64url");
  return `${rand}${ext}`;
}

export function privateDocumentPath(documentId: string, originalName: string): string {
  return `private/documents/${documentId}/${randomObjectName(originalName)}`;
}

/** Uploads bytes to a private object. Server-side only; never callable by a browser. */
export async function uploadObject(storagePath: string, buffer: Buffer, mimeType: string): Promise<void> {
  const file = storageBucket().file(storagePath);
  await file.save(buffer, {
    contentType: mimeType,
    resumable: false,
    private: true,
    metadata: { cacheControl: "private, no-store" },
  });
}

/** Opens a stored object as a Node read stream for an authorised download. Throws when missing. */
export async function openReadStream(storagePath: string): Promise<Readable> {
  return storageBucket().file(storagePath).createReadStream();
}

/** Deletes a stored object. Missing objects are not an error for archive flows. */
export async function deleteObject(storagePath: string): Promise<void> {
  try {
    await storageBucket().file(storagePath).delete({ ignoreNotFound: true });
  } catch (error) {
    logError("storage.delete", error);
  }
}
