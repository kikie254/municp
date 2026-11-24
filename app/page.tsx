import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, MessageSquare, FileText, Users,
  TrendingUp, Landmark, CheckCircle2, CalendarDays, Quote,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceIcon } from "@/components/ServiceIcon";
import { NewsCard } from "@/components/NewsCard";
import { DocumentCard } from "@/components/DocumentCard";
import { CtaBand } from "@/components/CtaBand";
import { GovernmentJsonLd } from "@/components/BreadcrumbJsonLd";
import { priorities } from "@/lib/data/services";
import { featuredDocuments } from "@/lib/data/documents";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState } from "@/components/EmptyState";
import {
  emptyStateCopy, hasPublishedNews, hasPublishedProjects, publishedNews, publishedProjects,
} from "@/lib/content";
import { site } from "@/lib/site";
import { publicImageAssetsApproved } from "@/lib/config/env";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const quickAccess = [
  {
    title: "Municipal Services",
    description:
      "Find municipal governance documents and information about the statutory framework for urban services.",
    href: "/services",
    icon: "spaces",
  },
  {
    title: "Projects and Development",
    description:
      "Read about the Municipality's development priorities and view project records that have been confirmed for publication.",
    href: "/projects",
    icon: "planning",
  },
  {
    title: "Documents and Reports",
    description:
      "Browse County-hosted documents and verify adoption status and current applicability with the responsible institution.",
    href: "/resources",
    icon: "information",
  },
  {
    title: "Public Participation",
    description:
      "Review published notices and reports; follow the instructions in each authorised public notice.",
    href: "/public-participation",
    icon: "community",
  },
  {
    title: "Investment Opportunities",
    description:
      "Explore the Municipality's planning context and published investment documents.",
    href: "/investment",
    icon: "trade",
  },
  {
    title: "Citizen Feedback",
    description:
      "Review complaint and feedback information. Online submissions are disabled on this demonstration website.",
    href: "/feedback",
    icon: "governance",
  },
];

/**
 * Municipal profile figures are drawn from the Urban Climate Risk Profile and
 * the Municipality's published waste-management documents. The population figure
 * is the 2019 census baseline; the later figure is a projection, not a census result.
 */
const stats = [
  { value: "Iten-Tambach", label: "Municipality" },
  { value: "Elgeyo Marakwet", label: "County" },
  { value: "Kenya", label: "National context" },
  { value: "Pending", label: "Adopted charter verification" },
];

