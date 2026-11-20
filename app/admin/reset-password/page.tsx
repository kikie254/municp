import type { Metadata } from "next";
import Link from "next/link";
import { ResetRequestForm } from "@/components/admin/ResetForms";

export const metadata: Metadata = { title: "Reset an administrator password", robots: { index: false, follow: false } };

export default function ResetRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-950 px-5 py-12">
      <div className="w-full max-w-[440px] border-t-[3px] border-gold-400 bg-white p-6 shadow-2xl md:p-8">
        <h1 className="font-display text-[1.1rem] font-bold text-green-900">Reset your password</h1>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
          Enter the email address of your administrator account. If it exists, a reset link valid for 60 minutes is issued.
        </p>
        <ResetRequestForm />
        <p className="mt-5 border-t border-paper-line pt-4 text-[11.5px] text-ink-muted">
          <Link href="/admin/login" className="font-semibold text-green-800 hover:text-gold-700">Back to sign-in</Link>
        </p>
      </div>
    </div>
  );
}
