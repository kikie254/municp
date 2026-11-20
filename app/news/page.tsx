import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Megaphone, CalendarDays } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { NewsList } from "@/components/NewsList";
import { EmptyState } from "@/components/EmptyState";
import { PublishedNewsCard, formatDate } from "@/components/content/PublishedBlocks";
import { news as demoNews, newsCategories } from "@/lib/data/news";
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
        intro="Official municipal announcements, public notices and development updates. Every item on this page has been approved for publication through the municipal editorial process."
        image="/images/iten-town-aerial.jpg"
        imageAlt="Aerial view of Iten town and its surrounding highlands"
        eyebrow="Newsroom"
        crumbs={[{ label: "News" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="shell">
          {published.length === 0 ? (
            <EmptyState
              title="No verified announcements have been published yet"
              body="Nothing appears here until an authorised municipal officer has written an announcement, submitted it for review and published it. This page is not filled with stand-in stories."
            >
              <Link href="/contact" className="btn btn-outline mt-4 !py-2.5 !text-[11.5px]">Contact the municipal office</Link>
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

      {/* The Phase 1 template preview is retained so the layout can be reviewed, and is labelled as
          a template. It is excluded from the sitemap, from search and from the homepage. */}
      <section className="bg-paper-warm py-12 md:py-16">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <div className="flex gap-3 border border-gold-400/50 bg-gold-50 p-4">
              <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
              <p className="text-[12px] leading-[1.8] text-green-900">
                <strong className="font-semibold uppercase tracking-[0.07em]">Template preview — </strong>
                the articles below are layout examples retained from the design phase. They are not municipal
                announcements, they carry no official standing, and they are excluded from search and the sitemap.
              </p>
            </div>
            <div className="mt-7">
              <Suspense fallback={<p className="text-[12.5px] text-ink-muted">Loading the template preview…</p>}>
                <NewsList />
              </Suspense>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-paper-line bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Categories</p>
              <ul className="mt-3 space-y-2">
                {newsCategories.map((c) => (
                  <li key={c}>
                    <Link href={`/news?filter=${encodeURIComponent(c)}`} className="flex items-center justify-between text-[12.5px] text-green-900 hover:text-green-600">
                      <span>{c}</span>
                      <span className="text-[10.5px] text-ink-muted">{demoNews.filter((n) => n.category === c).length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
