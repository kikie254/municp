import { Info } from "lucide-react";

/**
 * Professional empty state used wherever verified municipal information does not yet exist.
 * It replaces sample content rather than inventing a substitute, and keeps the surrounding
 * page layout, headings and spacing exactly as designed.
 */
export function EmptyState({
  title,
  body,
  className = "",
  children,
}: {
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`border border-dashed border-paper-line bg-paper-warm px-6 py-10 ${className}`}>
      <div className="flex items-start gap-3.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
        <div>
          <h3 className="font-display text-[14px] font-bold text-green-900">{title}</h3>
          <p className="mt-2 max-w-2xl text-[12.5px] leading-[1.8] text-ink-muted">{body}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
