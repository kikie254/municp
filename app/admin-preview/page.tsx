import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LayoutDashboard, Newspaper, FileText, FolderKanban, Megaphone, Activity,
  PenLine, Upload, Settings2, ArrowRight, Lock, Users, BarChart3,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { news } from "@/lib/data/news";
import { documents } from "@/lib/data/documents";
import { projects } from "@/lib/data/projects";
import { adminPreviewEnabled } from "@/lib/site";

export const metadata: Metadata = {
  title: "Administration Preview (Demonstration)",
  description:
    "A visual demonstration of a municipal administration dashboard for Iten-Tambach Municipality. Presentation only — not a secure or operational system.",
  robots: { index: false, follow: false },
};

const stats = [
  { label: "Published news", value: news.length, icon: Newspaper, note: "Sample articles" },
  { label: "Documents indexed", value: documents.length, icon: FileText, note: "County repository" },
  { label: "Project records", value: projects.length, icon: FolderKanban, note: "Sample records" },
  { label: "Public notices", value: news.filter((n) => n.category === "Public Notices").length, icon: Megaphone, note: "Sample notices" },
];

const activity = [
  { action: "Document indexed", subject: "Iten Tambach Solid Waste Management Plan 2025", when: "13 March 2026", tag: "Resources" },
  { action: "Project record created", subject: "Municipal Cleanliness and Waste Collection Programme", when: "Sample entry", tag: "Projects" },
  { action: "Article drafted", subject: "Municipality outlines sample programme for cleaner public spaces", when: "4 November 2026", tag: "News" },
  { action: "Notice added", subject: "Public notice template — participation window", when: "Sample entry", tag: "Notices" },
  { action: "Charter published", subject: "Iten Tambach Municipal Charter", when: "30 September 2019", tag: "Resources" },
];

const modules = [
  { title: "Content management", text: "Draft, review and publish page content, with a preview state before publication.", icon: PenLine, items: ["Page sections", "Media library", "Publishing workflow"] },
  { title: "Document management", text: "Catalogue municipal publications by category, year and source, and track whether a file is verified.", icon: Upload, items: ["Category taxonomy", "Year filters", "Verified-file flag"] },
  { title: "News publishing", text: "Draft articles and notices with category, date, summary and body fields.", icon: Newspaper, items: ["Draft and publish", "Categories", "Featured story"] },
  { title: "Project management", text: "Maintain project records with status, location, dates and linked documents.", icon: FolderKanban, items: ["Status tracking", "Categories", "Document links"] },
];

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="text-green-900">{label}</span>
        <span className="font-semibold text-ink-muted">{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden bg-green-900/10">
        <div className="h-full bg-green-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminPreviewPage() {
  if (!adminPreviewEnabled) notFound();

  const byCategory = Object.entries(
    documents.reduce<Record<string, number>>((acc, d) => {
      acc[d.category] = (acc[d.category] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(...byCategory.map(([, v]) => v));

  return (
    <>
      <PageHero
        title="Municipal Administration Preview"
        intro="A visual demonstration of how a municipal team could administer this website. This page is withdrawn by default and is not a secure system: it does not authenticate users, it holds no data and it accepts no input. It must never be described or linked as a municipal administration portal."
        image="/images/iten-town-aerial.jpg"
        imageAlt="Aerial view of Iten town centre"
        eyebrow="Demonstration only — not an administration portal"
        crumbs={[{ label: "Administration Preview" }]}
      />

      <section className="bg-paper-warm py-10">
        <div className="shell">
          <div className="flex items-start gap-3 border border-flag-red/30 bg-flag-red/[0.05] p-4">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />
            <p className="text-[12px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-green-900">No authentication, no live data.</strong> This screen
              illustrates a dashboard layout using sample figures taken from this site&rsquo;s demonstration dataset. It is
              not connected to any database, it does not accept logins, and it must not be presented as an operational
              administration system. A production version would require secure authentication, role-based permissions,
              audit logging and a content workflow approved by the Municipality.
            </p>
          </div>

          <div className="mt-6 grid gap-px overflow-hidden border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center bg-green-50 text-green-700">
                    <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="bg-gold-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-gold-800">Demo</span>
                </div>
                <p className="mt-3 font-display text-[1.7rem] font-extrabold leading-none text-green-900">{s.value}</p>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">{s.label}</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">{s.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="border-t-[3px] border-green-800 bg-white p-5 shadow-card">
                <h2 className="flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.07em] text-green-900">
                  <Activity className="h-4 w-4 text-green-600" aria-hidden="true" /> Recent activity
                </h2>
                <ul className="mt-4 divide-y divide-paper-line">
                  {activity.map((a) => (
                    <li key={a.subject} className="flex items-start justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-gold-700">{a.action}</p>
                        <p className="mt-0.5 text-[12.5px] font-medium leading-snug text-green-900">{a.subject}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-ink-muted">{a.tag}</span>
                        <span className="block text-[10.5px] text-ink-muted">{a.when}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {modules.map((m) => (
                  <div key={m.title} className="border border-paper-line bg-white p-5">
                    <m.icon className="h-5 w-5 text-green-600" aria-hidden="true" />
                    <h3 className="mt-2.5 font-display text-[13px] font-bold text-green-900">{m.title}</h3>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-ink-muted">{m.text}</p>
                    <ul className="mt-3 space-y-1">
                      {m.items.map((i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                          <span className="h-1 w-1 shrink-0 bg-gold-500" aria-hidden="true" /> {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-paper-line bg-white p-5">
                <h2 className="flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.07em] text-green-900">
                  <BarChart3 className="h-4 w-4 text-green-600" aria-hidden="true" /> Documents by category
                </h2>
                <div className="mt-4 space-y-3">
                  {byCategory.map(([k, v]) => <Bar key={k} label={k} value={v} max={max} />)}
                </div>
              </div>

              <div className="mt-4 border border-paper-line bg-white p-5">
                <h2 className="flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.07em] text-green-900">
                  <Newspaper className="h-4 w-4 text-green-600" aria-hidden="true" /> News publishing preview
                </h2>
                <div className="mt-3 space-y-2.5">
                  {news.slice(0, 4).map((n) => (
                    <div key={n.slug} className="border border-paper-line p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-gold-700">{n.category}</span>
                        <span className="h-1.5 w-1.5 bg-gold-400" aria-hidden="true" />
                      </div>
                      <p className="mt-1 text-[12px] font-medium leading-snug text-green-900">{n.title}</p>
                      <p className="mt-1 text-[10.5px] text-ink-muted">{n.dateLabel} · Sample draft</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-green-950 p-5 text-white">
                <Settings2 className="h-5 w-5 text-gold-400" aria-hidden="true" />
                <h2 className="mt-2.5 font-display text-[12.5px] font-bold uppercase tracking-[0.08em]">Production requirements</h2>
                <ul className="mt-2.5 space-y-1.5 text-[11.5px] leading-relaxed text-white/75">
                  {["Secure authentication and role-based permissions", "Editorial approval workflow", "Audit logging of every change", "Database and file storage for verified documents", "Backup and retention policy"].map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <Users className="mt-0.5 h-3 w-3 shrink-0 text-gold-400" aria-hidden="true" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary !py-3 !text-[12px]">
              <LayoutDashboard aria-hidden="true" /> Return to the public site
            </Link>
            <Link href="/sitemap-page" className="btn btn-outline !py-3 !text-[12px]">
              Sitemap <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
