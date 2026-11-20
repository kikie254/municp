import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { COLLECTIONS } from "../firebase/collections";
import { firestore } from "../firebase/admin";
import { hashIp } from "../security/tokens";
import { redisRateLimit, redisLimiterConfigured } from "./ratelimit-redis";

/**
 * Distributed fixed-window rate limiter.
 *
 * Two backends, chosen at runtime, both distributed (a process-local counter would reset on every
 * deploy and would not be shared across serverless instances):
 *
 *  1. Redis (Upstash REST) when UPSTASH_REDIS_REST_URL/TOKEN are present — lowest latency, ideal for
 *     the public intake endpoints.
 *  2. Firestore otherwise — a transactionally incremented counter document per key per window
 *     bucket, which survives cold starts and works with zero extra infrastructure.
 *
 * Failure policy: a Redis error falls through to Firestore; a Firestore error fails OPEN and is
 * logged loudly, so a limiter outage never takes the citizen enquiry form offline. The fallback is
 * always a real limiter, never "no limiter".
 */

export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

const WINDOW_MS_DEFAULT = 60 * 60 * 1000;

/** Prefers Redis when configured; returns null when it is not configured or errored. */
async function tryRedis(key: string, limit: number, windowMs: number): Promise<RateLimitResult | null> {
  if (!redisLimiterConfigured()) return null;
  return redisRateLimit(key, limit, windowMs);
}

export async function rateLimit(key: string, limit: number, windowMs: number = WINDOW_MS_DEFAULT): Promise<RateLimitResult> {
  const viaRedis = await tryRedis(key, limit, windowMs);
  if (viaRedis) return viaRedis;

  // Hashed key keeps the document id short and stops raw emails/IPs being stored as document ids.
  const hashed = createHash("sha256").update(`rl:${key}`).digest("hex").slice(0, 40);
  const bucket = Math.floor(Date.now() / windowMs);
  const docId = `${hashed}_${bucket}`;
  const ref = firestore().collection(COLLECTIONS.rateLimits).doc(docId);
  const windowStart = new Date(bucket * windowMs);

  try {
    const result = await firestore().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const current = snap.exists ? (snap.data() as { count: number }) : { count: 0 };
      if (current.count >= limit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((windowStart.getTime() + windowMs - Date.now()) / 1000));
        return { allowed: false, remaining: 0, retryAfterSeconds };
      }
      tx.set(ref, { count: current.count + 1, windowStart }, { merge: true });
      return { allowed: true, remaining: limit - current.count - 1, retryAfterSeconds: 0 };
    });
    return result;
  } catch (error) {
    console.error("[ratelimit] firestore limiter unavailable:", error instanceof Error ? error.message : error);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

/** Best-effort client address from the proxy headers. Only ever used hashed. */
export function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? undefined;
}

/** Retained for callers that hash an IP before rate limiting. */
export { hashIp, randomBytes };
