import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, CalendarDays, Building2, Wallet, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { ProjectCard } from "@/components/ProjectCard";
import { PublishedProjectCard, formatDate } from "@/components/content/PublishedBlocks";
import { projects, getProject } from "@/lib/data/projects";
import { getProjectBySlug, getPublishedProjects } from "@/lib/queries";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const record = await getProjectBySlug(slug);
  if (record) {
    return {
      title: record.title,
      description: record.summary,
      alternates: { canonical: `/projects/${record.slug}` },
      openGraph: { title: record.title, description: record.summary, type: "article", ...(record.imagePath ? { images: [record.imagePath] } : {}) },
      robots: { index: true, follow: true },
    };
  }
  const project = getProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const record = await getProjectBySlug(slug);
  if (record) {
    const others = (await getPublishedProjects()).filter((p) => p.slug !== record.slug).slice(0, 3);
    const facts = [
      { icon: MapPin, label: "Location", value: record.location },
      { icon: Building2, label: "Category", value: record.category },
      { icon: CheckCircle2, label: "Status", value: record.projectStatus },
      { icon: CalendarDays, label: "Start", value: record.startDate || "Not published" },
      { icon: CalendarDays, label: "Completion", value: record.completionDate || "Not published" },
      { icon: Wallet, label: "Budget", value: record.budget || "Not published" },
      { icon: Building2, label: "Implementing agency", value: record.implementingAgency || "Not published" },
    ];
    const objectives = record.objectives.split("\n").map((s) => s.trim()).filter(Boolean);

    return (
      <>
        <PageHero
          title={record.title}
          intro={record.summary}
          image={record.imagePath ?? "/images/market-development.jpg"}
          imageAlt={record.imageAlt ?? ""}
          eyebrow={`${record.category} · ${record.projectStatus}`}
          crumbs={[{ label: "Projects", href: "/projects" }, { label: record.title }]}
        />
        <section className="bg-white py-14">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <p className="border-b border-paper-line pb-4 text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                Published {formatDate(record.publishedAt)}
              </p>
              {record.imagePath && (
                <div className="relative mt-6 aspect-[16/9] overflow-hidden bg-green-950">
                  <Image src={record.imagePath} alt={record.imageAlt ?? ""} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
                </div>
              )}
              <div className="prose-gov mt-8 space-y-4">
                {record.description.split(/\n{2,}/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {objectives.length > 0 && (
                <div className="mt-9">
                  <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.05em] text-green-900">Objectives</h2>
                  <ul className="mt-4 space-y-2.5">
                    {objectives.map((o) => (
                      <li key={o} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden="true" /> {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href="/projects" className="mt-8 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-green-700 hover:text-gold-700">
                <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Back to all projects
              </Link>
            </div>
            <aside className="lg:col-span-4">
              <div className="sticky top-24 border-t-[3px] border-green-800 bg-white p-5 shadow-card">
                <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Project facts</h2>
                <dl className="mt-4 divide-y divide-paper-line">
                  {facts.map((f) => (
                    <div key={f.label} className="flex gap-3 py-3">
                      <f.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" aria-hidden="true" />
                      <div className="min-w-0">
                        <dt className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-ink-muted">{f.label}</dt>
                        <dd className="mt-0.5 text-[12px] leading-snug text-green-900">{f.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </section>
        {others.length > 0 && (
          <section className="bg-paper-warm py-14">
            <div className="shell">
              <h2 className="font-display text-[1.25rem] font-bold text-green-900">More project records</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((p) => (
                  <PublishedProjectCard key={p.slug} project={{ ...p }} />
                ))}
              </div>
            </div>
          </section>
        )}
        <CtaBand />
      </>
    );
  }

  const project = getProject(slug);
  if (!project) notFound();
  const related = projects.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 3);
  const fallback = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const facts = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Building2, label: "Category", value: project.category },
    { icon: CheckCircle2, label: "Status", value: project.status },
    { icon: CalendarDays, label: "Start date", value: project.startDate },
    { icon: CalendarDays, label: "Completion date", value: project.completionDate },
    { icon: Wallet, label: "Budget", value: project.budget },
    { icon: Building2, label: "Implementing agency", value: project.implementingAgency },
  ];

  return (
    <>
      <PageHero
        title={project.title}
        intro={project.summary}
        image={project.image}
        imageAlt={project.imageAlt}
        eyebrow={`${project.category} · ${project.status}`}
        crumbs={[{ label: "Projects", href: "/projects" }, { label: project.title }]}
      />
      <section className="bg-white py-14">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <div className="flex gap-3 border border-flag-red/30 bg-flag-red/[0.04] p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />
              <p className="text-[11.5px] leading-relaxed text-ink-soft">
                <strong className="font-semibold text-green-900">Template record.</strong> This entry is design-phase
                sample content and is not an official municipal project record.
              </p>
            </div>
            <div className="relative mt-6 aspect-[16/9] overflow-hidden bg-green-950">
              <Image src={project.image} alt={project.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
            </div>
            <div className="prose-gov mt-8 space-y-4">
              {project.description.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
            </div>
            <Link href="/projects" className="mt-8 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-green-700 hover:text-gold-700">
              <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Back to all projects
            </Link>
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-24 border-t-[3px] border-green-800 bg-white p-5 shadow-card">
              <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Template facts</h2>
              <dl className="mt-4 divide-y divide-paper-line">
                {facts.map((f) => (
                  <div key={f.label} className="flex gap-3 py-3">
                    <f.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-ink-muted">{f.label}</dt>
                      <dd className="mt-0.5 text-[12px] leading-snug text-green-900">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>
      <section className="bg-paper-warm py-14">
        <div className="shell">
          <h2 className="font-display text-[1.25rem] font-bold text-green-900">More template records</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(related.length ? related : fallback).map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
