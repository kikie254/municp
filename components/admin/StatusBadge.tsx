const MAP: Record<string, string> = {
  DRAFT: "bg-ink/[0.06] text-ink-soft",
  IN_REVIEW: "bg-gold-100 text-gold-700",
  APPROVED: "bg-green-100 text-green-800",
  PUBLISHED: "bg-green-600 text-white",
  ARCHIVED: "bg-ink/[0.06] text-ink-muted",
  RECEIVED: "bg-ink/[0.06] text-ink-soft",
  UNDER_REVIEW: "bg-gold-100 text-gold-700",
  ASSIGNED: "bg-gold-100 text-gold-700",
  IN_PROGRESS: "bg-green-100 text-green-800",
  RESOLVED: "bg-green-600 text-white",
  CLOSED: "bg-ink/[0.08] text-ink-muted",
  SENT: "bg-green-600 text-white",
  QUEUED: "bg-gold-100 text-gold-700",
  FAILED: "bg-flag-red text-white",
  NOT_CONFIGURED: "bg-ink/[0.08] text-ink-muted",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = MAP[status] ?? "bg-ink/[0.06] text-ink-soft";
  return (
    <span className={`inline-block whitespace-nowrap px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.07em] ${cls}`}>
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}
