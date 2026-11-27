import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ImageOff } from "lucide-react";
import type { NewsItem } from "@/lib/data/news";

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const hasVerifiedImage = Boolean(item.image && item.imageAlt?.trim() && !item.isSample);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border border-paper-line bg-white shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift ${featured ? "md:flex-row" : ""}`}
    >
      <div className={`relative overflow-hidden bg-green-950 ${featured ? "aspect-[16/10] md:aspect-auto md:w-1/2" : "aspect-[16/10]"}`}>
        {hasVerifiedImage ? (
          <Image
            src={item.image!}
            alt={item.imageAlt!}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-5 text-center text-white">
            <ImageOff className="h-7 w-7 text-gold-400" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-300">{item.category}</span>
            <span className="max-w-xs text-[11px] leading-relaxed text-white/75">Sample entry — no verified article photograph supplied</span>
          </div>
        )}
        <span className="absolute left-0 top-0 bg-gold-400 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-green-950">
          {item.category}
        </span>
        {item.isSample && (
          <span className="absolute right-0 top-0 bg-green-950/85 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/80">
            Sample content
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-5 ${featured ? "md:justify-center md:p-7" : ""}`}>
        <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          <CalendarDays className="h-3 w-3" aria-hidden="true" />
          <time dateTime={item.date}>{item.dateLabel}</time>
        </p>
        <h3 className={`mt-2.5 text-balance font-display font-bold leading-snug text-green-900 ${featured ? "text-[18px] md:text-[21px]" : "text-[15px]"}`}>
          <Link href={`/news/${item.slug}`} className="transition-colors hover:text-green-600">
            {item.title}
          </Link>
        </h3>
        <p className={`mt-2.5 text-[12.5px] leading-relaxed text-ink-soft ${featured ? "line-clamp-4" : "line-clamp-3"}`}>
          {item.summary}
        </p>
        <div className="mt-auto pt-4">
          <Link href={`/news/${item.slug}`} className="link-arrow">
            Read more <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
