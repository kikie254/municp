import { NextResponse } from "next/server";

import { databaseReachable } from "@/lib/db";
import { mailerConfigured } from "@/lib/services/email.service";
import { adminProjectConfigured, firebaseEnv } from "@/lib/firebase/config";
import { validateEnv } from "@/lib/config/env";
import { redisLimiterConfigured } from "@/lib/auth/ratelimit-redis";

export const dynamic = "force-dynamic";

/**
 * Operational health probe.
 *
 * Two levels, both secret-free:
 *  - `/api/health`        liveness for a load balancer / uptime monitor (200 or 503).
 *  - `/api/health?deep=1` readiness detail for an operator: component states as booleans and
 *                         environment findings by VARIABLE NAME only. No value, hostname, key or
 *                         stack trace is ever returned, so the endpoint can stay public.
 */
export async function GET(request: Request) {
  const deep = new URL(request.url).searchParams.get("deep") === "1";
  const db = await databaseReachable();
  const env = validateEnv();
  const missing = env.findings.filter((f) => f.severity === "required" && !f.present).map((f) => f.name);

  const body = {
    status: db && env.ok ? "ok" : "degraded",
    components: {
      database: db ? "up" : "down",
      firebaseProject: adminProjectConfigured() ? "configured" : "not-configured",
      documentStorage: firebaseEnv.storageBucket ? "configured" : "not-configured",
      email: mailerConfigured() ? "configured" : "not-configured",
      rateLimiter: redisLimiterConfigured() ? "redis" : "firestore",
      environment: env.ok ? "complete" : "incomplete",
    },
    ...(deep
      ? {
          environmentDetail: {
            production: env.production,
            missingRequired: missing,
            recommended: env.findings.filter((f) => f.severity === "recommended" && !f.present).map((f) => f.name),
          },
        }
      : {}),
    timestamp: new Date().toISOString(),
  };

  // A missing required production value is a deployment failure, not a warning: report 503 so the
  // platform's health gate refuses to route traffic to it.
  const healthy = db && env.ok;
  return NextResponse.json(body, { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
