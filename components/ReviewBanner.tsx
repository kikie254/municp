import Link from "next/link";
import { Info } from "lucide-react";

/**
 * Pre-launch review notice.
 *
 * The site is being prepared for the Municipality: institutional details, photography rights and
 * project/news records are still pending municipal approval. Saying so in one line is more honest
 * than letting a visitor assume every page is an adopted official statement, and it costs no
 * layout change beyond a single strip above the masthead.
 */
export function ReviewBanner() {
  return (
    <div className="bg-gold-50 print:hidden">
      <div className="shell flex items-start gap-2.5 py-2">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-700" aria-hidden="true" />
        <p className="text-[11px] leading-snug text-green-900">
          <span className="font-semibold uppercase tracking-[0.08em]">Pre-launch review — </span>
          this site is being prepared for Iten-Tambach Municipality. Institutional details, photography rights and
          project and news records are pending municipal verification.{" "}
          <Link href="/terms" className="font-semibold underline decoration-gold-400 decoration-2 underline-offset-2 hover:text-gold-700">
            Status of this website
          </Link>
        </p>
      </div>
    </div>
  );
}
