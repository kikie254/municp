import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { listAdminProjects } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requirePermission("projects:write");
  const rows = await listAdminProjects();
  return (
    <div>
      <AdminHeading
        title="Municipal projects"
        intro="Project records are published only with verified information from the Municipality. Leave a field blank rather than estimate it."
        action={<Link href="/admin/projects/new" className="btn btn-primary !py-2.5 !text-[11.5px]"><Plus aria-hidden="true" /> New project</Link>}
      />
      {rows.length === 0 ? (
        <div className="border border-paper-line bg-white p-8">
          <p className="text-[13px] font-semibold text-ink">No project records yet.</p>
          <p className="mt-1.5 max-w-lg text-[12px] leading-relaxed text-ink-muted">
            The public projects page shows a labelled empty state until a verified record is published.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-paper-line bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">Project records</caption>
            <thead>
              <tr className="border-b border-paper-line bg-paper-warm">
                {["Project", "Category", "Status", "Workflow", "Budget", "Updated"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-paper-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/projects/${r.id}`} className="text-[12.5px] font-semibold text-green-900 hover:text-gold-700">{r.title}</Link>
                    <span className="mt-0.5 block text-[10.5px] text-ink-muted">{r.location}</span>
                  </td>
                  <td className="px-4 py-3 text-[11.5px] text-ink-soft">{r.category}</td>
                  <td className="px-4 py-3 text-[11.5px] text-ink-soft">{r.projectStatus}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-[11.5px] text-ink-soft">{r.budget || "Not published"}</td>
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
