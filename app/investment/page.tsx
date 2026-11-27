import type { Metadata } from "next";
import Link from "next/link";
import {
  Store, Truck, Building2, HandshakeIcon, FileText, ArrowRight,
  ExternalLink, ClipboardCheck, MessageSquareText, ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { documents } from "@/lib/data/documents";

export const metadata: Metadata = {
  title: "Investment and Economic Development",
  description:
    "Explore Iten-Tambach's published planning context, investment documents and official enquiry route for businesses and development partners.",
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
    text: "The Urban Climate Risk Profile identifies small businesses and informal trade among local livelihood activities. Licensing and sector-specific approvals may involve County departments and other statutory agencies.",
  },
  {
    icon: Building2,
    title: "Urban Development",
    text: "The Iten Integrated Spatial Plan (2015–2035) provides planning context for land use and urban development. Any site-specific proposal remains subject to the applicable planning, environmental and statutory approvals.",
  },
  {
    icon: HandshakeIcon,
    title: "Development Partnerships",
    text: "Municipal and County planning documents refer to engagement with development partners and national programmes. Proposed partnerships must follow the public-sector approvals and procurement procedures that apply.",
  },
];

const planningDocs = documents.filter(
  (doc) =>
    doc.verification === "content-confirmed" &&
    ["Integrated Development Plans", "Spatial Plans", "Investment Plans", "Other Official Publications"].includes(doc.category),
);

const enquirySteps = [
  {
    icon: FileText,
    title: "Start with published plans",
    text: "Review the Municipality's development and investment documents to understand the planning context and the priorities already on record.",
  },
  {
    icon: ClipboardCheck,
    title: "Prepare a clear proposal",
    text: "Describe the proposed activity, location, land or facility requirements, expected community value, resource needs and the approvals you believe may apply.",
  },
  {
    icon: MessageSquareText,
    title: "Send an official enquiry",
    text: "Contact the municipal office with your proposal and supporting documents. The office can direct the enquiry to the relevant municipal or County department.",
  },
  {
    icon: ShieldCheck,
    title: "Complete statutory checks",
    text: "Confirm land status, planning compatibility, licensing, environmental requirements and any tender or partnership process directly with the legally responsible authority before committing funds.",
  },
];

export default function InvestmentPage() {
  return (
    <>
      <PageHero
        title="Investment and Economic Development"
        intro="Iten-Tambach's economy draws on agriculture, trade, public administration and its athletics heritage. This page brings together published planning context and a clear route for businesses and development partners to make an informed enquiry."
        image="/images/highlands.jpg"
        imageAlt="Highland landscape in Elgeyo Marakwet County"
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
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 60}>
                <article className="group flex h-full gap-4 border border-paper-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lift">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-green-50 text-green-700 transition-colors group-hover:bg-green-800 group-hover:text-gold-400">
                    <pillar.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-display text-[14.5px] font-bold text-green-900">{pillar.title}</h2>
                    <p className="mt-1.5 text-[12.5px] leading-[1.8] text-ink-muted">{pillar.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-paper-line bg-paper-warm py-14 md:py-16">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="A practical route"
              title="How to make an investment enquiry"
              description="A straightforward process helps the Municipality understand your proposal and direct it to the right office. An enquiry is not an approval or a guarantee of an opportunity."
            />
          </Reveal>
          <ol className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {enquirySteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 50}>
                <li className="h-full border border-paper-line bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center bg-green-900 text-gold-300">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-gold-700">Step {index + 1}</p>
                  <h3 className="mt-1 font-display text-[14px] font-bold text-green-950">{step.title}</h3>
                  <p className="mt-2 text-[12px] leading-[1.8] text-ink-muted">{step.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Contact the municipal office <ArrowRight aria-hidden="true" />
            </Link>
            <a href="https://elgeyomarakwet.go.ke/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              County Government website <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-18">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Reference documents"
              title="Read the published planning material"
              description="Only records whose document text has been checked against the displayed title are listed here. Other repository entries remain available in the document centre with their verification status."
            />
          </Reveal>
          {planningDocs.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {planningDocs.map((doc) => (
                <article key={doc.id} className="flex h-full gap-4 border border-paper-line p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-green-50 text-green-800">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[13.5px] font-bold leading-snug text-green-950">{doc.title}</h3>
                    <p className="mt-2 text-[11.5px] leading-[1.7] text-ink-muted">{doc.summary}</p>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-green-800 underline underline-offset-4 hover:text-gold-700">
                      Open document <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink-muted">No verified planning documents are currently available in this section. Visit the document centre for the full register.</p>
          )}
          <Link href="/resources" className="mt-7 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-green-800 underline underline-offset-4">
            Browse all municipal documents <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="border-t border-paper-line bg-paper-warm py-12">
        <div className="shell">
          <div className="max-w-3xl border-t-[3px] border-green-800 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-display text-lg font-bold text-green-900">Important information for prospective investors</h2>
            <p className="mt-3 text-[12.5px] leading-[1.8] text-ink-soft">
              This page is an information and enquiry route, not a live catalogue of available land, investment plots, incentives, tenders or guaranteed returns. Availability, ownership, pricing, approvals and procurement opportunities must be verified through the relevant official process. Do not make payments or commitments based only on an informal introduction or website enquiry.
            </p>
            <Link href="/contact" className="btn btn-primary mt-5 !py-2.5 !text-[11.5px]">
              Make an official enquiry <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
