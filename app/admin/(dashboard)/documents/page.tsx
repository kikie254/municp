import { AdminHeading, fmt } from "@/components/admin/AdminHeading";
import { AdminForm, AdminField } from "@/components/admin/AdminForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { uploadDocumentAction, transitionDocumentAction } from "@/lib/actions/content";
import { listAdminDocuments } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";
import { ALLOWED_EXTENSIONS, MAX_UPLOAD_BYTES } from "@/lib/security/upload";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Integrated Development Plans", "Budget and Finance", "Governance", "Grievance Redress Documents", "Policies", "Reports"] as const;

export default async function AdminDocumentsPage() {
  await requirePermission("documents:write");
  const rows = await listAdminDocuments();

  return (
    <div>
      <AdminHeading
        title="Documents"
        intro="Documents are stored privately and served only through an access-checked download route. Unpublished documents return 404 to anyone without a session."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <section className="border border-paper-line bg-white p-5">
          <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Upload a document</h2>
          <div className="mt-4">
            <AdminForm action={uploadDocumentAction} submitLabel="Upload" pendingLabel="Uploading…">
              <AdminField label="Title" name="title" required />
              <AdminField label="Category" name="category" value="Reports" options={CATEGORIES} required />
              <AdminField label="Description" name="description" rows={3} required />
              <AdminField label="Document date" name="documentDate" type="date" />
              <div>
                <label className="label" htmlFor="file">File<span className="text-flag-red"> *</span></label>
                <input id="file" name="file" type="file" required className="field !py-2 text-[12px]"
                  accept={ALLOWED_EXTENSIONS.join(",")} />
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">
                  Allowed: {ALLOWED_EXTENSIONS.join(", ")}. Maximum {Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.
                  The file signature is checked, not just the extension.
                </p>
              </div>
            </AdminForm>
          </div>
        </section>

        <section>
          {rows.length === 0 ? (
            <div className="border border-paper-line bg-white p-8 text-center">
              <p className="text-[13px] font-semibold text-ink">No documents uploaded.</p>
              <p className="mt-1.5 text-[12px] text-ink-muted">Uploaded files appear here and stay private until published.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-paper-line bg-white">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">Uploaded documents</caption>
                <thead>
                  <tr className="border-b border-paper-line bg-paper-warm">
                    {["Document", "Category", "Status", "Size", "Actions"].map((h) => (
                      <th key={h} scope="col" className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id} className="border-b border-paper-line last:border-0">
                      <td className="px-3 py-3">
                        <span className="block text-[12px] font-semibold text-ink">{d.title}</span>
                        <span className="mt-0.5 block text-[10.5px] text-ink-muted">{d.fileName} · {d.documentDate ? fmt(d.documentDate) : "no date"}</span>
                      </td>
                      <td className="px-3 py-3 text-[11px] text-ink-soft">{d.category}</td>
                      <td className="px-3 py-3"><StatusBadge status={d.status} /></td>
                      <td className="px-3 py-3 text-[11px] text-ink-muted">{Math.max(1, Math.round(d.sizeBytes / 1024))} KB</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {d.status !== "PUBLISHED" ? (
                            <form action={transitionDocumentAction}>
                              <input type="hidden" name="id" value={d.id} /><input type="hidden" name="action" value="publish" />
                              <button className="btn btn-primary !py-1 !text-[10px]">Publish</button>
                            </form>
                          ) : (
                            <form action={transitionDocumentAction}>
                              <input type="hidden" name="id" value={d.id} /><input type="hidden" name="action" value="withdraw" />
                              <button className="btn btn-outline !py-1 !text-[10px]">Withdraw</button>
                            </form>
                          )}
                          <form action={transitionDocumentAction}>
                            <input type="hidden" name="id" value={d.id} /><input type="hidden" name="action" value="delete" />
                            <button className="btn btn-ghost !py-1 !text-[10px]">Delete</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
            Deleting archives the record and hides it from the site; the stored bytes are retained in cloud storage
            (soft-delete and object versioning) so official records remain recoverable. Permanent disposal happens only
            through the documented records-disposal process, never from this screen.
          </p>
        </section>
      </div>
    </div>
  );
}
