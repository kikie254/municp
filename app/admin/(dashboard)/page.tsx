import Link from "next/link";
import { AlertTriangle, CheckCircle2, Database, Mail, Inbox, FileText } from "lucide-react";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminCounts, listAdminSubmissions, listAuditLogs, listEmailOutbox } from "@/lib/admin-queries";
import { databaseReachable } from "@/lib/db";
import { mailerConfigured } from "@/lib/email/mailer";
import { requireUser } from "@/lib/auth/session";
import { can, ROLE_LABELS } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const user = await requireUser();
  // RBAC-06 fix: the audit feed is disclosed only to roles holding audit:read — actor emails
  // and complaint references are not for every administrator.
  const mayReadAudit = can(user.role, "audit:read");
  const [dbUp, counts, submissions, audit, outbox] = await Promise.all([
    databaseReachable(), adminCounts(), listAdminSubmissions({}), mayReadAudit ? listAuditLogs(8) : Promise.resolve([]), listEmailOutbox(5),
  ]);

  const cards = [
    { label: "Awaiting review", value: counts.newsReview, href: "/admin/news", note: "news and announcements" },
    { label: "Draft content", value: counts.newsDraft + counts.projectsDraft, href: "/admin/news", note: "news and project records" },
    { label: "Published records", value: counts.newsPublished + counts.projectsPublished + counts.docsPublished, href: "/admin/documents", note: "news, projects, documents" },
    { label: "Open submissions", value: counts.submissionsOpen, href: "/admin/submissions", note: "received to in progress" },
    { label: "Consultation responses", value: counts.responses, href: "/admin/participation", note: "stored privately" },
    { label: "Active notices", value: counts.noticesActive, href: "/admin/notices", note: "unexpired" },
  ];

  return (
    <div>
      <AdminHeading
        title={`Good to see you, ${user.name.split(" ")[0]}`}
        intro={`Signed in as ${ROLE_LABELS[user.role]}. Every figure on this page is a live count from the database — nothing here is illustrative.`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group border border-paper-line bg-white p-5 transition-shadow hover:shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-muted">{c.label}</p>
            <p className="mt-2 font-display text-[1.9rem] font-extrabold leading-none text-green-900">{c.value}</p>
            <p className="mt-1.5 text-[11.5px] text-ink-muted">{c.note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="border border-paper-line bg-white">
          <header className="flex items-center justify-between border-b border-paper-line px-5 py-3.5">
            <h2 className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">
              <Inbox className="h-4 w-4 text-gold-700" aria-hidden="true" /> Latest submissions
            </h2>
            <Link href="/admin/submissions" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-green-700 hover:text-gold-700">View all</Link>
          </header>
          {submissions.length === 0 ? (
            <p className="px-5 py-8 text-[12.5px] text-ink-muted">
              No citizen submissions have been received yet. New enquiries, feedback and complaints appear here.
            </p>
          ) : (
            <ul className="divide-y divide-paper-line">
              {submissions.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/submissions/${s.id}`} className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-paper-warm">
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] font-semibold text-ink">{s.subject}</span>
                      <span className="mt-0.5 block text-[11px] text-ink-muted">
                        <span className="font-mono">{s.reference}</span> · {s.type.toLowerCase()} · {fmtDateTime(s.createdAt)}
                      </span>
                    </span>
                    <StatusBadge status={s.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-paper-line bg-white">
          <header className="flex items-center justify-between border-b border-paper-line px-5 py-3.5">
            <h2 className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">
              <FileText className="h-4 w-4 text-gold-700" aria-hidden="true" /> {mayReadAudit ? "Recent audit entries" : "Audit log (restricted)"}
            </h2>
            <Link href="/admin/audit" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-green-700 hover:text-gold-700">Audit log</Link>
          </header>
          {audit.length === 0 ? (
            <p className="px-5 py-8 text-[12.5px] text-ink-muted">No activity recorded yet.</p>
          ) : (
            <ul className="divide-y divide-paper-line">
              {audit.map((a) => (
                <li key={a.id} className="px-5 py-2.5">
                  <p className="text-[11.5px] text-ink-soft"><span className="font-mono text-[10.5px] text-green-800">{a.action}</span> — {a.summary}</p>
                  <p className="mt-0.5 text-[10.5px] text-ink-muted">{a.actorEmail} · {fmtDateTime(a.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8 grid gap-4 border border-paper-line bg-white p-5 sm:grid-cols-3">
        <div className="flex items-start gap-2.5">
          <Database className={`mt-0.5 h-4 w-4 ${dbUp ? "text-green-600" : "text-flag-red"}`} aria-hidden="true" />
          <div>
            <p className="text-[11.5px] font-semibold text-ink">Database</p>
            <p className="text-[11px] text-ink-muted">{dbUp ? "Reachable — Firestore queries returning live data." : "Unreachable. Check the Firebase Admin configuration (FIREBASE_ADMIN_*)."}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Mail className={`mt-0.5 h-4 w-4 ${mailerConfigured() ? "text-green-600" : "text-gold-700"}`} aria-hidden="true" />
          <div>
            <p className="text-[11.5px] font-semibold text-ink">Email delivery</p>
            <p className="text-[11px] text-ink-muted">
              {mailerConfigured() ? "Provider configured." : "Not configured — notifications are queued, never reported as sent."}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          {counts.emailFailed === 0 ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" aria-hidden="true" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 text-flag-red" aria-hidden="true" />
          )}
          <div>
            <p className="text-[11.5px] font-semibold text-ink">Outbox</p>
            <p className="text-[11px] text-ink-muted">
              {counts.emailFailed} failed, {counts.users} active {counts.users === 1 ? "user" : "users"}.
            </p>
          </div>
        </div>
      </section>

      {outbox.length > 0 && (
        <p className="mt-4 text-[11px] text-ink-muted">
          Most recent outbox entry: <span className="font-mono">{outbox[0].status}</span> — {outbox[0].subject}
        </p>
      )}
    </div>
  );
}
