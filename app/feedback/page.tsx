import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PublicSubmissionForm } from "@/components/forms/PublicSubmissionForm";
import { faqs } from "@/lib/data/services";
import { publicIntakeEnabled } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Citizen Feedback and Complaints",
  description:
    "Demonstration information about feedback and complaints. This website is not an authorised official municipal submission channel.",
  alternates: { canonical: "/feedback" },
};

const categories = [
  "Environmental cleanliness",
  "Waste management",
  "Public spaces",
  "Urban planning enquiries",
  "Infrastructure concerns",
  "Public participation",
  "General enquiries",
  "Other",
];

const grievanceSteps = [
  { title: "Raise the matter", text: "Record what happened, where and when for your own reference. This demonstration website is not an authorised complaints channel; consult the relevant published grievance documents and official notices." },
  { title: "Receive a reference", text: "The demonstration website does not issue an official complaint reference. Do not rely on a test reference as proof that a municipal office received or registered a complaint." },
  { title: "Follow up", text: "Use contact details published by the institution legally responsible for the matter. Verified municipal contact details have not yet been supplied for this website." },
];

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        title="Citizen Feedback and Complaints"
        intro="This page demonstrates how feedback and complaint information could be presented. The website has not been authorised as an official municipal channel; do not submit real personal or sensitive information."
        image="/images/town-life.jpg"
        imageAlt="Residents and traders on a street in a Kenyan highland town"
        eyebrow="Feedback Channels"
        crumbs={[{ label: "Complaints and Feedback" }]}
      />

      <section className="bg-white py-14 md:py-18">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Categories"
                title="What is your matter about?"
                description="Choose the category that best describes your concern. Include the location and relevant details so the matter can be directed to the appropriate office."
              />
            </Reveal>
            <ul className="mt-6 divide-y divide-paper-line border-y border-paper-line">
              {categories.map((c, i) => (
                <li key={c} className="flex items-center gap-3 py-2.5">
                  <span className="w-6 shrink-0 font-display text-[10.5px] font-extrabold tracking-[0.08em] text-gold-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[12.5px] text-green-900">{c}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t-[3px] border-gold-400 bg-green-950 p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-400">Contact details pending confirmation</p>
              <p className="mt-3 text-[12px] leading-relaxed text-white/80">
                Municipal telephone, email, physical and postal contact details are not displayed until formally confirmed.
              </p>
              <a href="https://elgeyomarakwet.go.ke/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold-300 hover:text-gold-200">
                County Government website <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-5 flex gap-3 border border-paper-line bg-paper-warm p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
              <p className="text-[11.5px] leading-relaxed text-ink-soft">
                The County Government document repository lists grievance redress materials. Their current status and applicability should be confirmed with the responsible institution.
              </p>
            </div>
            <Link href="/resources?category=Grievance+Redress+Documents" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">
              Grievance redress documents <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <PublicSubmissionForm
              type="FEEDBACK"
              enabled={publicIntakeEnabled()}
              heading="Demonstration feedback form"
              intro="Demonstration only. Do not submit real personal or sensitive information while this website remains unauthorised for official municipal use."
              subjects={[
                "Complaint about a municipal service",
                "Complaint about staff conduct",
                "Feedback on a project",
                "Suggestion for the Municipality",
                "Report of a service failure",
                "Other",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-paper-line bg-paper-warm py-14">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Grievance Redress"
                title="How a matter is handled"
                description="Grievance redress is the formal process through which a concern is recorded, routed and answered."
              />
            </Reveal>
            <ol className="mt-6 space-y-4">
              {grievanceSteps.map((s, i) => (
                <li key={s.title} className="flex gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-green-800 font-display text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-[13px] font-bold text-green-900">{s.title}</h3>
                    <p className="mt-1 text-[12px] leading-[1.8] text-ink-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
            </Reveal>
            <div className="mt-6">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