export default function HomePage() {
  // Only published (verified) records reach the homepage. Demonstration records are excluded
  // here and in search, the XML sitemap and related-content widgets — see lib/content.ts.
  const featured = publishedNews.find((n) => n.featured) ?? publishedNews[0];
  const secondary = publishedNews.filter((n) => n.slug !== featured?.slug).slice(0, 2);
  const previewProjects = publishedProjects.slice(0, 3);

  return (
    <>
      <GovernmentJsonLd />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-green-950">
        {publicImageAssetsApproved() && (
          <Image
            src="/images/iten-hero.jpg"
            alt="The welcome arch marking the entrance to Iten town, County of Champions, Elgeyo Marakwet"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 pattern-grid opacity-50" aria-hidden="true" />

        <div className="shell relative pb-14 pt-12 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
          <div className="max-w-[760px]">
            <p className="inline-flex items-center gap-2.5 border border-white/20 bg-white/8 px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm sm:text-[10px]">
              <Landmark className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
              {site.county}
            </p>

            <h1 className="mt-6 text-balance font-display text-[2rem] font-extrabold uppercase leading-[1.03] tracking-[-0.02em] text-white sm:text-[2.7rem] md:text-[3.3rem] lg:text-[3.9rem]">
              Welcome to
              <br />
              <span className="text-gold-400">Iten-Tambach</span> Municipality
            </h1>

            <p className="mt-5 max-w-xl font-display text-[15px] font-semibold leading-snug text-white/90 sm:text-[17px] md:text-[19px]">
              Municipal information and public resources for residents and stakeholders
            </p>

            <div className="mt-6 max-w-xl space-y-3.5 border-l-2 border-gold-400/70 pl-4 sm:pl-5">
              <p className="text-[13.5px] leading-[1.8] text-white/72 sm:text-[14px]">
                  Iten-Tambach is a municipality within Elgeyo Marakwet County. The County-hosted charter document currently available for reference is labelled a model draft; the adopted charter and its grant details require confirmation by the Municipality.
              </p>
              <p className="text-[13.5px] leading-[1.8] text-white/72 sm:text-[14px]">
                The Urban Areas and Cities Act sets out the national municipal framework. Local delegated responsibilities and service arrangements must be confirmed against the operative charter and current County instruments.
              </p>
              <p className="text-[13.5px] leading-[1.8] text-white/72 sm:text-[14px]">
                The County-hosted model charter includes draft vision and mission language. The Municipality must confirm its adopted statements before this website presents them as official.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-gold">
                Explore Our Municipality <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/projects" className="btn btn-ghost">
                Discover Our Projects
              </Link>
              <Link href="/feedback" className="btn btn-ghost">
                <MessageSquare aria-hidden="true" /> Feedback Information
              </Link>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="relative border-t border-white/12 bg-green-950/70 backdrop-blur-sm">
          <div className="shell grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-3 py-5 first:pl-0 sm:px-5">
                <p className="font-display text-[19px] font-extrabold leading-none text-gold-400 sm:text-[23px]">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[9.5px] font-medium uppercase leading-tight tracking-[0.13em] text-white/50 sm:text-[10.5px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS ───────────────────────────────────── */}
      <section className="bg-paper-warm py-16 md:py-20" aria-labelledby="quick-access-heading">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Quick Access"
              title="How Can We Help You?"
              description="Find municipal information, access public resources and connect with the services and information that matter to you."
            />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickAccess.map((card, i) => (
              <Reveal key={card.title} delay={i * 60}>
                <Link
                  href={card.href}
                  className="group flex h-full flex-col border border-paper-line bg-white p-5 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-green-300 hover:shadow-lift sm:p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center bg-green-50 text-green-700 transition-colors duration-300 group-hover:bg-green-800 group-hover:text-gold-400">
                    <ServiceIcon name={card.icon} className="h-[21px] w-[21px]" />
                  </span>
                  <h3 className="mt-4 font-display text-[15px] font-bold leading-snug text-green-900">{card.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">{card.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[10.5px] font-bold uppercase tracking-[0.13em] text-green-700 transition-colors group-hover:text-gold-700">
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-green-950">
                {publicImageAssetsApproved() && (
                  <Image
                    src="/images/iten-town-aerial.jpg"
                    alt="Elevated view of Iten town showing roads, buildings, trees and the surrounding highlands"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-6 -right-4 hidden w-52 border-t-[3px] border-gold-400 bg-green-900 p-5 text-white shadow-lift sm:block lg:-right-6">
                <Quote className="h-5 w-5 text-gold-400" aria-hidden="true" />
                <p className="mt-2 font-display text-[13px] font-semibold leading-snug">
                  A centre of administration, commerce and community life.
                </p>
              </div>
              <div className="absolute -left-3 -top-3 hidden h-16 w-16 border-l-2 border-t-2 border-gold-400 lg:block" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="eyebrow mb-4">About the Municipality</p>
              <h2 className="text-balance font-display text-[1.6rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-green-900 sm:text-[2rem] md:text-[2.35rem]">
                A highland municipality with a distinctive place in the region
              </h2>
              <div className="mt-5 space-y-3.5">
                <p className="text-[14px] leading-[1.85] text-ink-soft">
                  County Government publications identify Iten-Tambach as a municipality within Elgeyo Marakwet County.
                </p>
                <p className="text-[14px] leading-[1.85] text-ink-soft">
                  The official municipal boundary, ward coverage and area figures require confirmation against current County and national records.
                </p>
                <p className="text-[14px] leading-[1.85] text-ink-soft">
                  Municipal population and projection figures are not displayed until the geographic boundary and source tables are confirmed.
                </p>
                <p className="text-[14px] leading-[1.85] text-ink-soft">
                  The national statutory framework provides for municipal governance and resident participation. The operative local charter and current participation arrangements require institutional confirmation.
                </p>
              </div>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {[
                  "Urban planning and development",
                  "Waste and environmental management",
                  "Public spaces and amenities",
                  "Resident participation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] font-medium text-green-900">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/about" className="btn btn-primary mt-7">
                Discover Our Municipality <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRIORITIES ─────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-green-900 py-16 md:py-20">
        <div className="absolute inset-0 pattern-dots opacity-[0.055]" aria-hidden="true" />
        <div className="shell relative">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Development Priorities"
              title="Our Priorities. Our Commitment. Our Future."
              description="The County-hosted planning materials describe development themes; the Municipality must confirm which priorities are formally adopted."
              align="center"
            />
          </Reveal>

          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {priorities.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="group h-full border border-white/12 bg-white/[0.04] p-5 transition-colors duration-300 hover:border-gold-400/50 hover:bg-white/[0.07]">
                  <span className="flex h-10 w-10 items-center justify-center border border-gold-400/40 text-gold-400">
                    <ServiceIcon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[14px] font-bold leading-snug text-white">{p.title}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/60">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ───────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="Projects and Development"
                title="Development priorities and public investment"
                description="Project records will be displayed when verified project information and publication approval have been supplied."
              />
            </Reveal>
            <Link href="/projects" className="link-arrow shrink-0 pb-1">
              View all projects <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          {hasPublishedProjects ? (
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {previewProjects.map((p, i) => (
                <Reveal key={p.slug} delay={i * 70}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState className="mt-9" title={emptyStateCopy.projects.title} body={emptyStateCopy.projects.body} />
          )}

        </div>
      </section>

      {/* ── PUBLIC PARTICIPATION ───────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-green-950">
        {publicImageAssetsApproved() && (
          <Image
            src="/images/public-engagement.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-30"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950 via-green-950/94 to-green-900/60" aria-hidden="true" />
        <div className="shell relative py-16 md:py-20">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow eyebrow-light mb-4">Public Participation</p>
              <h2 className="text-balance font-display text-[1.65rem] font-extrabold uppercase leading-[1.1] tracking-[-0.01em] text-white sm:text-[2.1rem] md:text-[2.6rem]">
                Residents have a place in municipal decision-making
              </h2>
              <div className="mt-5 space-y-3.5">
                <p className="text-[14px] leading-[1.85] text-white/72">
                  Public participation is part of the legal framework for municipal governance.
                </p>
                <p className="text-[14px] leading-[1.85] text-white/72">
                  The Urban Areas and Cities Act provides for Citizen Fora. Current notices, calendars and reports must be confirmed through documents issued by an authorised office.
                </p>
                <p className="text-[14px] leading-[1.85] text-white/72">
                  Residents can review published notices, prepare their views and take part in consultations when they are announced.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/public-participation" className="btn btn-gold">
                  <Users aria-hidden="true" /> Participate in Development
                </Link>
                <Link href="/news?filter=Public+Notices" className="btn btn-ghost">
                  View Public Notices
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/12 pt-8 sm:grid-cols-3">
            {[
              { icon: CalendarDays, label: "Citizen fora", note: "Published notices and participation reports" },
              { icon: FileText, label: "Public notices", note: "Announcements issued through official channels" },
              { icon: MessageSquare, label: "Feedback channels", note: "Written submissions and grievance redress" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <div>
                  <p className="text-[12px] font-semibold text-white">{item.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/50">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCUMENTS ──────────────────────────────────────── */}
      <section className="bg-paper-warm py-16 md:py-20">
        <div className="shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="Document Centre"
                title="Municipal Documents and Public Resources"
                description="Browse County-hosted records. Confirm adoption status and current applicability before relying on a document."
              />
            </Reveal>
            <Link href="/resources" className="link-arrow shrink-0 pb-1">
              View all documents <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDocuments.slice(0, 3).map((doc, i) => (
              <Reveal key={doc.id} delay={i * 70}>
                <DocumentCard doc={doc} compact />
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex justify-start">
            <Link href="/resources" className="btn btn-primary !py-3 !text-[12px]">
              Browse Document Centre <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWS ───────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="Newsroom"
                title="Latest News and Updates"
                description="This demonstration page shows how authorised municipal announcements and public notices could be presented."
              />
            </Reveal>
            <Link href="/news" className="link-arrow shrink-0 pb-1">
              All news and notices <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          {hasPublishedNews ? (
            <div className="mt-9 grid gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Reveal><NewsCard item={featured} featured /></Reveal>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                {secondary.map((n, i) => (
                  <Reveal key={n.slug} delay={i * 80}><NewsCard item={n} /></Reveal>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState className="mt-9" title={emptyStateCopy.news.title} body={emptyStateCopy.news.body} />
          )}
        </div>
      </section>

      {/* ── INVESTMENT ─────────────────────────────────────── */}
      <section className="bg-paper-warm py-16 md:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <div>
              <p className="eyebrow mb-4">Investment and Economic Development</p>
              <h2 className="text-balance font-display text-[1.6rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-green-900 sm:text-[2rem] md:text-[2.3rem]">
                An economy shaped by its people and place
              </h2>
              <div className="mt-5 space-y-3.5">
                <p className="text-[14px] leading-[1.85] text-ink-soft">
                  County planning materials identify agriculture, local trade and public administration among the local economic context. Municipal-level economic figures and delegated functions require confirmation.
                </p>
                <p className="text-[14px] leading-[1.85] text-ink-soft">
                  The Municipality's planning and investment documents provide a starting point for enquiries from businesses and development partners. Any land availability, incentives or approvals must be confirmed through the responsible public offices.
                </p>
                <p className="text-[14px] leading-[1.85] text-ink-soft">
                  Household-level economic statistics are withheld until the source tables, geographic scope and publication authority are confirmed.
                </p>
              </div>
              <Link href="/investment" className="btn btn-primary mt-7">
                <TrendingUp aria-hidden="true" /> Review Investment Information
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: "trade", title: "Trade and Commerce", text: "Trade and local enterprise support the municipal economy." },
                { icon: "planning", title: "Urban Development", text: "Guided by the Iten Integrated Spatial Plan 2015–2035." },
                { icon: "community", title: "Local Enterprise", text: "Local responsibility for markets and public spaces requires confirmation from the adopted charter and County instruments." },
                { icon: "information", title: "Planning Resources", text: "Published plans that inform investment enquiries." },
              ].map((c) => (
                <div key={c.title} className="border border-paper-line bg-white p-4 shadow-card">
                  <ServiceIcon name={c.icon} className="h-4 w-4 text-gold-600" />
                  <p className="mt-2.5 font-display text-[12.5px] font-bold text-green-900">{c.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">{c.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
