import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { recordAuditStrict } from "@/lib/auth/audit";
import { hashIp } from "@/lib/security/tokens";
import * as submissionService from "@/lib/services/submission.service";

export const dynamic = "force-dynamic";

/** RFC 4180 field escaping. A leading =, +, - or @ is neutralised to stop spreadsheet formula injection. */
function csvCell(value: string | null | undefined): string {
  let s = (value ?? "").replace(/\r?\n/g, " ");
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * Submission export for authorised administrators only.
 *
 * The permission is checked on the server against the session, not by a hidden button. Every export
 * is audited (strictly — a failed audit record aborts the export), because moving citizen personal
 * data out of the platform is a controlled action under the Data Protection Act, 2019.
 */
export async function GET(request: Request) {
  const user = await getSessionUser();
  // RBAC-01 fix: a full PII export of citizen complaints is a SUPER_ADMIN capability. It was
  // previously available to every role holding submissions:read (including PROJECT_ADMIN and
  // REVIEWER, who need read access for triage, not bulk export).
  if (!user || !can(user.role, "submissions:manage")) {
    return NextResponse.json({ error: "Not authorised." }, { status: 403 });
  }

  const rows = await submissionService.listAllSubmissionsForExport();
  // AUD-01 fix: a failed audit record aborts the export — the comment already promised this, but
  // the code called the lenient writer that swallows errors.
  await recordAuditStrict({
    actorId: user.id, actorEmail: user.email, action: "SUBMISSIONS_EXPORTED", entityType: "Submission",
    summary: `Exported ${rows.length} submissions as CSV.`,
    ipHash: hashIp(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined),
  });

  const header = ["Reference", "Type", "Status", "Received", "Name", "Email", "Phone", "Area", "Subject", "Message", "Consent"];
  const body = rows.map((r) => [
    r.reference, r.type, r.status, r.createdAt.toISOString(), r.name, r.email, r.phone, r.location,
    r.subject, r.message, r.consent ? "yes" : "no",
  ].map(csvCell).join(","));

  const csv = [header.map(csvCell).join(","), ...body].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
