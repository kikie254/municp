import { ShieldAlert } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Renders a pending-verification note under contact details that have not been confirmed in
 * writing by the Municipality. Renders nothing once `site.contactVerification` is "confirmed".
 */
export function ContactPending({ compact = false }: { compact?: boolean }) {
  if (site.contactVerification === "confirmed") return null;
  return (
    <p
      className={`flex items-start gap-2 border-l-2 border-gold-400/70 pl-2.5 text-white/55 ${
        compact ? "text-[10.5px] leading-snug" : "text-[11px] leading-relaxed"
      }`}
    >
      <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0 text-gold-400" aria-hidden="true" />
      <span>
        Pending verification: these details are carried over from the previous version of this site and have not yet
        been confirmed in writing by the Municipality.
      </span>
    </p>
  );
}
