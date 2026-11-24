import { FileText, ExternalLink, Download, CalendarDays, Weight } from "lucide-react";
import type { MunicipalDocument } from "@/lib/data/documents";


export function DocumentCard({ doc, compact = false }: { doc: MunicipalDocument; compact?: boolean }) {
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
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Open document
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
