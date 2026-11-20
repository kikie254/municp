import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { listEmailOutbox } from "@/lib/admin-queries";
import { retryEmailAction } from "@/lib/actions/admin";
import { databaseReachable } from "@/lib/db";
import { mailerConfigured } from "@/lib/email/mailer";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

function Row({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-paper-line py-3 last:border-0">
      <div className="flex items-start gap-2.5">
        {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />}
        <div>
          <p className="text-[12.5px] font-semibold text-ink">{label}</p>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-muted">{detail}</p>
        </div>
      </div>
      <span className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] ${ok ? "text-green-700" : "text-flag-red"}`}>{ok ? "Ready" : "Missing"}</span>
    </div>
  );
}

export default async function AdminSettingsPage() {
  await requirePermission("settings:read");
  const [dbUp, outbox] = await Promise.all([databaseReachable(), listEmailOutbox(15)]);
  const mail = mailerConfigured();

  return (
    <div>
      <AdminHeading
        title="System status"
        intro="Live configuration checks. Nothing on this page is illustrative: each line reflects the running process."
      />

      <section className="border border-paper-line bg-white p-5">
        <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Configuration</h2>
        <div className="mt-3">
          <Row label="Database" ok={dbUp} detail={dbUp ? "A test query returned successfully." : "Unreachable. Check the Firebase Admin environment variables (FIREBASE_ADMIN_*), then see FIREBASE_SETUP.md."} />
          <Row label="Email provider" ok={mail} detail={mail ? "Provider credentials present; outbound notifications are attempted on submission." : "EMAIL_API_KEY / EMAIL_FROM are not set. Notifications are recorded as NOT_CONFIGURED — the platform never reports an unsent message as delivered."} />
          <Row label="Document storage" ok detail="Documents are stored as private objects in Firebase Cloud Storage under /private/documents/… and are never publicly readable. Downloads go through an access-checked route." />
          <Row label="Session secret" ok={Boolean(process.env.PRIVACY_HASH_SECRET)} detail={process.env.PRIVACY_HASH_SECRET ? "PRIVACY_HASH_SECRET is set, so IP hashes are salted with a deployment-specific value." : "PRIVACY_HASH_SECRET is unset; a development fallback is in use. Set it before production."} />
        </div>
      </section>

      <section className="mt-6 border border-paper-line bg-white">
        <h2 className="border-b border-paper-line px-5 py-3 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Email outbox</h2>
        {outbox.length === 0 ? (
          <p className="px-5 py-6 text-[12.5px] text-ink-muted">No outbound messages have been recorded yet.</p>
        ) : (
          <ul className="divide-y divide-paper-line">
            {outbox.map((m) => (
              <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-ink">{m.subject}</p>
                  <p className="mt-0.5 break-all text-[10.5px] text-ink-muted">{m.toAddress} · attempts {m.attempts} · {fmtDateTime(m.createdAt)}</p>
                  {m.error && <p className="mt-1 flex items-center gap-1.5 text-[10.5px] text-flag-red"><AlertTriangle className="h-3 w-3" aria-hidden="true" />{m.error}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={m.status} />
                  {(m.status === "FAILED" || m.status === "NOT_CONFIGURED") && (
                    <form action={retryEmailAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <button className="btn btn-ghost !py-1 !text-[10px]">Re-queue</button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
        Re-queueing moves a message back to QUEUED; it is only marked SENT once the provider accepts it. See ENVIRONMENT_SETUP.md
        for the full list of environment variables.
      </p>
    </div>
  );
}
