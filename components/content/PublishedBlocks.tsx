import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, ArrowRight, FileText, Download, Megaphone, Wallet } from "lucide-react";
import { publicImageAssetsApproved } from "@/lib/config/env";

/**
 * Presentation components for records that come from the database.
 *
 * These are deliberately separate from the Phase 1 demonstration cards: a published record has no
 * "sample" label, a draft never reaches them, and every field shown is whatever an authorised
 * officer actually saved.
 */

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

type NewsRecord = {
  slug: string; title: string; category: string; summary: string;
  imagePath: string | null; imageAlt: string | null; publishedAt: Date | null;
};

export function PublishedNewsCard({ item, featured = false }: { item: NewsRecord; featured?: boolean }) {
  return (
    <article className={`group card overflow-hidden ${featured ? "grid md:grid-cols-2" : ""}`}>
      <div className={`relative bg-green-950 ${featured ? "min-h-[220px] md:min-h-full" : "aspect-[16/10]"}`}>
        {item.imagePath && publicImageAssetsApproved() ? (
          <Image src={item.imagePath} alt={item.imageAlt ?? ""} fill sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, 33vw"} className="object-cover" />
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center pattern-grid">
            <Megaphone className="h-8 w-8 text-white/40" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className={featured ? "p-6 md:p-8" : "p-5"}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-700">{item.category}</p>
        <h3 className={`mt-2 font-display font-bold leading-snug text-green-900 ${featured ? "text-[1.35rem] md:text-[1.6rem]" : "text-[15px]"}`}>
          <Link href={`/news/${item.slug}`} className="hover:underline decoration-gold-400 decoration-2 underline-offset-4">
            {item.title}
          </Link>
        </h3>
        <p className={`mt-2 leading-relaxed text-ink-soft ${featured ? "text-[14px]" : "text-[12.5px]"}`}>{item.summary}</p>
        <p className="mt-3.5 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.1em] text-ink-muted">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {formatDate(item.publishedAt)}
        </p>
      </div>
    </article>
  );
}

type ProjectRecordView = {
  slug: string; title: string; category: string; projectStatus: string; location: string;
  summary: string; imagePath: string | null; imageAlt: string | null; budget: string | null; publishedAt: Date | null;
};

export function PublishedProjectCard({ project }: { project: ProjectRecordView }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] bg-green-950">
        {project.imagePath && publicImageAssetsApproved() ? (
          <Image src={project.imagePath} alt={project.imageAlt ?? ""} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center pattern-grid">
            <MapPin className="h-7 w-7 text-white/40" aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3 bg-green-900 px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-white">
          {project.projectStatus}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-700">{project.category}</p>
        <h3 className="mt-2 font-display text-[15px] font-bold leading-snug text-green-900">
          <Link href={`/projects/${project.slug}`} className="hover:underline decoration-gold-400 decoration-2 underline-offset-4">{project.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-soft">{project.summary}</p>
        <div className="mt-3.5 space-y-1.5 border-t border-paper-line pt-3 text-[11.5px] text-ink-muted">
          <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {project.location}</p>
          {project.budget && <p className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {project.budget}</p>}
        </div>
      </div>
    </article>
  );
}

type DocRecord = { id: string; title: string; category: string; description: string; mimeType: string; sizeBytes: number; publishedAt: Date | null };

export function PublishedDocumentRow({ doc }: { doc: DocRecord }) {
  return (
    <li className="flex flex-col gap-2 border-b border-paper-line py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-gold-700">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" /> {doc.category}
        </p>
        <p className="mt-1 text-[13.5px] font-semibold text-green-900">{doc.title}</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-ink-muted">{doc.description}</p>
        <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-ink-muted">
          {formatDate(doc.publishedAt)} · {(doc.sizeBytes / 1024).toFixed(0)} KB
        </p>
      </div>
      <a href={`/api/documents/${doc.id}/download`} className="btn btn-outline shrink-0 !px-4 !py-2 !text-[11px]" download>
        <Download aria-hidden="true" /> Download
      </a>
    </li>
  );
}

export function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="link-arrow">
      {label} <ArrowRight aria-hidden="true" />
    </Link>
  );
}
