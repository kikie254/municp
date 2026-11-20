import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { AdminForm, AdminField } from "@/components/admin/AdminForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { saveNewsAction, transitionNewsAction } from "@/lib/actions/content";
import { getAdminNews } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Municipal News", "Public Notices", "Development Updates", "Community Activities", "Events"] as const;

const TRANSITIONS: Record<string, { action: string; label: string }[]> = {
  DRAFT: [{ action: "submit", label: "Submit for review" }],
  IN_REVIEW: [
    { action: "approve", label: "Approve" },
    { action: "reject", label: "Return for revision" },
  ],
  APPROVED: [
    { action: "publish", label: "Publish now" },
    { action: "reject", label: "Return for revision" },
  ],
  PUBLISHED: [{ action: "unpublish", label: "Unpublish" }],
};

function toLocalInput(date: Date | null | undefined) {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function NewsEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("news:write");
  const { id } = await params;
  const isNew = id === "new";
  const record = isNew ? null : await getAdminNews(id);
  if (!isNew && !record) notFound();

  const transitions = record ? TRANSITIONS[record.status] ?? [] : [];

  return (
    <div>
      <AdminHeading
        title={isNew ? "New article" : record!.title}
        intro={isNew ? "Saved as a draft. It becomes public only after review and publication." : `Last updated ${fmtDateTime(record!.updatedAt)} by ${record!.author.name}.`}
        action={<Link href="/admin/news" className="text-[11px] font-semibold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">Back to list</Link>}
      />

      {record && (
        <div className="mb-6 flex flex-wrap items-center gap-3 border border-paper-line bg-white px-4 py-3">
          <StatusBadge status={record.status} />
          <span className="text-[11.5px] text-ink-muted">
            {record.publishedAt ? `Published ${fmtDateTime(record.publishedAt)}` : record.scheduledFor ? `Scheduled for ${fmtDateTime(record.scheduledFor)}` : "Not published"}
          </span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section className="border border-paper-line bg-white p-5 md:p-6">
          <AdminForm action={saveNewsAction} submitLabel={isNew ? "Create draft" : "Save changes"} pendingLabel="Saving…">
            {record && <input type="hidden" name="id" value={record.id} />}
            <AdminField label="Title" name="title" value={record?.title} required hint="As it will appear on the public page." />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Category" name="category" value={record?.category ?? "Municipal News"} options={CATEGORIES} required />
              <AdminField label="Slug" name="slug" value={record?.slug} hint="Leave blank to generate from the title." />
            </div>
            <AdminField label="Summary" name="summary" value={record?.summary} rows={3} required hint="20–400 characters. Used on cards and in search results." />
            <AdminField label="Body" name="body" value={record?.body} rows={14} required hint="Plain text. A blank line starts a new paragraph." />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Featured image path" name="imagePath" value={record?.imagePath} placeholder="/images/iten-hero.jpg" hint="A path inside /public. Uploads are reviewed separately." />
              <AdminField label="Image alternative text" name="imageAlt" value={record?.imageAlt} hint="Required when an image is set." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="SEO title" name="seoTitle" value={record?.seoTitle} hint="Up to 70 characters." />
              <AdminField label="SEO description" name="seoDescription" value={record?.seoDescription} hint="Up to 180 characters." />
            </div>
            <AdminField label="Scheduled publication" name="scheduledFor" type="datetime-local" value={toLocalInput(record?.scheduledFor)} hint="Publication waits for this moment if it is in the future." />
          </AdminForm>
        </section>

        <aside className="space-y-5">
          <section className="border border-paper-line bg-white p-5">
            <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.13em] text-ink-muted">Workflow</h2>
            {transitions.length === 0 ? (
              <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">
                No transitions are available from this status.
              </p>
            ) : (
              <form action={transitionNewsAction} className="mt-3 space-y-3">
                <input type="hidden" name="id" value={record!.id} />
                <label className="label" htmlFor="note">Note to the author</label>
                <textarea id="note" name="note" rows={2} maxLength={400} className="field" placeholder="Optional, recorded in the audit log." />
                <div className="flex flex-wrap gap-2">
                  {transitions.map((t) => (
                    <button
                      key={t.action}
                      type="submit"
                      name="action"
                      value={t.action}
                      className={`btn !py-2 !text-[11px] ${t.action === "reject" ? "btn-outline" : "btn-primary"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] leading-relaxed text-ink-muted">
                  A reviewer cannot approve content they authored. Self-approval attempts are refused on the server and
                  recorded as <span className="font-mono">WORKFLOW_DENIED</span>.
                </p>
              </form>
            )}
          </section>

          <section className="border border-paper-line bg-white p-5 text-[11.5px] leading-relaxed text-ink-muted">
            <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.13em] text-ink-muted">Editing rules</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-4">
              <li>Editing a published article returns it to draft for re-approval.</li>
              <li>Unpublishing removes it from the site, search and sitemap immediately.</li>
              <li>Scheduled articles are withheld until their time passes.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
