import { FileText, ExternalLink, Download, CalendarDays, Weight, ShieldCheck, ShieldAlert } from "lucide-react";
import type { MunicipalDocument } from "@/lib/data/documents";

/**
 * Verification badges.
 *
 * "verifiedFile: true" in the supplied build meant only that a URL returned a PDF. That is not the
 * same as an authenticated document, so the badge now states exactly what was checked and nothing
 * more. Colour is never the only signal: every state carries a text label.
 */
const verificationMeta = {
  "content-confirmed": {
    label: "Content checked",
    icon: ShieldCheck,
    className: "border-green-200 bg-green-50 text-green-700",
  },
  "file-only": {
    label: "File only",
    icon: ShieldAlert,
    className: "border-gold-300 bg-gold-50 text-gold-800",
  },
  "source-page-only": {
    label: "Source page only",
    icon: ShieldAlert,
    className: "border-flag-red/40 bg-flag-red/[0.06] text-flag-red",
  },
} as const;

export function DocumentCard({ doc, compact = false }: { doc: MunicipalDocument; compact?: boolean }) {
  const meta = verificationMeta[doc.verification];
  const StatusIcon = meta.icon;
  return (
    <article className="group flex h-full flex-col justify-between border border-paper-line bg-white p-5 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-green-300 hover:shadow-lift">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-flag-red/8 text-flag-red">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="border border-green-100 bg-green-50 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-green-700">
            {doc.category}
          </span>
        </div>

        <h3 className="mt-4 text-balance font-display text-[15px] font-bold leading-snug text-green-900">
          {doc.title}
        </h3>

        {!compact && <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-muted">{doc.summary}</p>}

        <p className={`mt-3 inline-flex items-center gap-1.5 border px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] ${meta.className}`}>
          <StatusIcon className="h-3 w-3" aria-hidden="true" />
          {meta.label}
        </p>
        {!compact && doc.note && (
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-muted">{doc.note}</p>
        )}

        <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10.5px] uppercase tracking-[0.08em] text-ink-muted">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3" aria-hidden="true" />
            <dt className="sr-only">Last updated</dt>
            <dd>{doc.lastUpdated}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Weight className="h-3 w-3" aria-hidden="true" />
            <dt className="sr-only">File size</dt>
            <dd>{doc.fileSize} · PDF</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-paper-line pt-4">
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-green-800 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-green-700"
        >
          {doc.verification === "source-page-only" ? <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> : <Download className="h-3.5 w-3.5" aria-hidden="true" />}
          {doc.verification === "source-page-only" ? "Official source" : "Open PDF"}
        </a>
        <a
          href={`https://docs.google.com/viewer?url=${encodeURIComponent(doc.fileUrl)}&embedded=true`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-paper-line px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-green-800 transition-colors hover:border-green-700 hover:bg-green-50"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Preview
        </a>
      </div>
    </article>
  );
}
