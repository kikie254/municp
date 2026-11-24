import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { publicImageAssetsApproved } from "@/lib/config/env";

export type Crumb = { label: string; href?: string };

export function PageHero({
  title,
  intro,
  image,
  imageAlt,
  eyebrow,
  crumbs,
  align = "left",
}: {
  title: string;
  intro?: string;
  image: string;
  imageAlt: string;
  eyebrow?: string;
  crumbs: Crumb[];
  align?: "left" | "center";
}) {
  const showImage = publicImageAssetsApproved();
  return (
    <section className="relative isolate overflow-hidden bg-green-950">
      {showImage && (
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
      )}
      <div className="absolute inset-0 banner-overlay" />
      <div className="absolute inset-0 pattern-grid opacity-60" aria-hidden="true" />

      <div className={`shell relative py-14 md:py-20 ${align === "center" ? "text-center" : ""}`}>
        <nav aria-label="Breadcrumb" className={`mb-6 ${align === "center" ? "flex justify-center" : ""}`}>
          <ol className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.13em] text-white/55">
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-300">
                <Home className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only md:not-sr-only">Home</span>
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-white/30" aria-hidden="true" />
                {c.href && i < crumbs.length - 1 ? (
                  <Link href={c.href} className="transition-colors hover:text-gold-300">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-gold-300" aria-current="page">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && (
          <p className="eyebrow eyebrow-light mb-4">{eyebrow}</p>
        )}
        <h1 className="max-w-4xl text-balance font-display text-[1.85rem] font-extrabold uppercase leading-[1.08] tracking-[0.005em] text-white sm:text-[2.3rem] md:text-[2.85rem] lg:text-[3.15rem]">
          {title}
        </h1>
        {intro && (
          <p className={`mt-5 max-w-2xl text-pretty text-[14.5px] leading-[1.8] text-white/72 md:text-[15.5px] ${align === "center" ? "mx-auto" : ""}`}>
            {intro}
          </p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-gold-400 via-gold-400/40 to-transparent" />
    </section>
  );
}
