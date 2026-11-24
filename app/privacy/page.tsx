import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Information",
  description: "Information about data submitted through the Iten-Tambach Municipality website.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "Information submitted through this website",
    body: [
      "The citizen feedback and general enquiry forms submit information to the municipal system. Depending on the form, this may include your name, email address, telephone number, subject, message, location or ward, and your consent to the information being used to handle the submission.",
      "A successfully recorded submission receives a reference number. The system also records technical information used to protect and audit submissions, including a hashed network address and browser user-agent information.",
    ],
  },
  {
    title: "How information is used",
    body: [
      "Information submitted through an operational form is used to record the matter and support its handling by the relevant municipal office. Submissions are not published on the website.",
    ],
  },
  {
    title: "External links",
    body: [
      "Links to resources hosted by other organisations take you to external websites. The privacy practices of those websites apply when you visit them.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Information"
        intro="Information about details submitted through the website and how those submissions are handled."
        image="/images/kerio-escarpment.jpg"
        imageAlt="The Elgeyo escarpment seen across the Kerio Valley"
        eyebrow="Information"
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
            For a privacy-related enquiry, use the <Link href="/contact" className="font-semibold text-green-800 underline decoration-gold-400 decoration-2 underline-offset-2">contact page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
