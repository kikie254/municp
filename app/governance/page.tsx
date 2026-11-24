import type { Metadata } from "next";
import Link from "next/link";
import {
  Users, UserCog, Building2, Scale, ShieldCheck, FileText, ArrowRight, Landmark,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Municipal Governance and Leadership",
  description:
    "The governance framework of Iten-Tambach Municipality: the Municipal Board, Chairperson, Municipal Manager and administration under the Iten Tambach Municipal Charter.",
  alternates: { canonical: "/governance" },
};

export default function GovernancePage() {
  return (
    <>
      <PageHero
        title="Municipal Governance and Leadership"
        intro="The Urban Areas and Cities Act, 2011 (as amended), provides the national framework for municipal governance. The Municipal Board provides governance and oversight, while the Municipal Manager is responsible for day-to-day administration within the County Government framework. The Municipality’s operative charter and current appointments require institutional confirmation."
        image="/images/community-forum.jpg"
        imageAlt="Community members and officials gathered for a governance meeting"
        eyebrow="Institutional Structure"
        crumbs={[{ label: "Governance" }]}
      />

      <section className="border-y border-gold-300 bg-gold-50 py-4">
        <div className="shell max-w-4xl">
          <p className="text-[12px] leading-relaxed text-green-950">
            <strong>Verification note:</strong> The County-hosted charter PDF currently listed for Iten-Tambach is labelled “Model Municipal Charter prepared under the World Bank Kenya Urban Support Programme” and contains blank grant-date and signature fields. This website does not treat that draft as proof of the adopted charter or current Board composition. The Municipality must confirm the operative charter and appointment records before this page is relied on as an authoritative institutional statement.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-4">
              <SectionHeading
                eyebrow="Governance Framework"
                title="Structures that carry public accountability"
                description="The municipality's governance arrangements follow the framework set out in the Urban Areas and Cities Act, 2011, as amended, and in the Iten Tambach Municipal Charter."
              />
            </Reveal>

          </div>

          {/* Board composition */}
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <Reveal>
              <article className="h-full border-t-[3px] border-green-800 bg-paper-warm p-6">
                <span className="flex h-11 w-11 items-center justify-center bg-green-800 text-gold-400">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-[16px] font-bold uppercase tracking-[0.04em] text-green-900">
                  Municipal Board
                </h2>
                <p className="mt-3 text-[13px] leading-[1.85] text-ink-soft">
                  The Municipal Board provides strategic direction, governance and oversight for the Municipality. It supports accountable decision-making and ensures that municipal affairs are managed in the public interest.
                </p>
                <p className="mt-3 text-[13px] leading-[1.85] text-ink-soft">
                  The Board works with municipal administration and community stakeholders to promote responsive
                  services, responsible planning and accountability to residents.
                </p>
              </article>
            </Reveal>

            <div className="grid gap-5">
              <Reveal delay={60}>
                <article className="border-t-[3px] border-gold-400 bg-white p-6 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center bg-gold-50 text-gold-700">
                    <Landmark className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-display text-[16px] font-bold uppercase tracking-[0.04em] text-green-900">
                    Board Chairperson
                  </h2>
                  <p className="mt-3 text-[13px] leading-[1.85] text-ink-soft">
                    The Chairperson leads the Board's meetings and carries out the responsibilities assigned by the Charter and applicable law. The Vice-Chairperson supports the Chairperson in accordance with the same framework.
                  </p>
                </article>
              </Reveal>
              <Reveal delay={120}>
                <article className="border-t-[3px] border-green-800 bg-white p-6 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center bg-green-50 text-green-700">
                    <UserCog className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-display text-[16px] font-bold uppercase tracking-[0.04em] text-green-900">
                    Municipal Manager
                  </h2>
                  <p className="mt-3 text-[13px] leading-[1.85] text-ink-soft">
                    The Municipal Manager is responsible for the day-to-day administration of municipal affairs, implementation of Board decisions and management of municipal resources in accordance with the law.
                  </p>
                </article>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Administration & accountability */}
      <section className="bg-paper-warm py-16 md:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Administration"
              title="Municipal Administration and Accountability"
              description="Municipal administration translates decisions into day-to-day service. Accountability depends on clear responsibilities, published information and open channels for residents."
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Municipal Administration",
                body:
                  "Administrative functions are carried out by municipal staff under the Municipal Manager, in coordination with county departments and relevant national agencies.",
              },
              {
                icon: Scale,
                title: "Governance and Accountability",
                body:
                  "Decision-making must follow applicable law and the operative municipal instruments. Public minutes, financial statements and participation reports support scrutiny where they have been formally issued.",
              },
              {
                icon: ShieldCheck,
                title: "Grievance Redress",
                body:
                  "The County Government document repository includes grievance redress materials. The current municipal complaint-handling arrangements and responsible offices require institutional confirmation.",
              },
              {
                icon: FileText,
                title: "Public Participation",
                body:
                  "The Urban Areas and Cities Act provides for Citizen Fora. Residents should rely on current notices and reports issued through authorised County or municipal channels for dates and arrangements.",
              },
              {
                icon: Users,
                title: "Inclusive Representation",
                body:
                  "The published gender engagement and inclusion frameworks describe the municipality's approach to inclusive participation.",
              },
              {
                icon: Landmark,
                title: "Relationship with the County",
                body:
                  "The municipality operates within the County Government of Elgeyo Marakwet, which remains the parent county government.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <div className="h-full border border-paper-line bg-white p-5 shadow-card">
                  <item.icon className="h-5 w-5 text-green-600" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-[13.5px] font-bold leading-snug text-green-900">{item.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-[1.8] text-ink-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/resources?category=Other+Official+Publications" className="btn btn-primary !py-3 !text-[12px]">
              Board Minutes Highlights <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/resources?category=Grievance+Redress+Documents" className="btn btn-outline !py-3 !text-[12px]">
              Grievance Redress Documents
            </Link>
            <Link href="/resources?category=Public+Participation+Reports" className="btn btn-outline !py-3 !text-[12px]">
              Participation Reports
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
