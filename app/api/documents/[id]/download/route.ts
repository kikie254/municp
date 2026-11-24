import "server-only";

import { Readable } from "node:stream";

import { NextResponse } from "next/server";

import { COLLECTIONS } from "@/lib/firebase/collections";
import { getDocById } from "@/lib/firebase/db";
import { openReadStream } from "@/lib/services/storage.service";
import { getSessionUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { recordAudit } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/ratelimit";
import { hashIp } from "@/lib/security/tokens";

export const dynamic = "force-dynamic";

/**
 * Document download — the only path to stored document bytes.
 *
 * Authorisation chain, evaluated on the server in order:
 *  1. The document metadata must exist in Firestore and its stored object must be present.
 *  2. A PUBLISHED, not-archived document is public.
 *  3. Anything else requires a signed-in administrator holding `documents:write` (RBAC-05 fix — a
 *     bare session is no longer enough to pull drafts, which may contain pre-decision budgets).
 *
 * The response is always an attachment with a fixed content type, never inline, so a crafted file
 * cannot execute in the site's origin. Downloads of unpublished documents are audited.
 *
 * ST-01 fix: the Content-Disposition header carries an ASCII fallback filename plus the RFC 5987
 * `filename*=UTF-8''…` form, so names containing en dashes or curly quotes no longer crash header
 * construction (they previously produced an unhandled 500 for every citizen).
 * ST-05 fix: the object is streamed, not buffered whole in function memory, and anonymous requests
 * are rate-limited per IP to bound storage egress cost.
 * ST-06 fix: shared/proxy caches may hold a published file for at most 60 seconds, so a withdrawn
 * document stops being served promptly.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getDocById(COLLECTIONS.documents, id).catch(() => null);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isPublished =
    record.status === "PUBLISHED" && record.publishedAt !== null && record.publishedAt.getTime() <= Date.now() && !record.archivedAt;
  if (!isPublished) {
    const user = await getSessionUser();
    // RBAC-05 fix: reviewing a draft file is a documents:write capability, not any-admin.
    if (!user || !can(user.role, "documents:write")) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await recordAudit({
      actorId: user.id, actorEmail: user.email, action: "DOCUMENT_DOWNLOAD_UNPUBLISHED", entityType: "DocumentRecord",
      entityId: id, summary: `Downloaded unpublished document "${record.fileName}".`,
      ipHash: hashIp(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined),
    });
  }

  // ST-05 fix: per-IP throttle on public egress (published downloads only — staff downloads are
  // already authenticated and audited).
  if (isPublished) {
    const ipHash = hashIp(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined);
    const limit = await rateLimit(`download:${id}:${ipHash ?? "unknown"}`, 30, 60 * 1000);
    if (limit.unavailable) return NextResponse.json({ error: "Document service is temporarily unavailable." }, { status: 503, headers: { "Retry-After": String(limit.retryAfterSeconds), "Cache-Control": "no-store" } });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many downloads from this connection. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }
  }

  if (record.storagePath === "pending") return NextResponse.json({ error: "The stored file is unavailable." }, { status: 410 });

  // ST-05 fix: stream the object instead of buffering it entirely in function memory.
  let stream: Readable;
  try {
    stream = await openReadStream(record.storagePath);
  } catch {
    return NextResponse.json({ error: "The stored file is unavailable." }, { status: 410 });
  }
  if (!stream) return NextResponse.json({ error: "The stored file is unavailable." }, { status: 410 });

  // ST-01 fix: Latin-1-safe fallback name plus the UTF-8 extended parameter. Building the header is
  // wrapped so an unexpected encoding failure can never surface as a bare 500.
  try {
    const asciiName = record.fileName.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "").trim() || "document";
    const utf8Name = encodeURIComponent(record.fileName);
    return new NextResponse(Readable.toWeb(stream) as unknown as ReadableStream, {
      headers: {
        "Content-Type": record.mimeType,
        "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${utf8Name}`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": isPublished ? "public, max-age=3600, s-maxage=60" : "no-store",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch {
    stream.destroy();
    return NextResponse.json({ error: "The stored file is unavailable." }, { status: 500 });
  }
}
