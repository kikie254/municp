import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Demonstration Data Notice",
  description: "Provisional information about data handling in the Iten-Tambach Municipality demonstration website.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "Important — do not submit real personal information",
    body: [
      "This is a demonstration website. It has not been approved as an official municipal publication or submission channel. Do not enter real personal, financial, identity, health or other sensitive information into its forms.",
      "The presence of a form does not mean the Municipality has authorised this website to receive or process public submissions.",
    ],
  },
  {
    title: "What the application is designed to record",
    body: [
      "If a demonstration form is submitted successfully and the relevant backend is configured, the application code records the information entered into that form. Depending on the form, this may include a name, email address, telephone number, subject, message, ward or location, organisation, response and consent selection.",
      "The submission workflow also records a hashed network address and a limited browser user-agent value for security and audit purposes. A reference number is generated for a successfully recorded submission.",
    ],
  },
  {
    title: "Services used by the application",
    body: [
      "The source code is designed to use Firebase/Google Cloud services for database and file storage. It can send email through a configured Resend API integration. Whether these services are configured and active on a particular deployment has not been independently verified.",
      "Do not assume that a form submission has reached an authorised municipal office. Do not use the demonstration reference as an official complaint, application or consultation reference.",
    ],
  },
  {
    title: "Approval still required",
    body: [
      "This page is a provisional technical data notice, not a formally approved municipal privacy policy or a legal compliance certification. The Municipality must designate the responsible data controller and privacy contact, approve the purposes and lawful bases for processing, confirm processor arrangements and any cross-border transfers, set retention and deletion periods, and approve the process for exercising data-subject rights and raising complaints.",
      "A Kenyan privacy/legal review is required before the site or its forms are authorised for real public use.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Demonstration Data Notice"
        intro="Provisional information about data handling in this demonstration website. It is not an approved municipal privacy policy."
        image="/images/kerio-escarpment.jpg"
        imageAlt="Highland escarpment landscape"
        eyebrow="Demonstration Notice"
        crumbs={[{ label: "Privacy Information" }]}
      />
      <section className="bg-white py-14">
        <div className="shell max-w-3xl">
          {sections.map((section) => (
            <section key={section.title} className="border-b border-paper-line py-6 first:pt-0 last:border-0">
              <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.05em] text-green-900">
                {section.title}
              </h2>
              <div className="prose-gov mt-3 space-y-3">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
          <p className="mt-6 text-[12px] leading-relaxed text-ink-muted">
            For institutional privacy approval, the Municipality must publish a verified privacy contact and an authorised notice. See the <Link href="/terms" className="font-semibold text-green-800 underline decoration-gold-400 decoration-2 underline-offset-2">website status</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
