import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, CalendarDays, Building2, Wallet } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { formatDate } from "@/components/content/PublishedBlocks";
import { getProjectBySlug } from "@/lib/queries";
import { publicImageAssetsApproved } from "@/lib/config/env";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const record = await getProjectBySlug(slug);
  if (!record || record.status !== "PUBLISHED" || record.archivedAt) {
    return { title: "Project not found", robots: { index: false, follow: false } };
  }

  return {
    title: record.title,
    description: record.summary,
    alternates: { canonical: `/projects/${record.slug}` },
    openGraph: {
      title: record.title,
      description: record.summary,
      type: "article",
      ...(record.imagePath && publicImageAssetsApproved() ? { images: [record.imagePath] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = await getProjectBySlug(slug);

  if (!record || record.status !== "PUBLISHED" || record.archivedAt) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={record.title}
        intro={record.summary}
        image={record.imagePath ?? "/images/market-development.jpg"}
        imageAlt={record.imageAlt ?? ""}
        eyebrow={record.category}
        crumbs={[{ label: "Projects", href: "/projects" }, { label: record.title }]}
      />

      <article className="bg-white py-12 md:py-16">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            {record.imagePath && publicImageAssetsApproved() && (
              <div className="relative mb-7 aspect-[16/9] overflow-hidden bg-green-950">
                <Image src={record.imagePath} alt={record.imageAlt ?? ""} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-paper-line pb-4 text-[11px] uppercase tracking-[0.1em] text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {record.location}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Published {formatDate(record.publishedAt)}</span>
            </div>

            <div className="prose-gov mt-7 space-y-4">
              {record.description.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>

            {record.objectives && (
              <section className="mt-8 border-t border-paper-line pt-6">
                <h2 className="font-display text-lg font-bold text-green-900">Project objectives</h2>
                <div className="prose-gov mt-4 whitespace-pre-line">{record.objectives}</div>
              </section>
            )}

            <Link href="/projects" className="mt-8 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-green-700 hover:text-gold-700">
              <ArrowLeft className="h-3 w-3" aria-hidden="true" /> All projects
            </Link>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4 border-t-[3px] border-green-800 bg-paper-warm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Project details</p>
              <p className="flex items-start gap-2 text-[12.5px] text-ink-soft"><Building2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {record.implementingAgency ?? "Implementing agency not specified"}</p>
              {record.budget && <p className="flex items-start gap-2 text-[12.5px] text-ink-soft"><Wallet className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {record.budget}</p>}
              {record.startDate && <p className="text-[12.5px] text-ink-soft">Start date: {record.startDate}</p>}
              {record.completionDate && <p className="text-[12.5px] text-ink-soft">Completion date: {record.completionDate}</p>}
              <p className="text-[12.5px] text-ink-soft">Status: {record.projectStatus}</p>
            </div>
          </aside>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
