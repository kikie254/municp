import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateSubmissionAction, addSubmissionNoteAction } from "@/lib/actions/admin";
import { getAdminSubmission, listAdminUsers } from "@/lib/admin-queries";
import { can } from "@/lib/auth/rbac";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const STATUSES = ["RECEIVED", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePermission("submissions:read");
  const { id } = await params;
  const [record, staff] = await Promise.all([getAdminSubmission(id), user.role === "SUPER_ADMIN" ? listAdminUsers() : Promise.resolve([])]);
  if (!record) notFound();
  // RBAC-02 fix: only roles holding submissions:manage may act on a case. The forms are hidden for
  // other roles — previously they rendered to every reader and silently did nothing on submit.
  const canManage = can(user.role, "submissions:manage");

  return (
    <div>
      <AdminHeading
        title={record.subject}
        intro={`${record.reference} · ${record.type.toLowerCase()} · received ${fmtDateTime(record.createdAt)}`}
        action={<Link href="/admin/submissions" className="text-[11px] font-semibold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">Back to queue</Link>}
      />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <section className="border border-paper-line bg-white p-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-[10px] font-bold uppercase tracking-[0.11em] text-ink-muted">Name</dt><dd className="mt-0.5 text-[12.5px] text-ink">{record.name}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-[0.11em] text-ink-muted">Email</dt><dd className="mt-0.5 break-all text-[12.5px] text-ink">{record.email}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-[0.11em] text-ink-muted">Phone</dt><dd className="mt-0.5 text-[12.5px] text-ink">{record.phone ?? "Not given"}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-[0.11em] text-ink-muted">Ward or area</dt><dd className="mt-0.5 text-[12.5px] text-ink">{record.location ?? "Not given"}</dd></div>
            </dl>
            <div className="mt-5 border-t border-paper-line pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-ink-muted">Message</p>
              <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-ink-soft">{record.message}</p>
            </div>
            <p className="mt-4 text-[10.5px] text-ink-muted">
              Consent recorded: {record.consent ? "yes" : "no"} · IP stored only as a salted hash
            </p>
          </section>

          <section className="border border-paper-line bg-white p-5">
            <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Case notes (internal)</h2>
            {canManage ? (
            <form action={addSubmissionNoteAction} className="mt-3 space-y-2">
              <input type="hidden" name="submissionId" value={record.id} />
              <label className="sr-only" htmlFor="body">Case note</label>
              <textarea id="body" name="body" rows={3} required maxLength={4000} className="field" placeholder="Internal note — never shown to the citizen." />
              <button className="btn btn-outline !py-2 !text-[11px]">Add note</button>
            </form>
            ) : (
              <p className="mt-3 text-[11px] text-ink-muted">Only a super administrator can add case notes.</p>
            )}
            {record.notes.length === 0 ? (
              <p className="mt-4 text-[12px] text-ink-muted">No case notes yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-paper-line">
                {record.notes.map((n) => (
                  <li key={n.id} className="py-2.5">
                    <p className="whitespace-pre-line text-[12.5px] text-ink-soft">{n.body}</p>
                    <p className="mt-1 text-[10.5px] text-ink-muted">{n.authorName} · {fmtDateTime(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="border border-paper-line bg-white p-5">
            <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Status</h2>
            <p className="mt-2"><StatusBadge status={record.status} /></p>
            {canManage ? (
            <form action={updateSubmissionAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={record.id} />
              <div>
                <label className="label" htmlFor="status">Set status</label>
                <select id="status" name="status" defaultValue={record.status} className="field">
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ").toLowerCase()}</option>)}
                </select>
              </div>
              {staff.length > 0 && (
                <div>
                  <label className="label" htmlFor="assignedToId">Assign to</label>
                  <select id="assignedToId" name="assignedToId" defaultValue={record.assignedToId ?? ""} className="field">
                    <option value="">Unassigned</option>
                    {staff.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.role.replace(/_/g, " ").toLowerCase()}</option>)}
                  </select>
                </div>
              )}
              <button className="btn btn-primary w-full !py-2 !text-[11px]">Save status</button>
            </form>
            ) : (
              <p className="mt-3 text-[11px] text-ink-muted">Case actions are restricted to super administrators.</p>
            )}
            <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
              Status changes are written to the audit log with your account and a hashed source address.
            </p>
          </section>
          <section className="border border-paper-line bg-white p-5 text-[11.5px] leading-relaxed text-ink-muted">
            <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Privacy</h2>
            <p className="mt-2">
              Do not copy this message into public content. Personal details stay in the administrative system and are
              removed under the retention policy once approved by the Municipality.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
