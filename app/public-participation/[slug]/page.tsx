import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, MapPin, Info } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { ParticipationResponseForm } from "@/components/forms/ParticipationResponseForm";
import { getParticipationBySlug } from "@/lib/queries";
import { formatDate } from "@/components/content/PublishedBlocks";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getParticipationBySlug(slug);
  if (!item) return { title: "Consultation not found", robots: { index: false, follow: true } };
  return {
    title: item.title,
    description: item.description.slice(0, 160),
    alternates: { canonical: `/public-participation/${item.slug}` },
  };
}

export default async function ParticipationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getParticipationBySlug(slug);
  if (!item) notFound();

  const now = new Date();
  const closed = Boolean(item.closesAt && item.closesAt < now);
  const notYetOpen = Boolean(item.opensAt && item.opensAt > now);

  return (
    <>
      <PageHero
        eyebrow={item.kind}
        title={item.title}
        intro={item.description.split("\n")[0].slice(0, 180)}
        crumbs={[{ label: "Home", href: "/" }, { label: "Public participation", href: "/public-participation" }, { label: item.title }]}
        image="/images/public-engagement.jpg"
        imageAlt="Residents taking part in a municipal public participation meeting"
      />

      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="space-y-3.5 text-[15px] leading-[1.75] text-ink-soft">
              {item.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {item.instructions && (
              <div className="mt-8 border-l-[3px] border-gold-400 bg-paper-warm p-5">
                <h2 className="flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.07em] text-green-900">
                  <Info className="h-4 w-4 text-gold-700" aria-hidden="true" /> How to take part
                </h2>
                <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-ink-soft">{item.instructions}</p>
              </div>
            )}

            <div className="mt-10">
              <h2 className="font-display text-[1.05rem] font-bold text-green-900">Submit your response</h2>
              {closed ? (
                <div className="mt-4 border border-paper-line bg-white p-6">
                  <p className="text-[13.5px] font-semibold text-ink">This consultation has closed.</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
                    Responses are no longer accepted for this consultation. A summary of the responses received is
                    prepared for the municipal board in line with the published participation procedure.
                  </p>
                </div>
              ) : notYetOpen ? (
                <div className="mt-4 border border-paper-line bg-white p-6">
                  <p className="text-[13.5px] font-semibold text-ink">
                    This consultation opens on {formatDate(item.opensAt as unknown as string)}.
                  </p>
                  <p className="mt-1.5 text-[12.5px] text-ink-muted">Responses cannot be recorded before the opening date.</p>
                </div>
              ) : (
                <div className="mt-4">
                  <ParticipationResponseForm slug={item.slug} title={item.title} enabled={process.env.PUBLIC_SUBMISSIONS_ENABLED === "true"} />
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-paper-line bg-white p-6">
              <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">Key details</h2>
              <dl className="mt-4 space-y-3.5 text-[13px]">
                <div>
                  <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Opens
                  </dt>
                  <dd className="mt-0.5 text-ink">{item.opensAt ? formatDate(item.opensAt as unknown as string) : "As announced"}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Submission deadline
                  </dt>
                  <dd className="mt-0.5 text-ink">{item.closesAt ? formatDate(item.closesAt as unknown as string) : "Not published"}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Venue
                  </dt>
                  <dd className="mt-0.5 text-ink">{item.location || "Not published"}</dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Status</dt>
                  <dd className="mt-0.5">
                    <span className={`inline-block px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] ${closed ? "bg-ink/10 text-ink-soft" : "bg-green-100 text-green-900"}`}>
                      {closed ? "Closed" : notYetOpen ? "Opening soon" : "Open for responses"}
                    </span>
                  </dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-paper-line pt-4 text-[11.5px] leading-relaxed text-ink-muted">
                Personal details submitted here are used only to record and report on this consultation. Internal notes
                are never published.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
