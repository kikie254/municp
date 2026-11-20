import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Eye, Scale, Landmark, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { coreValues } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "About the Municipality",
  description:
    "Learn about Iten-Tambach Municipality within the County Government of Elgeyo Marakwet: our role, vision, mission, core values and mandate.",
  alternates: { canonical: "/about" },
};

const mandatePoints = [
  {
    title: "Urban Areas and Cities Act, 2011 (as amended)",
    body:
      "The municipality operates within the framework established by the Urban Areas and Cities Act, 2011, as amended, which provides for the governance and management of urban areas and cities in Kenya.",
    icon: Scale,
  },
  {
    title: "Iten-Tambach Municipal Charter",
    body:
      "The Iten Tambach Municipal Charter is the instrument incorporating the municipality. It sets out the objects of the municipality, its functions, and the establishment, composition and powers of the Municipal Board.",
    icon: Landmark,
  },
  {
    title: "Applicable county and national legislation",
    body:
      "Municipal administration is also subject to applicable county legislation and national law, including the constitutional framework for devolution and public participation.",
    icon: ShieldCheck,
  },
  {
    title: "Approved municipal development frameworks",
    body:
      "Planning and investment decisions are guided by the municipal planning frameworks published by the County, including the Integrated Development Plan and the Iten Integrated Spatial Plan (2015–2035). The status of each published document is recorded in the document centre.",
    icon: Target,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Iten-Tambach Municipality"
        intro="Iten-Tambach Municipality operates within the County Government of Elgeyo Marakwet and contributes to the planning, management and development of the municipality in accordance with applicable laws and its approved institutional framework."
        image="/images/iten-town-aerial.jpg"
        imageAlt="Elevated view of towns and green highlands around Iten in Elgeyo Marakwet County"
        eyebrow="Our Institution"
        crumbs={[{ label: "About Us" }]}
      />

      {/* Introduction */}
      <section className="bg-white py-16 md:py-20">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div>
              <p className="eyebrow mb-4">Who We Are</p>
              <h2 className="text-balance font-display text-[1.6rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-green-900 sm:text-[1.95rem] md:text-[2.2rem]">
                An urban institution serving the people of Elgeyo Marakwet
              </h2>
              <div className="mt-5 space-y-4">
                <p className="text-[14.5px] leading-[1.85] text-ink-soft">
                  Iten-Tambach Municipality operates within the County Government of Elgeyo Marakwet and contributes
                  to the planning, management and development of the municipality in accordance with applicable laws
                  and its approved institutional framework.
                </p>
                <p className="text-[14.5px] leading-[1.85] text-ink-soft">
                  Our role is to support sustainable urban development, promote effective municipal governance,
                  strengthen public participation and contribute to an improved urban environment.
                </p>
                <p className="text-[14.5px] leading-[1.85] text-ink-soft">
                  We believe that successful urban development requires collaboration between government
                  institutions, communities, businesses and development partners.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/resources?category=Municipal+Charter" className="btn btn-primary !py-3 !text-[12.5px]">
                  Read the Municipal Charter <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/governance" className="btn btn-outline !py-3 !text-[12.5px]">
                  Municipal Governance
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-5">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-green-950">
                <Image
                  src="/images/highlands.jpg"
                  alt="Green highland valley in Elgeyo Marakwet County with farmland and distant hills"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="border-t-[3px] border-gold-400 bg-green-900 p-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-400">
                  Institutional identity
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/75">
                  Iten-Tambach Municipality is one of the urban units within the County Government of Elgeyo Marakwet,
                  styled the &ldquo;County of Champions&rdquo;.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="bg-paper-warm py-16 md:py-20">
        <div className="shell">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="h-full border-t-[3px] border-green-800 bg-white p-6 shadow-card sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center bg-green-50 text-green-700">
                  <Eye className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-[17px] font-bold uppercase tracking-[0.04em] text-green-900">
                  Our Vision
                </h2>
                <p className="mt-3 text-[14px] leading-[1.85] text-ink-soft">
                  &ldquo;To be a well-planned, inclusive, clean and vibrant municipality that provides opportunities
                  and improves the quality of life for all.&rdquo;
                </p>
                <p className="mt-4 border-l-2 border-gold-400 pl-3 text-[11.5px] leading-relaxed text-ink-muted">
                  Proposed institutional statement, subject to official approval.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="h-full border-t-[3px] border-gold-400 bg-white p-6 shadow-card sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center bg-gold-50 text-gold-700">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-[17px] font-bold uppercase tracking-[0.04em] text-green-900">
                  Our Mission
                </h2>
                <p className="mt-3 text-[14px] leading-[1.85] text-ink-soft">
                  &ldquo;To promote sustainable urban development through effective planning, accountable governance,
                  environmental stewardship and inclusive community participation.&rdquo;
                </p>
                <p className="mt-4 border-l-2 border-gold-400 pl-3 text-[11.5px] leading-relaxed text-ink-muted">
                  Proposed institutional statement, subject to official approval.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-white py-16 md:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Core Values"
              title="The principles that guide municipal service"
              description="These values describe the standard of conduct expected in municipal decision-making and service delivery."
            />
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((v, i) => (
              <Reveal key={v.name} delay={i * 45}>
                <div className="h-full bg-white p-6 transition-colors hover:bg-green-50/60">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-[11px] font-bold tabular-nums text-gold-600">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-[14.5px] font-bold uppercase tracking-[0.05em] text-green-900">
                      {v.name}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-[1.8] text-ink-muted">{v.description}</p>
                </div>
              </Reveal>
            ))}
            <div className="bg-green-900 p-6">
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-gold-400">
                Our Commitment
              </p>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/65">
                Service to residents, respect for the law and responsible stewardship of municipal resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mandate */}
      <section className="bg-paper-warm py-16 md:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Our Mandate"
              title="Grounded in law and the Municipal Charter"
              description="The municipality's authority and responsibilities derive from the legal and institutional framework that establishes and governs urban areas in Kenya."
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {mandatePoints.map((m, i) => (
              <Reveal key={m.title} delay={i * 60}>
                <div className="flex h-full gap-4 border border-paper-line bg-white p-5 shadow-card">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-green-50 text-green-700">
                    <m.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-[13.5px] font-bold leading-snug text-green-900">{m.title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-[1.8] text-ink-soft">{m.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 border-l-[3px] border-flag-red bg-white p-5">
            <p className="text-[12.5px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-green-900">Note on statutory responsibilities:</strong> this page
              describes the framework within which the municipality operates in general terms. It does not restate,
              extend or reinterpret the statutory responsibilities set out in law. Specific functions, approvals and
              regulatory powers remain with the institutions to which they are assigned by the applicable legislation.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/resources?category=Municipal+Charter" className="btn btn-outline !py-3 !text-[12px]">
              Municipal Charter <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/resources?category=Integrated+Development+Plans" className="btn btn-outline !py-3 !text-[12px]">
              Integrated Development Plan
            </Link>
            <Link href="/resources?category=Spatial+Plans" className="btn btn-outline !py-3 !text-[12px]">
              Spatial Plan 2015–2035
            </Link>
          </div>
        </div>
      </section>

      {/* At a glance strip */}
      <section className="bg-white py-14">
        <div className="shell">
          <div className="grid gap-4 border border-paper-line bg-paper-warm p-6 sm:grid-cols-3">
            {[
              { label: "Parent government", value: "County Government of Elgeyo Marakwet" },
              { label: "Republic", value: "Republic of Kenya" },
              { label: "Office", value: "Iten Municipality Office, Iten" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden="true" />
                <div>
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{item.label}</p>
                  <p className="mt-1 text-[12.5px] font-semibold leading-snug text-green-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
