import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { recordAuditStrict } from "@/lib/auth/audit";
import { hashIp } from "@/lib/security/tokens";
import * as participationService from "@/lib/services/participation.service";

export const dynamic = "force-dynamic";

/** Neutralises spreadsheet formula injection and escapes RFC 4180 specials. */
function csvCell(value: string | null | undefined) {
  const raw = value ?? "";
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || !can(user.role, "participation:manage")) {
    return NextResponse.json({ error: "Not authorised." }, { status: 403 });
  }
  const { id } = await context.params;
  const opportunity = await participationService.getOpportunityById(id).catch(() => null);
  if (!opportunity) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const responses = await participationService.listResponsesForOpportunity(id);

  const header = ["Reference", "Received", "Name", "Email", "Phone", "Ward", "Organisation", "Response", "Consent"];
  const lines = [header.map(csvCell).join(",")];
  for (const r of responses) {
    lines.push([
      r.reference, r.createdAt.toISOString(), r.name, r.email, r.phone ?? "", r.ward ?? "", r.organisation ?? "", r.response, r.consent ? "yes" : "no",
    ].map(csvCell).join(","));
  }

  await recordAuditStrict({
    actorId: user.id,
    actorEmail: user.email,
    action: "PARTICIPATION_RESPONSES_EXPORTED",
    entityType: "ParticipationOpportunity",
    entityId: id,
    summary: `Exported ${responses.length} responses for "${opportunity.title}".`,
    // AUD-05 fix: pseudonymise the FIRST HOP of x-forwarded-for, exactly like every other route,
    // so audit correlation by ipHash is consistent.
    ipHash: hashIp(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined),
  });

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="participation-${opportunity.slug}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
