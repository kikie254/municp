import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { ProjectGallery } from "@/components/ProjectGallery";
import { EmptyState } from "@/components/EmptyState";
import { PublishedProjectCard } from "@/components/content/PublishedBlocks";
import { getPublishedProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects and Municipal Development",
  description:
    "Verified municipal projects in Iten-Tambach: scope, location, status and published figures for ongoing, completed and planned works across infrastructure, environment and public spaces.",
  alternates: { canonical: "/projects" },
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const published = await getPublishedProjects();
  const counts = {
    ongoing: published.filter((p) => p.projectStatus === "Ongoing").length,
    completed: published.filter((p) => p.projectStatus === "Completed").length,
    planned: published.filter((p) => p.projectStatus === "Planned").length,
  };

  return (
    <>
      <PageHero
        title="Projects and Municipal Development"
        intro="Verified municipal project records: what is being delivered, where, in what state, and — where the Municipality has published a figure — at what cost."
        image="/images/market-development.jpg"
        imageAlt="Aerial view of construction and trading activity in a Kenyan highland town"
        eyebrow="Development Portfolio"
        crumbs={[{ label: "Projects" }]}
      />

      <section className="bg-white py-14 md:py-20">
        <div className="shell">
          <div className="grid gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-3">
            {[
              { label: "Ongoing", value: counts.ongoing, note: "Works described as in progress." },
              { label: "Completed", value: counts.completed, note: "Records closed as delivered." },
              { label: "Planned", value: counts.planned, note: "Forward priorities in preparation." },
            ].map((c) => (
              <div key={c.label} className="bg-white px-5 py-4">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{c.label}</p>
                <p className="mt-1 font-display text-[17px] font-extrabold text-gold-600">{c.value}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">{c.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Reveal>
              <SectionHeading
                eyebrow="Published records"
                title={published.length ? `${published.length} verified municipal projects` : "Verified municipal projects"}
                description="Each record below was entered by an authorised municipal officer, reviewed and published. Nothing is generated or estimated by this website."
              />
            </Reveal>

            <div className="mt-7">
              {published.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {published.map((p) => (
                    <PublishedProjectCard
                      key={p.slug}
                      project={{
                        slug: p.slug, title: p.title, category: p.category, projectStatus: p.projectStatus,
                        location: p.location, summary: p.summary, imagePath: p.imagePath,
                        imageAlt: p.imageAlt, budget: p.budget, publishedAt: p.publishedAt,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No verified project records are published yet"
                  body="Project records appear here only after the Municipality has confirmed scope, location, status and any published figure. The template below shows how a record will read once that information is supplied."
                >
                  <Link href="/resources?category=Integrated+Development+Plans" className="btn btn-outline mt-4 !py-2.5 !text-[11.5px]">
                    Read the published development plans
                  </Link>
                </EmptyState>
              )}
            </div>
          </div>

          <div className="mt-14 border-t border-paper-line pt-10">
            <div className="flex gap-3.5 border border-flag-red/30 bg-flag-red/[0.04] p-5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-flag-red" aria-hidden="true" />
              <div>
                <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.08em] text-green-900">
                  Template preview — not official records
                </h2>
                <p className="mt-1.5 text-[12.5px] leading-[1.8] text-ink-soft">
                  The records below were written during the design phase to demonstrate the project template. They are
                  not municipal projects, they carry no official figures, and they are excluded from the homepage, site
                  search and the XML sitemap.
                </p>
              </div>
            </div>
            <div className="mt-7">
              <Suspense fallback={<p className="text-[12.5px] text-ink-muted">Loading the template preview…</p>}>
                <ProjectGallery />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
