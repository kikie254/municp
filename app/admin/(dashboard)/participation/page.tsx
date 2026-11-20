import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeading, fmt, fmtDateTime } from "@/components/admin/AdminHeading";
import { AdminForm, AdminField } from "@/components/admin/AdminForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { saveParticipationAction, transitionParticipationAction } from "@/lib/actions/content";
import { listAdminParticipation, getAdminParticipation, listAdminResponses } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const KINDS = ["Consultation", "Meeting", "Notice", "Survey"] as const;

export default async function AdminParticipationPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requirePermission("participation:manage");
  const { id } = await searchParams;
  const rows = await listAdminParticipation();
  const selected = id ? await getAdminParticipation(id) : null;
  if (id && !selected) notFound();
  const responses = selected ? await listAdminResponses(selected.id) : [];

  return (
    <div>
      <AdminHeading
        title="Public participation"
        intro="Publish consultations, meetings and surveys. Responses are stored privately and exported only by authorised officers."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <section className="border border-paper-line bg-white p-5">
          <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">
            {selected ? "Edit opportunity" : "Create an opportunity"}
          </h2>
          <div className="mt-4">
            <AdminForm action={saveParticipationAction} submitLabel={selected ? "Save changes" : "Create draft"} key={selected?.id ?? "new"}>
              {selected && <input type="hidden" name="id" value={selected.id} />}
              <AdminField label="Title" name="title" value={selected?.title} required />
              <AdminField label="Type" name="kind" value={selected?.kind ?? "Consultation"} options={KINDS} required />
              <AdminField label="Description" name="description" value={selected?.description} rows={6} required />
              <AdminField label="Instructions for taking part" name="instructions" value={selected?.instructions} rows={3} />
              <AdminField label="Venue" name="location" value={selected?.location} />
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Opens" name="opensAt" type="date" />
                <AdminField label="Submission deadline" name="closesAt" type="date" />
              </div>
            </AdminForm>
          </div>
        </section>

        <div className="space-y-5">
          <section className="border border-paper-line bg-white">
            <h2 className="border-b border-paper-line px-4 py-3 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">
              All opportunities ({rows.length})
            </h2>
            {rows.length === 0 ? (
              <p className="px-4 py-6 text-[12px] text-ink-muted">No consultations have been created yet.</p>
            ) : (
              <ul className="divide-y divide-paper-line">
                {rows.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <div className="min-w-0">
                      <Link href={`/admin/participation?id=${r.id}`} className="text-[12.5px] font-semibold text-green-900 hover:text-gold-700">{r.title}</Link>
                      <p className="mt-0.5 text-[11px] text-ink-muted">
                        {r.kind} · {r.responsesCount} response{r.responsesCount === 1 ? "" : "s"} · closes {r.closesAt ? fmt(r.closesAt) : "not set"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.status} />
                      <form action={transitionParticipationAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="action" value={r.status === "PUBLISHED" ? "close" : "publish"} />
                        <button className={`btn !py-1 !text-[10px] ${r.status === "PUBLISHED" ? "btn-outline" : "btn-primary"}`}>
                          {r.status === "PUBLISHED" ? "Close" : "Publish"}
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {selected && (
            <section className="border border-paper-line bg-white">
              <div className="flex items-center justify-between border-b border-paper-line px-4 py-3">
                <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">
                  Responses to “{selected.title}” ({responses.length})
                </h2>
                <a href={`/api/admin/participation/${selected.id}/export`} className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-green-700 hover:text-gold-700">Export CSV</a>
              </div>
              {responses.length === 0 ? (
                <p className="px-4 py-6 text-[12px] text-ink-muted">
                  No responses recorded. Responses appear here and are never shown on the public website.
                </p>
              ) : (
                <ul className="divide-y divide-paper-line">
                  {responses.map((r) => (
                    <li key={r.id} className="px-4 py-3">
                      <p className="text-[11px] text-ink-muted"><span className="font-mono">{r.reference}</span> · {fmtDateTime(r.createdAt)} · {r.ward || "ward not given"}</p>
                      <p className="mt-1 line-clamp-3 text-[12.5px] text-ink-soft">{r.response}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
