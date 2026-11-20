import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { listAdminNews } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  await requirePermission("news:write");
  const rows = await listAdminNews();

  return (
    <div>
      <AdminHeading
        title="News and announcements"
        intro="Draft, review and publish. Nothing appears on the public site until it is published by a reviewer who did not write it."
        action={<Link href="/admin/news/new" className="btn btn-primary !py-2.5 !text-[11.5px]"><Plus aria-hidden="true" /> New article</Link>}
      />

      {rows.length === 0 ? (
        <div className="border border-paper-line bg-white p-8 text-center">
          <p className="text-[13px] font-semibold text-ink">No articles yet.</p>
          <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-relaxed text-ink-muted">
            Create the first draft. It stays private until a reviewer approves and publishes it.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-paper-line bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">All news articles with workflow status</caption>
            <thead>
              <tr className="border-b border-paper-line bg-paper-warm">
                {["Title", "Category", "Status", "Author", "Reviewer", "Updated"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-paper-line last:border-0 hover:bg-paper-warm/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/news/${r.id}`} className="text-[12.5px] font-semibold text-green-900 hover:text-gold-700">{r.title}</Link>
                    <span className="mt-0.5 block font-mono text-[10px] text-ink-muted">/{r.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-[11.5px] text-ink-soft">{r.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-[11.5px] text-ink-soft">{r.author.name}</td>
                  <td className="px-4 py-3 text-[11.5px] text-ink-soft">{r.reviewer?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-ink-muted">{fmtDateTime(r.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
