import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use (Draft)",
  description:
    "Draft terms for the Iten-Tambach Municipality website, including the status of this site, of sample content, and of unverified information.",
  alternates: { canonical: "/terms" },
};

/**
 * DRAFT TERMS — NOT LEGALLY APPROVED.
 * The previous revision described the site as approved for presentation to municipal leadership and
 * made accuracy claims about institutional text that the audit did not support. Those claims are
 * removed. No legal review exists on the record, and none is asserted here.
 */
const terms = [
  {
    title: "Status of this website",
    body:
      "This website is being prepared for Iten-Tambach Municipality and is not yet an approved official publication of the Municipality or the County Government of Elgeyo Marakwet. Certain enquiry and feedback forms can record submissions in the website's municipal system and issue a reference number. A submission through this website does not replace any statutory application, permit process or formal procedure prescribed by law.",
  },
  {
    title: "This is a draft notice",
    body:
      "These terms are a professional draft provided so that the intended conditions of use are visible. They have not been legally reviewed or adopted. They will be replaced by approved terms before public launch.",
  },
  {
    title: "Demonstration and template content",
    body:
      "Some project records, news articles and forum listings are retained as labelled templates. They are not official government records and must not be relied upon as evidence of municipal activity, expenditure, appointments, dates or delivery. Only notices and records issued through the Municipality's authorised publication process should be treated as official communications.",
  },
  {
    title: "Verified and unverified information",
    body:
      "Institutional text on this site is written against documents published by the County Government. Where a fact could not be confirmed — contact details, office hours, office holders, project data, the status of a published document — it is either omitted or shown with an explicit pending-verification label. The site does not substitute an invented value for information it does not have.",
  },
  {
    title: "Documents",
    body:
      "Municipal documents are not mirrored on this site. Each record links to the file or page published by the County Government, and is labelled according to how far the file behind the link was checked. A working link shows that a file resolves; it is not a statement that the document is the instrument adopted by the Municipality. The authoritative version is the one held by the County.",
  },
  {
    title: "Use of the site",
    body:
      "You may read, quote and share the information published here for lawful purposes, with attribution to Iten-Tambach Municipality, County Government of Elgeyo Marakwet. You may not present labelled sample content as an official record, or use the site to misrepresent the Municipality.",
  },
  {
    title: "Intellectual property and photography",
    body:
      "The County Government of Elgeyo Marakwet crest and the name Iten-Tambach Municipality identify the institution and remain the property of the County Government. The photographs currently used on this site have not had their rights cleared; they are documented in ASSET_CREDITS.md as requiring verification or replacement before launch. No licence is asserted for them here.",
  },
  {
    title: "External links",
    body:
      "Links to the County Government website and to published documents are provided for convenience. The Municipality does not control those resources and is not responsible for their availability or content.",
  },
  {
    title: "Limitation and contact",
    approved: false,
    body: `This draft is provided as-is while the site is being prepared. Questions about it may be directed to ${site.contact.office}, ${site.contact.physical}, or write to ${site.contact.postal}. Those contact details are pending written confirmation by the Municipality.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Use"
        intro="Draft terms governing use of this website, the status of the information on it, and the standing of sample content."
        image="/images/kerio-forest-road.jpg"
        imageAlt="Forest road in the Elgeyo Marakwet highlands"
        eyebrow="Legal"
        crumbs={[{ label: "Terms of Use" }]}
      />
      <section className="bg-white py-14">
        <div className="shell max-w-3xl">
          <div className="mb-6 border-l-[3px] border-gold-400 bg-gold-50 p-4">
            <p className="text-[12px] leading-relaxed text-green-900">
              <strong className="font-semibold uppercase tracking-[0.08em]">Draft — pending approval — </strong>
              these terms have not been reviewed or adopted. They carry no legal approval and make no compliance claim.
            </p>
          </div>
          {terms.map((t, i) => (
            <div key={t.title} className="border-b border-paper-line py-5 first:pt-0 last:border-0">
              <h2 className="flex gap-3 font-display text-[14px] font-bold text-green-900">
                <span className="text-gold-600">{String(i + 1).padStart(2, "0")}</span> {t.title}
              </h2>
              <p className="mt-2 pl-8 text-[12.5px] leading-[1.85] text-ink-soft">{t.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

