import { AdminHeading, fmtDateTime, fmt } from "@/components/admin/AdminHeading";
import { AdminForm, AdminField } from "@/components/admin/AdminForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { saveNoticeAction, transitionNoticeAction } from "@/lib/actions/content";
import { listAdminNotices } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Public Notice", "Consultation", "Tender", "Meeting", "Service Interruption"] as const;

export default async function AdminNoticesPage() {
  await requirePermission("notices:write");
  const rows = await listAdminNotices();
  const now = Date.now();

  return (
    <div>
      <AdminHeading title="Public notices" intro="Notices appear on the news page and expire automatically. Expired notices remain visible as an archive entry until withdrawn." />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="order-2 xl:order-1">
          {rows.length === 0 ? (
            <div className="border border-paper-line bg-white p-8 text-center">
              <p className="text-[13px] font-semibold text-ink">No notices have been created.</p>
              <p className="mt-1.5 text-[12px] text-ink-muted">Use the form to publish the first official notice.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {rows.map((n) => {
                const expired = Boolean(n.expiresAt && n.expiresAt.getTime() < now);
                return (
                  <li key={n.id} className="border border-paper-line bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-ink">{n.title}</p>
                        <p className="mt-0.5 text-[11px] text-ink-muted">{n.category} · created {fmtDateTime(n.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={n.status} />
                        {expired && <span className="bg-flag-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.07em] text-white">expired</span>}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12px] text-ink-soft">{n.body}</p>
                    <p className="mt-1.5 text-[11px] text-ink-muted">
                      Publication: {n.publishedAt ? fmtDateTime(n.publishedAt) : "not published"} · Expiry: {n.expiresAt ? fmt(n.expiresAt) : "none set"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {n.status !== "PUBLISHED" && (
                        <form action={transitionNoticeAction}>
                          <input type="hidden" name="id" value={n.id} /><input type="hidden" name="action" value="publish" />
                          <button className="btn btn-primary !py-1.5 !text-[10.5px]">Publish</button>
                        </form>
                      )}
                      {n.status === "PUBLISHED" && (
                        <form action={transitionNoticeAction}>
                          <input type="hidden" name="id" value={n.id} /><input type="hidden" name="action" value="withdraw" />
                          <button className="btn btn-outline !py-1.5 !text-[10.5px]">Withdraw</button>
                        </form>
                      )}
                      <form action={transitionNoticeAction}>
                        <input type="hidden" name="id" value={n.id} /><input type="hidden" name="action" value="archive" />
                        <button className="btn btn-ghost !py-1.5 !text-[10.5px]">Archive</button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <section className="order-1 border border-paper-line bg-white p-5 xl:order-2">
          <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Create a notice</h2>
          <div className="mt-4">
            <AdminForm action={saveNoticeAction} submitLabel="Create notice" pendingLabel="Creating…">
              <AdminField label="Title" name="title" required />
              <AdminField label="Category" name="category" value="Public Notice" options={CATEGORIES} required />
              <AdminField label="Body" name="body" rows={7} required hint="Official wording only. Do not paraphrase approved text." />
              <AdminField label="Expiry date" name="expiresAt" type="date" hint="The notice stops being listed as active after this date." />
            </AdminForm>
          </div>
        </section>
      </div>
    </div>
  );
}
