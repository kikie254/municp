import type { Metadata } from "next";
import Link from "next/link";
import { ResetCompleteForm } from "@/components/admin/ResetForms";

export const metadata: Metadata = { title: "Set a new password", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ResetCompletePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-950 px-5 py-12">
      <div className="w-full max-w-[440px] border-t-[3px] border-gold-400 bg-white p-6 shadow-2xl md:p-8">
        <h1 className="font-display text-[1.1rem] font-bold text-green-900">Set a new password</h1>
        {token ? (
          <>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
              Setting a new password signs out every existing session on this account.
            </p>
            <ResetCompleteForm token={token} />
          </>
        ) : (
          <p className="mt-2 text-[12.5px] text-flag-red">
            This page needs a reset link. Request one from the{" "}
            <Link href="/admin/reset-password" className="font-semibold underline">reset page</Link>.
          </p>
        )}
        <p className="mt-5 border-t border-paper-line pt-4 text-[11.5px] text-ink-muted">
          <Link href="/admin/login" className="font-semibold text-green-800 hover:text-gold-700">Back to sign-in</Link>
        </p>
      </div>
    </div>
  );
}
