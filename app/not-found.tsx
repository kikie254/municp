import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Home, FileQuestion } from "lucide-react";
import { sitePages } from "@/lib/data/pages";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const suggestions = [
    { label: "Home", href: "/", text: "The municipal homepage and latest updates." },
    { label: "Municipal Services", href: "/services", text: "Urban management and service information." },
    { label: "Document Centre", href: "/resources", text: "Charter, plans, policies and reports." },
    { label: "Contact", href: "/contact", text: "Office location, telephone and email." },
  ];

  return (
    <section className="bg-paper py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center bg-green-50 text-green-700">
            <Search className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-700">Error 404</p>
          <h1 className="mt-3 font-display text-[1.9rem] font-extrabold leading-tight text-green-900 sm:text-[2.4rem]">
            This page could not be found
          </h1>
          <p className="mt-4 text-[14px] leading-[1.85] text-ink-soft">
            The address you followed may be out of date, or the page may have moved. No information has been lost —
            use the links below, or search the site from the header.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              <Home aria-hidden="true" /> Return to the homepage
            </Link>
            <Link href="/sitemap-page" className="btn btn-outline">
              View the sitemap <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-2">
          {suggestions.map((s) => (
            <Link key={s.href} href={s.href} className="group bg-white p-5 transition-colors hover:bg-green-50">
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-[13.5px] font-bold text-green-900">{s.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-green-600 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-[12px] leading-relaxed text-ink-muted">{s.text}</span>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2 text-center text-[11.5px] leading-relaxed text-ink-muted">
          <FileQuestion className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            If you followed a link from another site, please let the municipal office know on the municipal office or at
            P.O. Box 220-30700, Iten so that the link can be corrected. The complete list of{" "}
            {sitePages.length} public pages is on the sitemap.
          </span>
        </p>
      </div>
    </section>
  );
}
