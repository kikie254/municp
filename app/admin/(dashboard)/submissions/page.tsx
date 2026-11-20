import Link from "next/link";
import { Download } from "lucide-react";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { listAdminSubmissions } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const STATUSES = ["RECEIVED", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const TYPES = ["ENQUIRY", "FEEDBACK", "COMPLAINT", "SUGGESTION", "PARTICIPATION"];

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: Promise<{ status?: string; type?: string }> }) {
  await requirePermission("submissions:read");
  const { status, type } = await searchParams;
  const rows = await listAdminSubmissions({ status, type });

  const qs = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status, type, ...next };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/admin/submissions?${s}` : "/admin/submissions";
  };

  return (
    <div>
      <AdminHeading
        title="Feedback, complaints and enquiries"
        intro="Citizen submissions are private. They are never published, and the export is restricted to roles with submission access."
        action={
          <a href="/api/admin/submissions/export" className="btn btn-outline !py-2 !text-[11px]">
            <Download aria-hidden="true" /> Export CSV
          </a>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href={qs({ status: undefined })} className={`border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${!status ? "border-green-800 bg-green-800 text-white" : "border-paper-line bg-white text-ink-soft"}`}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={qs({ status: s })} className={`border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${status === s ? "border-green-800 bg-green-800 text-white" : "border-paper-line bg-white text-ink-soft"}`}>
            {s.replace(/_/g, " ").toLowerCase()}
          </Link>
        ))}
        <span className="mx-1 h-4 w-px bg-paper-line" aria-hidden="true" />
        {TYPES.map((t) => (
          <Link key={t} href={qs({ type: type === t ? undefined : t })} className={`border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${type === t ? "border-gold-600 bg-gold-400 text-green-950" : "border-paper-line bg-white text-ink-soft"}`}>
            {t.toLowerCase()}
          </Link>
        ))}
      </div>

      <p className="mb-3 text-[11.5px] text-ink-muted" role="status">
        {rows.length} {rows.length === 1 ? "submission" : "submissions"} shown (most recent 200).
      </p>

      {rows.length === 0 ? (
        <div className="border border-paper-line bg-white p-8 text-center">
          <p className="text-[13px] font-semibold text-ink">Nothing matches this filter.</p>
          <p className="mt-1.5 text-[12px] text-ink-muted">Submissions arrive here the moment a citizen sends the public form.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-paper-line bg-white">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <caption className="sr-only">Citizen submissions</caption>
            <thead>
              <tr className="border-b border-paper-line bg-paper-warm">
                {["Reference", "Subject", "Type", "Received", "Status", "Assigned", "Notes"].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-b border-paper-line last:border-0 hover:bg-paper-warm/60">
                  <td className="px-3 py-3 font-mono text-[10.5px] text-green-800">
                    <Link href={`/admin/submissions/${s.id}`} className="hover:text-gold-700">{s.reference}</Link>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-ink">{s.subject}</td>
                  <td className="px-3 py-3 text-[11px] uppercase tracking-[0.05em] text-ink-muted">{s.type.toLowerCase()}</td>
                  <td className="px-3 py-3 text-[11px] text-ink-muted">{fmtDateTime(s.createdAt)}</td>
                  <td className="px-3 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-3 py-3 text-[11px] text-ink-soft">{s.assignedToName ?? "—"}</td>
                  <td className="px-3 py-3 text-[11px] text-ink-muted">{s.notesCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
