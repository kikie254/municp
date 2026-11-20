import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function DeniedPage() {
  return (
    <div className="border border-flag-red/30 bg-white p-8">
      <ShieldAlert className="h-8 w-8 text-flag-red" aria-hidden="true" />
      <h1 className="mt-4 font-display text-[1.2rem] font-bold text-green-900">Your role does not permit that</h1>
      <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-soft">
        The action was refused by the server, not merely hidden. If you need access, ask a super administrator to review
        your role.
      </p>
      <Link href="/admin" className="btn btn-outline mt-5 !py-2.5 !text-[11.5px]">Back to overview</Link>
    </div>
  );
}
