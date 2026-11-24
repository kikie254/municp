import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { getNewsBySlug, getPublishedNews } from "@/lib/queries";
import { formatDate } from "@/components/content/PublishedBlocks";


export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const record = await getNewsBySlug(slug);
  if (record) {
    return {
      title: record.seoTitle ?? record.title,
      description: record.seoDescription ?? record.summary,
      alternates: { canonical: `/news/${record.slug}` },
      openGraph: {
        title: record.title,
        description: record.summary,
        type: "article",
        publishedTime: record.publishedAt?.toISOString(),
        ...(record.imagePath ? { images: [record.imagePath] } : {}),
      },
      robots: { index: true, follow: true },
    };
  }
  return { title: "Article not found", robots: { index: false, follow: false } };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const record = await getNewsBySlug(slug);
  if (record) {
    const more = (await getPublishedNews(4)).filter((n) => n.slug !== record.slug).slice(0, 3);
    return (
      <>
        <PageHero
          title={record.title}
          image={record.imagePath ?? "/images/iten-town-aerial.jpg"}
          imageAlt={record.imageAlt ?? ""}
          eyebrow={record.category}
          crumbs={[{ label: "News", href: "/news" }, { label: record.title }]}
        />
        <article className="bg-white py-12 md:py-16">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-paper-line pb-4 text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {formatDate(record.publishedAt)}</span>
                <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" aria-hidden="true" /> {record.category}</span>
                <span className="bg-green-50 px-2 py-0.5 font-bold text-green-800">Published</span>
              </div>
              {record.imagePath && (
                <div className="relative mt-6 aspect-[16/9] overflow-hidden bg-green-950">
                  <Image src={record.imagePath} alt={record.imageAlt ?? ""} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
                </div>
              )}
              <div className="prose-gov mt-7 space-y-4">
                {record.body.split(/\n{2,}/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <Link href="/news" className="mt-8 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-green-700 hover:text-gold-700">
                <ArrowLeft className="h-3 w-3" aria-hidden="true" /> All news and announcements
              </Link>
            </div>
            <aside className="lg:col-span-4">
              <div className="sticky top-24 border-t-[3px] border-green-800 bg-paper-warm p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">More updates</p>
                <ul className="mt-3 space-y-3.5">
                  {more.map((m) => (
                    <li key={m.slug} className="border-b border-paper-line pb-3 last:border-0 last:pb-0">
                      <Link href={`/news/${m.slug}`} className="group block">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gold-700">{m.category}</span>
                        <span className="mt-0.5 block text-[12.5px] font-semibold leading-snug text-green-900 group-hover:underline">{m.title}</span>
                      </Link>
                    </li>
                  ))}
                  {more.length === 0 && <li className="text-[12px] text-ink-muted">No other announcements are published.</li>}
                </ul>
              </div>
            </aside>
          </div>
        </article>
        <CtaBand />
      </>
    );
  }

  notFound();
}
