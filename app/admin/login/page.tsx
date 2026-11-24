import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Landmark } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSessionUser } from "@/lib/auth/session";
import { databaseReachable } from "@/lib/db";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Administration sign-in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");
  const dbUp = await databaseReachable();

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-950 px-5 py-12">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-3.5">
          <Landmark className="h-10 w-10 text-gold-400" aria-hidden="true" />
          <div>
            <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.07em] text-white">Iten-Tambach Municipality</p>
            <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.14em] text-white/50">{site.county}</p>
          </div>
        </div>

        <div className="mt-6 border-t-[3px] border-gold-400 bg-white p-6 shadow-2xl md:p-8">
          <h1 className="font-display text-[1.15rem] font-bold text-green-900">Administration sign-in</h1>
          <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
            Authorised municipal officers only. Every sign-in attempt is recorded in the audit log.
          </p>

          {!dbUp && (
            <div role="alert" className="mt-4 border border-flag-red/40 bg-flag-red/[0.05] px-4 py-3">
              <p className="text-[12px] text-flag-red">
                The database is unreachable, so sign-in is unavailable. Check the Firebase configuration in <code className="font-mono">.env</code>{" "}
                (see FIREBASE_SETUP.md).
              </p>
            </div>
          )}

          <LoginForm />

          <p className="mt-5 border-t border-paper-line pt-4 text-[11px] leading-relaxed text-ink-muted">
            No default account exists. The first administrator is created with{" "}
            <code className="font-mono text-[10.5px]">npm run admin:provision</code> using the credentials you supply.
          </p>
        </div>

        <p className="mt-5 text-center">
          <Link href="/" className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/60 hover:text-gold-300">
            Return to the public website
          </Link>
        </p>
      </div>
    </div>
  );
}
