import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy (Draft)",
  description:
    "Draft privacy notice for the Iten-Tambach Municipality website: what the site currently collects, what operational forms would collect, and how enquiries are handled.",
  alternates: { canonical: "/privacy" },
};

/**
 * DRAFT POLICY — NOT LEGALLY APPROVED.
 *
 * The supplied build presented policy text as settled. It was not: no legal or institutional review
 * is on record for it. This version is structured as a professional draft, separates what the site
 * collects TODAY from what a form would collect ONCE OPERATIONAL, and marks the clauses that need
 * formal approval. It makes no compliance claim and cites no approval that does not exist.
 */
const sections = [
  {
    title: "Status of this notice",
    approved: false,
    body: [
      "This is a draft privacy notice. It has not been reviewed or approved by the Municipality, by the County Government of Elgeyo Marakwet, or by a legal officer. It is published so that the intended handling of information is visible while the site is being prepared, and it will be replaced by an approved notice before launch.",
      "Nothing here should be read as a statement that the website, the Municipality or the County has been certified against, registered under, or audited for compliance with any data protection framework.",
    ],
  },
  {
    title: "Information that is NOT collected today",
    approved: true,
    body: [
      "The forms on this website — citizen feedback, public participation, investment enquiry and contact enquiry — validate entries in your browser and display a preview for you to check. They do not transmit anything to a server. No submission is stored, forwarded, logged or registered by the Municipality, and no reference number is issued.",
      "File attachments are never uploaded. A file you select remains on your device and is not read by this website.",
      "There are no user accounts, no login, and no municipal record is created by using the site.",
    ],
  },
  {
    title: "Information that WILL be collected once forms are operational",
    approved: false,
    body: [
      "When submission is enabled, the forms are intended to collect: your name, email address, telephone number where you choose to give it, the area or ward a matter concerns, the category and subject of your entry, and the description you write. The feedback form may also accept an attachment.",
      "That information would be used to respond to your enquiry and to route a concern to the responsible officer. It is not intended for marketing, profiling or sale.",
      "Before any form is switched on, the Municipality must publish: the legal basis for processing, how long entries are retained, who can access them, how they are stored, and how a person can ask for their entry to be corrected or deleted. Those details are not yet approved and are therefore not stated here.",
    ],
  },
  {
    title: "Technical information and hosting",
    approved: false,
    body: [
      "This website uses no advertising cookies, no tracking pixels and no third-party analytics scripts.",
      "The hosting provider that serves the site will process ordinary technical request data — such as an IP address, the page requested and a timestamp — in order to deliver the page and protect the service. The provider's own terms govern that processing. The Municipality should confirm with its chosen hosting provider what is logged and for how long, and record that here before launch.",
      "Where a hosting-level log retention period has been confirmed, it should be stated in this section. It has not been confirmed.",
    ],
  },
  {
    title: "Your choices and how to raise a privacy concern",
    approved: false,
    body: [
      "Because this website does not retain submissions, there is no stored personal data held here for you to access, correct or delete. Where a matter has been raised with the municipal office directly — by telephone, email or in person — that record is handled by the office, not by this website.",
      "A privacy enquiry, or a request to access or correct a record held by the office, should be directed to the municipal office using the contact details on the contact page. Those details are themselves pending confirmation (see the contact page).",
      "The Municipality should confirm, before launch, which officer receives privacy enquiries and what internal procedure applies. That designation has not been confirmed.",
    ],
  },
  {
    title: "Documents and external links",
    approved: true,
    body: [
      "Document links and the county website link open resources published by the County Government of Elgeyo Marakwet. Once you follow an external link, the privacy practices of that site apply.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        intro="A draft notice describing what this website collects today, what an operational form would collect, and what still requires formal approval."
        image="/images/kerio-escarpment.jpg"
        imageAlt="The Elgeyo escarpment seen across the Kerio Valley"
        eyebrow="Legal"
        crumbs={[{ label: "Privacy Policy" }]}
      />
      <section className="bg-white py-14">
        <div className="shell max-w-3xl">
          <div className="border-l-[3px] border-gold-400 bg-gold-50 p-4">
            <p className="text-[12px] leading-relaxed text-green-900">
              <strong className="font-semibold uppercase tracking-[0.07em]">Draft — pending approval. </strong>
              This notice is not legally approved and makes no compliance claim. Clauses marked{" "}
              <span className="font-semibold">Requires approval</span> still need formal sign-off by the Municipality.
            </p>
          </div>

          {sections.map((s) => (
            <div key={s.title} className="border-b border-paper-line py-6 first:pt-6 last:border-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.05em] text-green-900">
                  {s.title}
                </h2>
                <span
                  className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                    s.approved
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-gold-300 bg-gold-50 text-gold-800"
                  }`}
                >
                  {s.approved ? "Describes current behaviour" : "Pending approval"}
                </span>
              </div>
              <div className="prose-gov mt-3 space-y-3">
                {s.body.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}
              </div>
            </div>
          ))}

          <p className="mt-6 text-[12px] leading-relaxed text-ink-muted">
            Privacy enquiries: {site.contact.phoneDisplay} · {site.contact.email} · {site.contact.office},{" "}
            {site.contact.physical}. These contact details are pending written confirmation — see the{" "}
            <Link href="/contact" className="font-semibold text-green-800 underline decoration-gold-400 decoration-2 underline-offset-2">
              contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
