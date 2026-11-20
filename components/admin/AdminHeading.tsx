export function AdminHeading({ title, intro, action }: { title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-paper-line pb-4">
      <div>
        <h1 className="font-display text-[1.35rem] font-bold tracking-[-0.01em] text-green-900">{title}</h1>
        {intro && <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function fmt(value: Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(value);
}

export function fmtDateTime(value: Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(value);
}
