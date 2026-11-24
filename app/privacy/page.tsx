import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy (Draft)",
  description:
    "Draft privacy notice for the Iten-Tambach Municipality website, including information submitted through operational forms and the matters still requiring approval.",
  alternates: { canonical: "/privacy" },
};

/**
 * DRAFT POLICY — NOT LEGALLY APPROVED.
 *
 * The supplied build presented policy text as settled. It was not: no legal or institutional review
 * is on record for it. This version is structured as a professional draft, separates what the site
 * receives through operational forms and from demonstration forms, and marks the clauses that need
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
    title: "Information submitted through this website",
    approved: true,
    body: [
      "The citizen feedback and general enquiry forms submit information to the municipal system. Depending on the form, this may include your name, email address, telephone number, subject, message, location or ward, and your consent to the information being used to handle the submission. A successfully recorded submission receives a reference number. The system also records technical information needed to protect and audit submissions, including a hashed network address and browser user-agent information.",
      "The investment enquiry form is currently a browser-based demonstration: it validates the information and displays a preview, but does not transmit the enquiry. Do not use that form to send confidential or time-sensitive information.",
      "The website does not require a public user account. The operational forms create a municipal submission record when a message is successfully accepted.",
    ],
  },
  {
    title: "How submitted information is used",
    approved: false,
    body: [
      "Information submitted through an operational form is used to record the matter, route it to the appropriate municipal office and, where configured, send an acknowledgement. The reference number should be retained for follow-up.",
      "The information is collected for the purpose of handling the enquiry, feedback or complaint. It is not requested for marketing or profiling.",
      "The Municipality must approve and publish the applicable legal basis, retention period, authorised access arrangements, hosting and storage details, and the procedure for access, correction or deletion requests. Those particulars have not been confirmed in the materials available for this draft.",
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
      "Submissions made through operational forms are recorded in the municipal system. The approved process and contact person for requests to access, correct or delete a submission must be confirmed by the Municipality before this notice is adopted.",
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
        intro="A draft notice explaining how information submitted through the website is handled and identifying the privacy details that still require formal approval."
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
            Privacy enquiries: write to {site.contact.postal} or visit {site.contact.office},{" "}
            {site.contact.physical}. Contact details are pending written confirmation — see the{" "}
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

