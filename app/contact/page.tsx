import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Mailbox, ExternalLink, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { PublicSubmissionForm } from "@/components/forms/PublicSubmissionForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Iten-Tambach Municipality",
  description:
    "Contact Iten Municipality Office: opposite County Assembly, behind IEBC offices, Iten, Kenya. Postal address: P.O. Box 220-30700, Iten.",
  alternates: { canonical: "/contact" },
};

/**
 * Contact details on this page have not yet been confirmed in writing by the Municipality.
 * The note is rendered rather than removed: the layout and the channels stay usable, but the page
 * does not present unconfirmed strings as settled institutional fact.
 */
function ContactPendingNote() {
  if (site.contactVerification === "confirmed") return null;
  return (
    <>
      <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.08em] text-green-900">
        Contact details pending verification
      </h2>
      <p className="mt-1.5 text-[12px] leading-[1.8] text-ink-soft">
        The office location, telephone number, email address and postal address below are carried over from the
        previous version of this site. They have not been confirmed in writing by the Municipality for publication.
        Please treat them as indicative until they are confirmed, and see the approval checklist for the items the
        Municipality needs to sign off.
      </p>
    </>
  );
}

const cards = [
  {
    icon: MapPin,
    label: "Office",
    value: site.contact.office,
    detail: site.contact.physical,
  },
  {
    icon: Mailbox,
    label: "Postal address",
    value: site.contact.postal,
    detail: "Correspondence and deliveries",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Iten-Tambach Municipality"
        intro="We welcome enquiries, suggestions and constructive engagement from residents, businesses, visitors and development partners. Contact our municipal office for information and assistance."
        image="/images/town-centre.jpg"
        imageAlt="Iten town centre in Elgeyo Marakwet County"
        eyebrow="Get in Touch"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="bg-white py-14 md:py-18">
        <div className="shell">
          <div className="grid gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="flex h-full flex-col bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center bg-green-50 text-green-700">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-[9.5px] font-semibold uppercase tracking-[0.15em] text-ink-muted">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="mt-1 break-words font-display text-[13.5px] font-bold leading-snug text-green-900 hover:text-gold-700">
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-1 break-words font-display text-[13.5px] font-bold leading-snug text-green-900">{c.value}</p>
                )}
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-muted">{c.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-l-[3px] border-gold-400 bg-gold-50 p-4">
            <ContactPendingNote />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  eyebrow="Location"
                  title="Finding the municipal office"
                  description="The office is situated in Iten town, opposite the County Assembly and behind the IEBC offices."
                />
              </Reveal>

              <div className="mt-6 border border-paper-line bg-paper-warm p-5">
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-green-900/[0.04]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.16]"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #083A26 1px, transparent 1px), linear-gradient(to bottom, #083A26 1px, transparent 1px)",
                      backgroundSize: "34px 34px",
                    }}
                  />
                  <div className="relative text-center">
                    <MapPin className="mx-auto h-7 w-7 text-flag-red" aria-hidden="true" />
                    <p className="mt-2 font-display text-[12.5px] font-bold uppercase tracking-[0.08em] text-green-900">
                      Iten Municipality Office
                    </p>
                    <p className="mt-1 text-[11.5px] text-ink-muted">Iten, Elgeyo Marakwet County, Kenya</p>
                  </div>
                </div>
                <p className="mt-4 text-[12px] leading-[1.8] text-ink-soft">
                  A map is not embedded on this demonstration site, and exact coordinates are not published. For
                  directions, call the office on{" "}
                  <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="font-semibold text-green-800 underline decoration-gold-400 decoration-2 underline-offset-2">
                    {site.contact.postal}
                  </a>{" "}
                  or use the county&rsquo;s official location information.
                </p>
                <a
                  href={site.countyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700"
                >
                  County Government website <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              <div className="mt-5 border-l-[3px] border-gold-400 bg-white p-4 shadow-card">
                <h3 className="font-display text-[12px] font-bold uppercase tracking-[0.08em] text-green-900">
                  Office operating hours
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                  Operating hours are not published here because they have not been officially confirmed. Please call
                  ahead before visiting the office.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <PublicSubmissionForm
                type="ENQUIRY"
                heading="Send an enquiry"
                intro="Use this form for a general question about municipal services, offices or procedures. Your message is recorded with a reference number and routed to the relevant office."
                subjects={[
                  "General enquiry",
                  "Municipal services",
                  "Business licence",
                  "Documents and records",
                  "Office location and hours",
                  "Other",
                ]}
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/feedback" className="btn btn-outline !py-3 !text-[12px]">
                  Complaints and feedback <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/public-participation" className="btn btn-outline !py-3 !text-[12px]">
                  Public participation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
