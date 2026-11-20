import { NextResponse } from "next/server";

import { submissionSchema, fieldErrors } from "@/lib/validation/schemas";
import { hashIp, publicReference } from "@/lib/security/tokens";
import { rateLimit } from "@/lib/auth/ratelimit";
import { sameOrigin } from "@/lib/security/csrf";
import { recordAudit } from "@/lib/auth/audit";
import * as submissionService from "@/lib/services/submission.service";
import { logError } from "@/lib/firebase/errors";

export const dynamic = "force-dynamic";

/**
 * Machine-facing intake for citizen submissions.
 *
 * The website forms use a server action; this endpoint exists so an approved partner channel (a
 * kiosk, an SMS gateway) can submit through the same validation, rate limiting and audit path rather
 * than writing to Firestore directly. It returns only the reference — never the record.
 */
export async function POST(request: Request) {
  if (!(await sameOrigin())) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A JSON body is required." }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await rateLimit(`api-submit:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  const reference = publicReference(parsed.data.type);
  let created: { id: string; reference: string };
  try {
    created = await submissionService.createSubmission({
      reference,
      type: parsed.data.type,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      location: parsed.data.location ?? null,
      consent: parsed.data.consent,
      status: "RECEIVED",
      assignedToId: null,
      assignedToName: null,
      notesCount: 0,
      ipHash: hashIp(ip) ?? null,
      userAgent: (request.headers.get("user-agent") || "").slice(0, 250),
      resolvedAt: null,
    });
  } catch (error) {
    logError("api.submission", error);
    return NextResponse.json({ error: "The submission could not be recorded." }, { status: 500 });
  }

  await recordAudit({
    actorEmail: parsed.data.email, action: "SUBMISSION_RECEIVED_API", entityType: "Submission",
    entityId: created.id, summary: `${parsed.data.type} ${created.reference} received via API.`, ipHash: hashIp(ip) ?? null,
  });

  return NextResponse.json({ reference: created.reference, status: "RECEIVED" }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
