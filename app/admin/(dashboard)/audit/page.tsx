import Link from "next/link";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { listAuditLogs, countAuditLogs } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;

export default async function AdminAuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requirePermission("audit:read");
  const { page } = await searchParams;
  const current = Math.max(1, Number(page || "1") || 1);
  const [rows, total] = await Promise.all([listAuditLogs(PAGE_SIZE, (current - 1) * PAGE_SIZE), countAuditLogs()]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminHeading
        title="Audit log"
        intro={`Append-only record of administrative activity. ${total} entries stored; showing ${rows.length} on page ${current} of ${pages}.`}
      />
      {rows.length === 0 ? (
        <div className="border border-paper-line bg-white p-8">
          <p className="text-[13px] font-semibold text-ink">No entries yet.</p>
          <p className="mt-1.5 text-[12px] text-ink-muted">Sign-ins, content changes and workflow decisions appear here as they happen.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-paper-line bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">Audit entries, most recent first</caption>
              <thead>
                <tr className="border-b border-paper-line bg-paper-warm">
                  {["When", "Actor", "Action", "Entity", "Summary"].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="border-b border-paper-line last:border-0 align-top">
                    <td className="whitespace-nowrap px-3 py-2.5 text-[11px] text-ink-muted">{fmtDateTime(a.createdAt)}</td>
                    <td className="break-all px-3 py-2.5 text-[11px] text-ink-soft">{a.actorEmail}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-green-800">{a.action}</td>
                    <td className="px-3 py-2.5 text-[11px] text-ink-muted">{a.entityType}</td>
                    <td className="px-3 py-2.5 text-[11.5px] text-ink-soft">{a.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="Audit pagination" className="mt-4 flex items-center gap-3 text-[11.5px]">
            {current > 1 && <Link href={`/admin/audit?page=${current - 1}`} className="font-semibold text-green-700 hover:text-gold-700">← Newer</Link>}
            <span className="text-ink-muted">Page {current} of {pages}</span>
            {current < pages && <Link href={`/admin/audit?page=${current + 1}`} className="font-semibold text-green-700 hover:text-gold-700">Older →</Link>}
          </nav>
        </>
      )}
    </div>
  );
}
