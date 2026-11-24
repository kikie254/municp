import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Megaphone, Users, FileText, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { ParticipationOpportunities } from "@/components/content/ParticipationOpportunities";
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
  { title: "Attend or write in", text: "Attend a forum only when it is announced by an authorised office and follow the instructions in that notice. This demonstration website does not accept official consultation submissions." },
  { title: "Follow the outcome", text: "Participation reports record what was raised and how it was addressed. Check the County Government document repository or the specific public notice for reports; verified municipal contact details are not yet published here." },
];

export default function PublicParticipationPage() {
  return (
    <>
      <PageHero
        title="Public Participation and Community Engagement"
        intro="Section 22 of the Urban Areas and Cities Act provides for Citizen Fora as part of municipal governance. The County Government repository includes calendars and reports from previous periods. Current meetings and participation arrangements must be confirmed through a specific notice issued by an authorised office."
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
                description="Citizen Fora are provided for under the Urban Areas and Cities Act. Any current meeting dates, venues and participation arrangements must be taken from a specific notice issued by an authorised office."
              />
            </Reveal>
            <div className="mt-7 border-y border-paper-line py-6">
              <h3 className="font-display text-[14px] font-bold text-green-900">Forum dates and engagement sessions</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
                Check public notices for upcoming forums, venues and participation details.
              </p>
            </div>

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
                  The County Government repository includes calendars and reports from previous periods. Current dates,
                  venues and participation arrangements must be confirmed through a notice issued by an authorised office.
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
