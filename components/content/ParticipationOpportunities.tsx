import Link from "next/link";
import { CalendarClock, MapPin, ArrowRight, Info } from "lucide-react";
import { getParticipationOpportunities } from "@/lib/queries";
import { formatDate } from "@/components/content/PublishedBlocks";

/**
 * Server component: lists consultations published by municipal officers.
 *
 * The list is read from the database on every request, so a withdrawn or closed consultation
 * disappears from the page without a redeploy. When nothing is published the section says so
 * plainly and offers the general submission route instead of a dead form.
 */
export async function ParticipationOpportunities() {
  const items = await getParticipationOpportunities();
  const now = new Date();

  return (
    <div id="take-part" className="border border-paper-line bg-white p-5 shadow-card md:p-7">
      <h2 className="font-display text-[1.1rem] font-bold text-green-900">Open consultations</h2>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
        Each consultation below is published by the Municipality and has its own response form. Responses are recorded in
        the municipal case system with a reference number.
      </p>

      {items.length === 0 ? (
        <div className="mt-5 border border-dashed border-paper-line bg-paper-warm p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
            <Info className="h-4 w-4 text-gold-700" aria-hidden="true" /> No consultation is open at the moment.
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
            Draft and forthcoming consultations are not listed until they are published by an authorised officer. You can
            still raise a matter at any time through the{" "}
            <Link href="/feedback" className="font-semibold text-green-800 underline decoration-gold-400 decoration-2 underline-offset-2">
              feedback and complaints page
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => {
            const closed = Boolean(item.closesAt && item.closesAt < now);
            return (
              <li key={item.id} className="border border-paper-line p-4 transition-colors hover:border-green-300">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gold-700">{item.kind}</p>
                    <Link href={`/public-participation/${item.slug}`} className="mt-1 block font-display text-[13.5px] font-bold leading-snug text-green-900 hover:text-gold-700">
                      {item.title}
                    </Link>
                  </div>
                  <span className={`whitespace-nowrap px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${closed ? "bg-ink/10 text-ink-soft" : "bg-green-100 text-green-900"}`}>
                    {closed ? "Closed" : "Open"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-muted">
                  {item.closesAt && (
                    <span className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Deadline {formatDate(item.closesAt as unknown as string)}</span>
                  )}
                  {item.location && (
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {item.location}</span>
                  )}
                </div>
                <Link href={`/public-participation/${item.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.09em] text-green-800 hover:text-gold-700">
                  {closed ? "Read the record" : "Take part"} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
