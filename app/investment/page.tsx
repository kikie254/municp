import type { Metadata } from "next";
import Link from "next/link";
import { Store, Truck, Building2, HandshakeIcon, FileText, ArrowRight, Info } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { documents } from "@/lib/data/documents";

export const metadata: Metadata = {
  title: "Investment and Economic Development",
  description:
    "Iten-Tambach's development potential: trade and commerce, local enterprise, urban development, investment enquiries and municipal planning resources.",
  alternates: { canonical: "/investment" },
};

const pillars = [
  {
    icon: Store,
    title: "Trade and Commerce",
    text: "Trade and local enterprise are part of the Municipality's economic life. The Municipal Charter provides for municipal markets and abattoirs and for the regulation of outdoor advertising.",
  },
  {
    icon: Truck,
    title: "Local Enterprise",
    text: "The Urban Climate Risk Profile identifies small businesses and informal trade among local livelihood activities. The municipal role is framed by its statutory functions and by coordination with the County offices responsible for trade and licensing.",
  },
  {
    icon: Building2,
    title: "Urban Development",
    text: "The Iten Integrated Spatial Plan (2015–2035) is listed in the County Government's document repository. It provides planning context for land use and urban development; proposals remain subject to the approvals required by law.",
  },
  {
    icon: HandshakeIcon,
    title: "Development Partnerships",
    text: "Municipal and County planning documents refer to engagement with development partners and national programmes. Any proposed partnership must follow the approvals and public-sector procedures that apply.",
  },
];

const planningDocs = documents.filter((d) =>
  ["Integrated Development Plans", "Spatial Plans", "Investment Plans", "Other Official Publications"].includes(d.category)
).slice(0, 5);

export default function InvestmentPage() {
  return (
    <>
      <PageHero
        title="Investment and Economic Development"
        intro="Iten-Tambach's economy draws on agriculture, trade, public administration and its international reputation for high-altitude athletics. The Municipality's published planning and investment documents provide useful context for businesses and development partners considering the area."
        image="/images/highlands.jpg"
        imageAlt="Highland farmland and settlement in Elgeyo Marakwet County"
        eyebrow="Economic Development"
        crumbs={[{ label: "Investment" }]}
      />

      <section className="bg-white py-14 md:py-18">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Investment Potential"
              title="The local economy and its development context"
              description="The available planning profile identifies agriculture, trade, public administration and athletics-related activity as important parts of the municipal economy."
            />
          </Reveal>
          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <article className="group flex h-full gap-4 border border-paper-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lift">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-green-50 text-green-700 transition-colors group-hover:bg-green-800 group-hover:text-gold-400">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-display text-[14.5px] font-bold text-green-900">{p.title}</h2>
                    <p className="mt-1.5 text-[12.5px] leading-[1.8] text-ink-muted">{p.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex gap-3.5 border-l-[3px] border-flag-red bg-flag-red/[0.04] p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-flag-red" aria-hidden="true" />
            <div>
              <h2 className="font-display text-[12.5px] font-bold uppercase tracking-[0.08em] text-green-900">
                What this website does not state
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-[1.8] text-ink-soft">
                This page does not publish investment incentives, tax exemptions, land availability, plot allocations,
                licensing timelines or guaranteed returns. No such commitment has been verified for publication.
                Any incentive or allocation would in any event require the approvals prescribed by law and would be
                communicated through official channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-paper-line bg-paper-warm py-14">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Municipal Planning Resources"
                title="Read the plans before you invest"
                description="Proposals are easier to progress when they align with published planning documents. The following records are listed in the municipal document centre and link to the County Government’s own repository."
              />
            </Reveal>
            <ul className="mt-6 space-y-3">
              {planningDocs.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/resources?category=${encodeURIComponent(d.category)}`}
                    className="group flex items-start gap-3 border border-paper-line bg-white p-3.5 transition-colors hover:border-green-300"
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-semibold leading-snug text-green-900 group-hover:underline">{d.title}</span>
                      <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.1em] text-ink-muted">{d.category} · {d.year}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/resources" className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">
              Open document centre <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
