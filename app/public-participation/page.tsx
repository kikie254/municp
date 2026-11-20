import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Megaphone, Users, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { ParticipationOpportunities } from "@/components/content/ParticipationOpportunities";
import { forums } from "@/lib/data/services";
import { documents } from "@/lib/data/documents";

export const metadata: Metadata = {
  title: "Public Participation and Community Engagement",
  description:
    "Take part in municipal decision-making in Iten-Tambach: citizen forums, public notices, engagement channels, participation reports and how to participate.",
  alternates: { canonical: "/public-participation" },
};

const participationDocs = documents.filter(
  (d) =>
    d.category === "Public Participation Reports" ||
    d.title.toLowerCase().includes("citizen fora") ||
    d.title.toLowerCase().includes("gender")
).slice(0, 5);

const howTo = [
  { title: "Read the notice", text: "Published notices set out the subject, venue and date of an engagement. Read the notice before attending so that you know what decision is being discussed." },
  { title: "Prepare your contribution", text: "Write down your point, the area it concerns and the outcome you are proposing. A short written note is easier to table at a forum." },
  { title: "Attend or write in", text: "Attend the forum where one is scheduled, or send your views to the municipal office by telephone or email if you cannot attend." },
  { title: "Follow the outcome", text: "Participation reports record what was raised and how it was addressed. Ask the municipal office for the report on an engagement you took part in." },
];

export default function PublicParticipationPage() {
  return (
    <>
      <PageHero
        title="Public Participation and Community Engagement"
        intro="Public participation is essential to responsive and accountable governance. Residents understand their communities, their priorities and the challenges affecting everyday life. Iten-Tambach Municipality encourages residents, businesses, community groups and other stakeholders to participate in development discussions and contribute to decisions that shape the municipality."
        image="/images/public-engagement.jpg"
        imageAlt="Community members gathered for a public baraza discussion in Kenya"
        eyebrow="Citizen Engagement"
        crumbs={[{ label: "Public Participation" }]}
      />

      <section className="bg-white py-14 md:py-18">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading
                eyebrow="Forum Calendar"
                title="Forums and engagement sessions"
                description="Citizen forums are the municipality's principal channel for face-to-face engagement on plans, budgets and service priorities. Confirmed dates are issued through official public notices."
              />
            </Reveal>
            <div className="mt-7 divide-y divide-paper-line border-y border-paper-line">
              {forums.map((f) => (
                <div key={f.title} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-gold-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-gold-800">
                        {f.status}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{f.area}</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-[14px] font-bold text-green-900">{f.title}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">{f.note}</p>
                  </div>
                  <Link href="/resources?category=Public+Participation+Reports" className="shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">
                    Reports
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11.5px] leading-relaxed text-ink-muted">
              No confirmed forum dates have been supplied for publication on this website. Dates, venues and agendas are
              announced through official public notices and the citizen fora calendar published by the County
              Government.
            </p>

            <div className="mt-10">
              <Reveal>
                <SectionHeading eyebrow="How to Participate" title="Four steps to make your voice count" />
              </Reveal>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {howTo.map((s, i) => (
                  <li key={s.title} className="border border-paper-line bg-paper-warm p-4">
                    <span className="font-display text-[11px] font-extrabold tracking-[0.1em] text-gold-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 font-display text-[13px] font-bold text-green-900">{s.title}</h3>
                    <p className="mt-1.5 text-[12px] leading-[1.75] text-ink-muted">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="space-y-4">
              <div className="border-t-[3px] border-gold-400 bg-green-950 p-5 text-white">
                <Megaphone className="h-5 w-5 text-gold-400" aria-hidden="true" />
                <h3 className="mt-3 font-display text-[13px] font-bold uppercase tracking-[0.07em]">Public notices</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-white/75">
                  Notices on proposed plans, budgets and service changes are published as they are issued. Each notice
                  states the subject, the participation window and where to send views.
                </p>
                <Link href="/news?filter=Public+Notices" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-gold-300 hover:text-gold-200">
                  View public notices <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="border border-paper-line bg-white p-5">
                <h3 className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.08em] text-green-900">
                  <Users className="h-4 w-4 text-green-600" aria-hidden="true" /> Community engagement
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
                  Engagement extends beyond formal forums to trader associations, youth and women&rsquo;s groups, persons
                  with disabilities, neighbourhood associations and development partners. The published Gender
                  Engagement Framework sets out how inclusion is approached.
                </p>
                <Link href="/resources?category=Other+Official+Publications" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">
                  Inclusion documents <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="border border-paper-line bg-white p-5">
                <h3 className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.08em] text-green-900">
                  <CalendarDays className="h-4 w-4 text-green-600" aria-hidden="true" /> Participation calendar
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
                  Quarterly citizen fora are published in advance as a calendar. The calendar and the quarterly reports
                  that follow each round are held in the document centre.
                </p>
                <Link href="/resources" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green-700 hover:text-gold-700">
                  Document centre <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-paper-line bg-paper-warm py-14">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Participation Reports"
                title="What was said, and what happened next"
                description="Reports on completed engagement rounds are published so that residents can see how contributions were recorded."
              />
            </Reveal>
            <ul className="mt-6 space-y-3">
              {participationDocs.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 border border-paper-line bg-white p-3.5 transition-colors hover:border-green-300"
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-flag-red" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-semibold leading-snug text-green-900 group-hover:underline">{d.title}</span>
                      <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.1em] text-ink-muted">{d.category} · {d.year}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-start gap-2 border-l-2 border-green-600 pl-3">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" aria-hidden="true" />
              <p className="text-[11.5px] leading-relaxed text-ink-muted">
                Reports are linked to the County Government&rsquo;s official download endpoint and open in a new tab.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ParticipationOpportunities />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
