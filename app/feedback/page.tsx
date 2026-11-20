import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PublicSubmissionForm } from "@/components/forms/PublicSubmissionForm";
import { faqs } from "@/lib/data/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Citizen Feedback and Complaints",
  description:
    "Feedback channels for Iten-Tambach Municipality: complaint categories, grievance redress information, frequently asked questions and a feedback form that records your message in the municipal case system.",
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
  { title: "Raise the matter", text: "Set out what happened, where, and when — by telephone, email or in writing at the municipal office. The published Grievance Redress Mechanism structure sets out how matters are logged and routed." },
  { title: "Receive a reference", text: "A matter that is received through official channels is logged so that it can be followed up. This website does not issue references; ask the office for one when you call or write." },
  { title: "Follow up", text: "Quote the reference when following up. If the matter concerns another county department or a national agency, the municipality can indicate the correct office." },
];

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        title="Citizen Feedback and Complaints"
        intro="Your voice matters. We value feedback from residents and stakeholders because it helps identify concerns, improve communication and strengthen accountability. Use this section to explore the municipality's feedback channels and understand how to raise issues through the appropriate official processes."
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
                description="Choosing the right category helps route a concern to the responsible officer."
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

            <div className="mt-8 border-t-[3px] border-green-800 bg-green-950 p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-400">Direct contact</p>
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="mt-3 flex items-center gap-2.5 text-[13.5px] font-semibold hover:text-gold-300">
                <Phone className="h-4 w-4 text-gold-400" aria-hidden="true" /> {site.contact.phoneDisplay}
              </a>
              <a href={`mailto:${site.contact.email}`} className="mt-2 flex items-center gap-2.5 break-all text-[12.5px] text-white/80 hover:text-gold-300">
                <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" /> {site.contact.email}
              </a>
              <p className="mt-3 flex items-start gap-2.5 text-[12px] leading-relaxed text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" /> {site.contact.physical}
              </p>
            </div>

            <div className="mt-5 flex gap-3 border border-paper-line bg-paper-warm p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
              <p className="text-[11.5px] leading-relaxed text-ink-soft">
                The municipality&rsquo;s published Grievance Redress Mechanism structure and its process flow chart are
                available in the document centre.
              </p>
            </div>
            <Link href="/resources?category=Grievance+Redress+Documents" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">
              Grievance redress documents <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <PublicSubmissionForm
              type="FEEDBACK"
              heading="Send feedback or a complaint"
              intro="Tell us what is working or what needs attention. Complaints are logged with a reference number and can be followed up with that number."
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
