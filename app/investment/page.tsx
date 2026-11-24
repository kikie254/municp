import type { Metadata } from "next";
import Link from "next/link";
import { Store, Truck, Building2, HandshakeIcon, FileText, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
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

        </div>
      </section>

      <section className="border-y border-paper-line bg-paper-warm py-14">
        <div className="shell">
          <div className="max-w-2xl border-t-[3px] border-green-800 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-green-900">Investment and development enquiries</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              For enquiries about municipal planning and economic development, contact the municipal office.
            </p>
            <Link href="/contact" className="btn btn-primary mt-5 !py-2.5 !text-[11.5px]">
              Contact the municipality <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
