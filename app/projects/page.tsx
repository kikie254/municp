import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { EmptyState } from "@/components/EmptyState";
import { PublishedProjectCard } from "@/components/content/PublishedBlocks";
import { getPublishedProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects and Municipal Development",
  description:
    "Explore municipal development priorities and project information for Iten-Tambach.",
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
        intro="Explore municipal development priorities across infrastructure, environment and public spaces."
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
                title="Municipal project information"
                description="Explore development priorities and published project information."
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
                  title="Municipal project information"
                  body="Project information will be displayed here."
                >
                  <Link href="/resources?category=Integrated+Development+Plans" className="btn btn-outline mt-4 !py-2.5 !text-[11.5px]">
                    Read the published development plans
                  </Link>
                </EmptyState>
              )}
            </div>
          </div>


        </div>
      </section>

      <CtaBand />
    </>
  );
}
