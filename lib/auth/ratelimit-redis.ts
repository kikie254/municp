import "server-only";

/**
 * Optional Redis (Upstash REST) rate-limit backend.
 *
 * The Firestore counter in ./ratelimit.ts is already distributed and survives serverless cold
 * starts. Redis is offered as a lower-latency alternative for high-traffic deployments because a
 * Firestore transaction per request costs money and adds ~20–40 ms. When the two variables below are
 * absent — the default — nothing changes and the Firestore limiter is used.
 *
 *   UPSTASH_REDIS_REST_URL=https://<id>.upstash.io
 *   UPSTASH_REDIS_REST_TOKEN=...
 *
 * Failure policy: any Redis error returns `null` so the caller falls back to Firestore. The limiter
 * is never silently disabled — the fallback path is itself a real limiter.
 */

export type RedisLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

function config(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

export function redisLimiterConfigured(): boolean {
  return config() !== null;
}

/** Fixed-window counter: INCR then EXPIRE on the first hit of the window. */
export async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RedisLimitResult | null> {
  const cfg = config();
  if (!cfg) return null;

  const bucket = Math.floor(Date.now() / windowMs);
  const redisKey = `rl:${key}:${bucket}`;
  const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const incr = await fetch(`${cfg.url}/incr/${encodeURIComponent(redisKey)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: "no-store",
    });
    if (!incr.ok) return null;
    const incrJson = (await incr.json()) as { result?: number };
    const count = Number(incrJson.result ?? 0);
    if (!Number.isFinite(count) || count <= 0) return null;

    if (count === 1) {
      // First hit of this window — set the expiry. A failed EXPIRE is not fatal: the window key
      // naturally becomes unreachable at the next bucket boundary.
      await fetch(`${cfg.url}/expire/${encodeURIComponent(redisKey)}/${ttlSeconds}`, {
        headers: { Authorization: `Bearer ${cfg.token}` },
        cache: "no-store",
      }).catch(() => undefined);
    }

    if (count > limit) {
      const windowEnd = (bucket + 1) * windowMs;
      return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil((windowEnd - Date.now()) / 1000)) };
    }
    return { allowed: true, remaining: Math.max(0, limit - count), retryAfterSeconds: 0 };
  } catch {
    return null;
  }
}
