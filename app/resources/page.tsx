import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { DocumentLibrary } from "@/components/DocumentLibrary";

export const metadata: Metadata = {
  title: "Municipal Document Centre",
  description:
    "Access official municipal publications, plans, policies and reports for Iten-Tambach Municipality, linked to the County Government of Elgeyo Marakwet's official document repository.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        title="Municipal Document Centre"
        intro="Access official municipal publications, plans, policies, reports and public information through our document centre. We are committed to making relevant public information accessible to residents and stakeholders."
        image="/images/kerio-forest-road.jpg"
        imageAlt="Road through forested highland landscape in Elgeyo Marakwet County"
        eyebrow="Public Information"
        crumbs={[{ label: "Resources" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="shell">
          <div className="shell">
            <p className="text-[13px] leading-relaxed text-ink-soft">
              Browse municipal plans, policies, financial reports and public participation records.
            </p>
          </div>
      </section>

      <section className="bg-paper-warm py-12 md:py-16">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">Library</p>
                <h2 className="mt-2 font-display text-[1.5rem] font-bold leading-tight text-green-900 md:text-[1.75rem]">
                  Search the municipal library
                </h2>
                <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-muted">
                  Filter by category, publication year or keyword. Categories follow the municipal publishing structure,
                  from the charter and integrated development plans through to participation reports and grievance
                  redress records.
                </p>
              </div>
              <Link href="/contact" className="btn btn-outline !py-2.5 !text-[11.5px]">
                Request a document
              </Link>
            </div>
          </Reveal>
          <div className="mt-8">
            <Suspense fallback={<p className="text-[12.5px] text-ink-muted">Loading the library…</p>}>
              <DocumentLibrary />
            </Suspense>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
