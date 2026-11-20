import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { AdminForm, AdminField } from "@/components/admin/AdminForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { saveProjectAction, transitionProjectAction } from "@/lib/actions/content";
import { getAdminProject } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Urban Infrastructure", "Environmental Initiatives", "Community Development", "Public Spaces", "Trade and Enterprise"] as const;
const PROJECT_STATUSES = ["Planned", "Ongoing", "Completed"] as const;

const TRANSITIONS: Record<string, { action: string; label: string }[]> = {
  DRAFT: [{ action: "submit", label: "Submit for review" }],
  IN_REVIEW: [{ action: "approve", label: "Approve" }, { action: "reject", label: "Return for revision" }],
  APPROVED: [{ action: "publish", label: "Publish" }, { action: "reject", label: "Return for revision" }],
  PUBLISHED: [{ action: "unpublish", label: "Unpublish" }],
};

export default async function ProjectEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("projects:write");
  const { id } = await params;
  const isNew = id === "new";
  const record = isNew ? null : await getAdminProject(id);
  if (!isNew && !record) notFound();

  return (
    <div>
      <AdminHeading
        title={isNew ? "New project record" : record!.title}
        intro={isNew ? "Only verified figures supplied by the Municipality should be entered." : `Last updated ${fmtDateTime(record!.updatedAt)}.`}
        action={<Link href="/admin/projects" className="text-[11px] font-semibold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">Back to list</Link>}
      />
      {record && (
        <div className="mb-6 flex items-center gap-3 border border-paper-line bg-white px-4 py-3">
          <StatusBadge status={record.status} />
          <span className="text-[11.5px] text-ink-muted">{record.publishedAt ? `Published ${fmtDateTime(record.publishedAt)}` : "Not published"}</span>
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section className="border border-paper-line bg-white p-5 md:p-6">
          <AdminForm action={saveProjectAction} submitLabel={isNew ? "Create draft" : "Save changes"}>
            {record && <input type="hidden" name="id" value={record.id} />}
            <AdminField label="Project title" name="title" value={record?.title} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Category" name="category" value={record?.category ?? "Urban Infrastructure"} options={CATEGORIES} required />
              <AdminField label="Implementation status" name="projectStatus" value={record?.projectStatus ?? "Planned"} options={PROJECT_STATUSES} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Location" name="location" value={record?.location} required hint="Ward or area, as officially described." />
              <AdminField label="Slug" name="slug" value={record?.slug} hint="Leave blank to generate." />
            </div>
            <AdminField label="Summary" name="summary" value={record?.summary} rows={3} required />
            <AdminField label="Description" name="description" value={record?.description} rows={10} required hint="Plain text. Blank lines separate paragraphs." />
            <AdminField label="Objectives" name="objectives" value={record?.objectives} rows={4} hint="One objective per line." />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Verified budget" name="budget" value={record?.budget} placeholder="e.g. KSh 12,000,000" hint="Leave blank if no verified figure exists. It will show as 'Not published'." />
              <AdminField label="Implementing agency" name="implementingAgency" value={record?.implementingAgency} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Start date" name="startDate" value={record?.startDate} placeholder="e.g. March 2025" />
              <AdminField label="Completion date" name="completionDate" value={record?.completionDate} placeholder="e.g. December 2026" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Image path" name="imagePath" value={record?.imagePath} />
              <AdminField label="Image alternative text" name="imageAlt" value={record?.imageAlt} />
            </div>
          </AdminForm>
        </section>
        <aside className="space-y-5">
          <section className="border border-paper-line bg-white p-5">
            <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.13em] text-ink-muted">Workflow</h2>
            {!record ? (
              <p className="mt-3 text-[12px] text-ink-muted">Save the record first to move it through review.</p>
            ) : (TRANSITIONS[record.status] ?? []).length === 0 ? (
              <p className="mt-3 text-[12px] text-ink-muted">No transitions available from this status.</p>
            ) : (
              <form action={transitionProjectAction} className="mt-3 space-y-2">
                <input type="hidden" name="id" value={record.id} />
                <div className="flex flex-wrap gap-2">
                  {(TRANSITIONS[record.status] ?? []).map((t) => (
                    <button key={t.action} type="submit" name="action" value={t.action}
                      className={`btn !py-2 !text-[11px] ${t.action === "reject" ? "btn-outline" : "btn-primary"}`}>{t.label}</button>
                  ))}
                </div>
                <p className="pt-1 text-[11px] text-ink-muted">Authors cannot review their own records.</p>
              </form>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
