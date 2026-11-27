import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Mailbox, Phone, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { PublicSubmissionForm } from "@/components/forms/PublicSubmissionForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Iten-Tambach Municipality",
  description:
    "Contact Iten-Tambach Municipality by telephone, email or post, and find the municipal office in Iten.",
  alternates: { canonical: "/contact" },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contact.mapQuery)}`;
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.contact.mapQuery)}&output=embed`;

const cards = [
  {
    icon: MapPin,
    label: "Office",
    value: site.contact.office,
    detail: site.contact.physical,
  },
  {
    icon: Phone,
    label: "Telephone",
    value: site.contact.phoneDisplay,
    detail: "Call the municipal office",
    href: `tel:${site.contact.phone}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: site.contact.email,
    detail: "Send an email enquiry",
    href: `mailto:${site.contact.email}`,
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
        intro="Residents, businesses and other stakeholders may contact the municipal office by telephone, email or post, or send an enquiry using the form below."
        image="/images/town-centre.jpg"
        imageAlt="Iten town centre in Elgeyo Marakwet County"
        eyebrow="Get in Touch"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="bg-white py-14 md:py-18">
        <div className="shell">
          <div className="grid gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="flex h-full flex-col bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center bg-green-50 text-green-700">
                  <card.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-[9.5px] font-semibold uppercase tracking-[0.15em] text-ink-muted">{card.label}</p>
                {card.href ? (
                  <a href={card.href} className="mt-1 break-words font-display text-[13.5px] font-bold leading-snug text-green-900 underline decoration-green-300 underline-offset-4 hover:text-gold-700">
                    {card.value}
                  </a>
                ) : (
                  <p className="mt-1 break-words font-display text-[13.5px] font-bold leading-snug text-green-900">{card.value}</p>
                )}
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-muted">{card.detail}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
            Telephone and email details are published on the County Government's official Office of the Municipal Manager page.{" "}
            <a href={site.contact.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-800 underline underline-offset-2">
              Check the County source <ExternalLink className="inline h-3 w-3" aria-hidden="true" />
            </a>
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  eyebrow="Location"
                  title="Finding the municipal office"
                  description="The office is opposite the County Assembly, behind the IEBC offices, along the Kapkessum Road area of Iten."
                />
              </Reveal>

              <div className="mt-6 overflow-hidden border border-paper-line bg-paper-warm">
                <div className="aspect-[4/3] w-full bg-stone-100">
                  <iframe
                    title="Map showing Iten Municipality Office, Iten, Kenya"
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full min-h-[280px] w-full border-0"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <p className="text-[12px] leading-[1.8] text-ink-soft">
                    Use the map to plan your visit. If travelling from outside Iten, call ahead to confirm the correct office and availability of the service you need.
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700"
                  >
                    Open directions in Google Maps <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="mt-5 border-l-[3px] border-gold-400 bg-white p-4 shadow-card">
                <h3 className="font-display text-[12px] font-bold uppercase tracking-[0.08em] text-green-900">
                  Office operating hours
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                  Operating hours are not stated on the municipal contact source. Please call the office before visiting.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <PublicSubmissionForm
                type="ENQUIRY"
                heading="Send an enquiry"
                intro="Use this form for a general question about municipal services, documents or procedures. A successful submission is recorded in the municipal system and receives a reference number."
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
