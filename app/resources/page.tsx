import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, ShieldCheck, Info } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { DocumentLibrary } from "@/components/DocumentLibrary";
import { documents } from "@/lib/data/documents";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Municipal Document Centre",
  description:
    "Access official municipal publications, plans, policies and reports for Iten-Tambach Municipality, linked to the County Government of Elgeyo Marakwet's official document repository.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const contentChecked = documents.filter((d) => d.verification === "content-confirmed").length;
  const fileOnly = documents.filter((d) => d.verification === "file-only").length;

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
          <div className="grid gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Documents indexed", value: String(documents.length) },
              { label: "Content-checked files", value: String(contentChecked) },
              { label: "File checks only", value: String(fileOnly) },
              { label: "Source", value: "County repository" },
            ].map((s) => (
              <div key={s.label} className="bg-white px-5 py-4">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{s.label}</p>
                <p className="mt-1 font-display text-[15px] font-bold text-green-900">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3.5 border-l-[3px] border-green-700 bg-paper-warm p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
            <div>
              <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.07em] text-green-900">
                About these document links
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-[1.8] text-ink-soft">
                Titles, publication dates and file sizes on this page are taken from the County Government of Elgeyo
                Marakwet&rsquo;s published Iten Municipality documents listing. Files are <strong>not mirrored</strong> on this
                website; each link opens or downloads the file from the County&rsquo;s own repository. Where a file could not
                be confirmed as available, the record links to the official documents page instead of an unverified
                file, so that no broken or fabricated download is presented.
              </p>
              <p className="mt-2 text-[12.5px] leading-[1.8] text-ink-soft">
                Every link in this library was requested and every file opened during preparation. A working link
                proves the file resolves — it does not prove that the document is the instrument adopted by the
                Municipality, and the labels above reflect exactly that distinction. No document has been re-created,
                re-typed or substituted.
              </p>
              <a
                href={site.documentSource}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.09em] text-green-700 hover:text-gold-700"
              >
                Official documents page <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>
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

      <section className="bg-white py-12">
        <div className="shell">
          <div className="flex gap-3.5 border border-paper-line p-5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
            <p className="text-[12px] leading-[1.8] text-ink-soft">
              If you encounter a problem with a document or need help finding something, or if a file fails to open, please write to
            the municipal office at {site.contact.postal} or visit in person.
              the municipal office or write to P.O. Box 220-30700, Iten. Documents published by other County departments and
              national agencies are available on the{" "}
              <a href={site.countyWebsite} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-800 underline decoration-gold-400 decoration-2 underline-offset-2 hover:text-gold-700">
                County Government of Elgeyo Marakwet website
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
