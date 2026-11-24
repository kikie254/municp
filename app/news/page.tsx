import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { EmptyState } from "@/components/EmptyState";
import { PublishedNewsCard, formatDate } from "@/components/content/PublishedBlocks";
import { getActiveNotices, getExpiredNotices, getPublishedNews } from "@/lib/queries";

export const metadata: Metadata = {
  title: "News, Updates and Announcements",
  description:
    "Official announcements, public notices and development updates published by Iten-Tambach Municipality, County Government of Elgeyo Marakwet.",
  alternates: { canonical: "/news" },
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [published, notices, expired] = await Promise.all([
    getPublishedNews(),
    getActiveNotices(6),
    getExpiredNotices(5),
  ]);
  const featured = published[0];
  const rest = published.slice(1);

  return (
    <>
      <PageHero
        title="News, Updates and Announcements"
        intro="Demonstration of how municipal announcements, public notices and development updates could be presented. Treat an item as an official notice only when it is issued by an authorised municipal or County Government office."
        image="/images/iten-town-aerial.jpg"
        imageAlt="Aerial view of Iten town and its surrounding highlands"
        eyebrow="Newsroom"
        crumbs={[{ label: "News" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="shell">
          {published.length === 0 ? (
            <EmptyState
              title="Municipal announcements and public notices"
              body="Visit this page for municipal announcements, public notices and community updates."
            >
              <Link href="/contact" className="btn btn-outline mt-4 !py-2.5 !text-[11.5px]">View contact-status information</Link>
            </EmptyState>
          ) : (
            <>
              <Reveal>
                <SectionHeading eyebrow="Latest" title="Most recent announcement" />
              </Reveal>
              <div className="mt-6">{featured && <PublishedNewsCard item={featured} featured />}</div>
              {rest.length > 0 && (
                <>
                  <Reveal>
                    <div className="mt-14">
                      <SectionHeading eyebrow="All announcements" title={`${published.length} published items`} />
                    </div>
                  </Reveal>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((item) => <PublishedNewsCard key={item.slug} item={item} />)}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {notices.length > 0 && (
        <section className="border-y border-paper-line bg-paper-warm py-12 md:py-16">
          <div className="shell">
            <Reveal>
              <SectionHeading eyebrow="Public notices" title="Notices currently in force" description="A notice is removed from this list automatically once its stated expiry date passes." />
            </Reveal>
            <ul className="mt-6 divide-y divide-paper-line border-y border-paper-line">
              {notices.map((n) => (
                <li key={n.id} className="py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-flag-red">{n.category}</p>
                  <p className="mt-1 text-[13.5px] font-semibold text-green-900">{n.title}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-soft">{n.body}</p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] uppercase tracking-[0.1em] text-ink-muted">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3 w-3" aria-hidden="true" /> Published {formatDate(n.publishedAt)}</span>
                    {n.expiresAt && <span>Expires {formatDate(n.expiresAt)}</span>}
                  </p>
                </li>
              ))}
            </ul>
            {expired.length > 0 && (
              <details className="mt-5 border border-paper-line bg-white p-4">
                <summary className="cursor-pointer text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  Expired notices ({expired.length})
                </summary>
                <ul className="mt-3 space-y-2">
                  {expired.map((n) => (
                    <li key={n.id} className="text-[12px] text-ink-soft">
                      <span className="font-semibold text-green-900">{n.title}</span> — expired {formatDate(n.expiresAt)}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
