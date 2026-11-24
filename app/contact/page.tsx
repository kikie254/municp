import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { PublicSubmissionForm } from "@/components/forms/PublicSubmissionForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Iten-Tambach Municipality",
  description: "Contact information and enquiry options for the Iten-Tambach Municipality demonstration website.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Iten-Tambach Municipality"
        intro="This page is part of a demonstration website prepared for institutional review. Municipal contact details have not yet been confirmed for publication."
        image="/images/town-centre.jpg"
        imageAlt="Town centre in a Kenyan highland setting"
        eyebrow="Contact Information"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="bg-white py-14 md:py-18">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <aside className="lg:col-span-5">
            <div className="border-l-[3px] border-gold-400 bg-paper-warm p-5">
              <h2 className="font-display text-[14px] font-bold uppercase tracking-[0.06em] text-green-900">
                Municipal contact details
              </h2>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft">
                The physical office address, postal address, telephone number, email address and operating hours are
                withheld here until the Municipality confirms them in writing. No contact detail has been invented.
              </p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft">
                For general County Government information, use the County Government's published website. This is not
                represented as a municipal complaint or enquiry address.
              </p>
              <a
                href={site.countyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700"
              >
                County Government website <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </aside>

          <div className="lg:col-span-7">
            <PublicSubmissionForm
              type="ENQUIRY"
              enabled={process.env.PUBLIC_SUBMISSIONS_ENABLED === "true"}
              heading="Demonstration enquiry form"
              intro="This form demonstrates the submission workflow. Do not submit real personal, financial or sensitive information while this website remains unauthorised for official municipal use."
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
      </section>

      <CtaBand />
    </>
  );
}
