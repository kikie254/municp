import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { permissionsFor } from "@/lib/auth/rbac";
import { logoutAction } from "@/lib/actions/auth";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const items = [
  { href: "/admin", label: "Overview", icon: "dashboard", permission: "settings:read" },
  { href: "/admin/news", label: "News and announcements", icon: "news", permission: "news:write" },
  { href: "/admin/notices", label: "Public notices", icon: "notices", permission: "notices:write" },
  { href: "/admin/projects", label: "Projects", icon: "projects", permission: "projects:write" },
  { href: "/admin/documents", label: "Documents", icon: "documents", permission: "documents:write" },
  { href: "/admin/submissions", label: "Feedback and complaints", icon: "submissions", permission: "submissions:read" },
  { href: "/admin/participation", label: "Public participation", icon: "participation", permission: "participation:manage" },
  { href: "/admin/users", label: "User management", icon: "users", permission: "users:manage" },
  { href: "/admin/audit", label: "Audit log", icon: "audit", permission: "audit:read" },
  { href: "/admin/settings", label: "System status", icon: "settings", permission: "settings:read" },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const permissions = permissionsFor(user.role);
  const visible = items.filter((i) => permissions.includes(i.permission as never));

  return (
    <div className="min-h-screen bg-paper-warm">
      <header className="border-b border-green-950/40 bg-green-950 text-white">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/brand/elgeyo-marakwet-crest.png" alt="" width={34} height={34} className="h-[34px] w-[34px] object-contain" />
            <span>
              <span className="block font-display text-[11.5px] font-extrabold uppercase tracking-[0.09em]">Municipal administration</span>
              <span className="block text-[9px] uppercase tracking-[0.14em] text-white/50">Iten-Tambach Municipality</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-[11.5px] font-semibold">{user.name}</p>
              <p className="text-[9.5px] uppercase tracking-[0.12em] text-gold-400">{ROLE_LABELS[user.role]}</p>
            </div>
            <Link href="/" className="hidden text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/60 hover:text-gold-300 md:block">
              View site
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-1.5 border border-white/25 px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] hover:bg-white/10">
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="shell grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <AdminNav items={visible.map((i) => ({ href: i.href, label: i.label }))} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
