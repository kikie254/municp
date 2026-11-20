import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { legalLinks, quickLinks, resourceLinks, site } from "@/lib/site";
import { ContactPending } from "./ContactPending";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-green-950 text-white">
      <div className="h-[3px] w-full bg-gradient-to-r from-flag-red via-gold-400 to-green-500" />

      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3.5">
            <Image
              src="/brand/elgeyo-marakwet-crest.png"
              alt="Official crest of the County Government of Elgeyo Marakwet"
              width={64}
              height={64}
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="font-display text-[13.5px] font-extrabold uppercase leading-tight tracking-[0.06em] text-white">
                Iten-Tambach
                <br />
                Municipality
              </p>
              <p className="mt-1 text-[9.5px] uppercase tracking-[0.14em] text-white/50">
                {site.county}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-white/65">
            Building a better, cleaner, inclusive and vibrant municipality.
          </p>
          <p className="mt-4 flex items-start gap-2 border-l-2 border-gold-400/60 pl-3 text-[12px] leading-relaxed text-white/50">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden="true" />
            <span>
              Website prepared for Iten-Tambach Municipality, County Government of Elgeyo Marakwet,
              Republic of Kenya. Pending municipal approval before launch.
            </span>
          </p>
          <Link
            href={site.countyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-300 transition-colors hover:text-gold-200"
          >
            County Website <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">Quick Links</h2>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[13px] text-white/70 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">Public Resources</h2>
          <ul className="mt-4 space-y-2.5">
            {resourceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[13px] text-white/70 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/resources" className="text-[13px] font-semibold text-gold-300 transition-colors hover:text-gold-200">
                Document Centre
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-400">Contact</h2>
          <ul className="mt-4 space-y-3.5 text-[13px] text-white/70">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-300" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-white/90">{site.contact.office}</span>
                {site.contact.physical}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-green-300" aria-hidden="true" />
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-white">
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-green-300" aria-hidden="true" />
              <a href={`mailto:${site.contact.email}`} className="break-all transition-colors hover:text-white">
                {site.contact.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-green-300" aria-hidden="true" />
              <span>{site.contact.postal}</span>
            </li>
          </ul>
          <div className="mt-4">
            <ContactPending />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[11.5px] text-white/45">
            © {year} Iten-Tambach Municipality | County Government of Elgeyo Marakwet. All Rights Reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[11px] font-medium text-white/55 transition-colors hover:text-gold-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
