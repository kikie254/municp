import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Gauge, Landmark, MapPinned, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Integrated Development Plan | Iten-Tambach Municipality",
  description: "A public-facing overview of the Iten Municipality Integrated Development Plan.",
};

const sectorAllocations = [
  { name: "Health, Water and Sanitation", amount: 8748650000, label: "KSh 8.749B", share: 64.3 },
  { name: "Infrastructure", amount: 3296000000, label: "KSh 3.296B", share: 24.2 },
  { name: "Social and Empowerment", amount: 972000000, label: "KSh 972M", share: 7.1 },
  { name: "Productive and Economic", amount: 285500000, label: "KSh 285.5M", share: 2.1 },
  { name: "Public Administration and Governance", amount: 300000000, label: "KSh 300M", share: 2.2 },
];

const programmeLines = [
  ["Water Services", "4,420,000,000"],
  ["Solid Waste Management", "163,650,000"],
  ["Community and Environmental Health Services", "35,000,000"],
  ["Liquid Waste Management", "4,130,000,000"],
  ["Urban Transport Improvement", "2,423,000,000"],
  ["Energy", "297,000,000"],
  ["Public Works and Housing", "576,000,000"],
  ["Sports Development", "935,000,000"],
  ["Social Services", "37,000,000"],
  ["Tourism Development, Culture and Heritage", "37,500,000"],
  ["Trade and Enterprise Development", "248,000,000"],
  ["Municipal Administration", "159,500,000"],
  ["Disaster Management and Emergency Services", "140,500,000"],
];

const focusAreas = [
  { title: "Water, sanitation and waste", body: "Water services, solid waste management, community and environmental health, and liquid waste management." },
  { title: "Urban infrastructure", body: "Urban transport improvement, energy, public works, housing, roads and related public infrastructure." },
  { title: "Sports and social development", body: "Sports facilities and development, social services, community facilities and empowerment." },
  { title: "Local economy and tourism", body: "Tourism, culture and heritage, trade, enterprise development and investment partnerships." },
  { title: "Municipal governance and resilience", body: "Municipal administration, pollution control, disaster management and emergency services." },
];

const formatKsh = (value: number) => "KSh " + value.toLocaleString("en-KE");

export default function DevelopmentPlanPage() {
  return (
    <>
      <PageHero
        eyebrow="Planning and accountability"
        title="Integrated Development Plan"
        intro="The Municipality’s five-year development framework, with programme priorities, project targets, resource requirements and implementation arrangements as stated in the uploaded plan."
        image="/images/iten-town-aerial.jpg"
        imageAlt="Aerial view of Iten town and surrounding highlands"
        crumbs={[{ label: "Integrated Development Plan" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="shell">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-paper-line bg-paper-warm p-5">
              <p className="eyebrow">Planning horizon</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">Five years</p>
              <p className="mt-1 text-xs text-ink-muted">The uploaded plan labels annual programme targets Year 1 through Year 5; it does not state a the published plan period.</p>
            </div>
            <div className="border border-paper-line bg-paper-warm p-5">
              <p className="eyebrow">Total resource requirement</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">KSh 13.602B</p>
              <p className="mt-1 text-xs text-ink-muted">Plan estimate across all listed sectors.</p>
            </div>
            <div className="border border-paper-line bg-paper-warm p-5">
              <p className="eyebrow">Development programmes</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">13</p>
              <p className="mt-1 text-xs text-ink-muted">Programme lines in the sector resource summary.</p>
            </div>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow">The development framework</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-green-900 md:text-3xl">A coordinated plan for the Municipality</h2>
              <p className="mt-4 text-sm leading-7 text-ink-soft">
                The IDeP brings together the Municipality’s economic, social, environmental, physical and spatial development priorities. It is intended to guide planning and decision-making and to inform the alignment of annual budgets with the development plan.
              </p>
              <p className="mt-3 text-sm leading-7 text-ink-soft">
                The published plan describes implementation through County Government allocations, internally generated and sharable revenue, national government institutions, development partners, donor support and public-private partnerships.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="https://elgeyomarakwet.go.ke/?mdocs-file=6649" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FileText aria-hidden="true" /> Open published IDeP <ArrowUpRight aria-hidden="true" />
                </a>
                <Link href="/resources?category=Integrated+Development+Plans" className="btn btn-outline">
                  Browse related plans
                </Link>
              </div>
            </div>

            <div className="border border-paper-line bg-paper-warm p-6">
              <div className="flex items-center gap-3">
                <Landmark className="h-5 w-5 text-gold-600" aria-hidden="true" />
                <h3 className="font-display text-base font-bold text-green-900">Resource mobilisation framework</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink-muted">The plan’s estimated resource requirement is divided between County funding and external funding.</p>
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-semibold text-green-900">
                  <span>County funding</span><span>KSh 1.640B</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden bg-white">
                  <div className="h-full bg-green-700" style={{ width: "12.05%" }} />
                </div>
                <div className="mt-5 flex items-center justify-between text-xs font-semibold text-green-900">
                  <span>External funding</span><span>KSh 11.963B</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden bg-white">
                  <div className="h-full bg-gold-500" style={{ width: "87.95%" }} />
                </div>
              </div>
              <p className="mt-5 border-t border-paper-line pt-4 text-[11px] leading-5 text-ink-muted">
                External funding is described in the plan as requiring resource mobilisation, including development partner engagement and PPP arrangements. These figures are not evidence of funds already secured.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-warm py-12 md:py-16">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Sector priorities</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-green-900 md:text-3xl">Where the plan directs attention</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">The following groupings summarise the programme areas and resource totals shown in the plan’s sector summary.</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {sectorAllocations.map((sector) => (
              <div key={sector.name} className="border border-paper-line bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-bold text-green-900">{sector.name}</h3>
                  <span className="shrink-0 font-display text-base font-extrabold text-green-800">{sector.label}</span>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden bg-paper-warm">
                  <div className="h-full bg-green-700" style={{ width: sector.share + "%" }} />
                </div>
                <p className="mt-2 text-[11px] text-ink-muted">{sector.share}% of total plan resource requirement</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Programme resource summary</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-green-900 md:text-3xl">Programme estimates in the plan</h2>
            </div>
            <span className="hidden text-xs text-ink-muted sm:inline">Amounts in Kenya shillings</span>
          </div>
          <div className="mt-6 overflow-x-auto border border-paper-line">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-green-900 text-white">
                <tr><th className="px-4 py-3 font-semibold">Programme</th><th className="px-4 py-3 text-right font-semibold">Total resource requirement</th></tr>
              </thead>
              <tbody>
                {programmeLines.map(([name, amount], index) => (
                  <tr key={name} className={index % 2 === 0 ? "bg-white" : "bg-paper-warm"}>
                    <td className="px-4 py-3 text-ink-soft">{name}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-green-900">{formatKsh(Number(amount))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-green-800 bg-green-50">
                <tr><td className="px-4 py-3 font-bold text-green-900">Total</td><td className="px-4 py-3 text-right font-extrabold tabular-nums text-green-900">KSh 13,602,150,000</td></tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-ink-muted">Source: IDeP, “Resource Requirements by Sector”. Values above reproduce the programme totals in that table. They are planning estimates, not actual expenditure, current budget allocations or confirmed funding.</p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Selected planned outputs</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-green-900 md:text-3xl">What the plan proposes to deliver</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">Examples below are drawn from the programme target tables. They are planned outputs, not confirmation that the works have been funded, procured or completed.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <article className="border border-paper-line bg-paper-warm p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">Liquid waste management</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">50 km</p>
              <p className="mt-2 text-xs leading-5 text-ink-muted">Sewer line construction target in Year 5. The plan also lists two treatment plants across the programme period.</p>
            </article>
            <article className="border border-paper-line bg-paper-warm p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">Urban transport</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">20 km</p>
              <p className="mt-2 text-xs leading-5 text-ink-muted">Roads upgraded to bitumen standards target in Year 5, alongside machinery purchase and routine municipal road maintenance.</p>
            </article>
            <article className="border border-paper-line bg-paper-warm p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">Sports development</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">9 fields</p>
              <p className="mt-2 text-xs leading-5 text-ink-muted">The plan proposes upgrading nine standard sports fields and developing the Iten municipal sports grounds and Kamariny athletics facilities.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-green-950 py-12 text-white md:py-16">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-light">Monitoring and evaluation</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">Track delivery. Report progress. Improve services.</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Chapter Six sets out the monitoring and evaluation arrangements for tracking IDeP implementation and annual investment plans.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="border border-white/15 bg-white/[0.05] p-5">
              <Gauge className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold">Monitoring responsibilities</h3>
              <p className="mt-2 text-xs leading-5 text-white/65">The County Monitoring & Evaluation Committee (COMEC) tracks municipal mandates, programmes and projects. Sector M&E committees monitor service-delivery indicators; COMEC handles outcome-level indicators.</p>
            </div>
            <div className="border border-white/15 bg-white/[0.05] p-5">
              <FileText className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold">Reporting schedule</h3>
              <p className="mt-2 text-xs leading-5 text-white/65">The plan specifies quarterly municipal performance and project M&E reports, plus annual and end-term IDeP performance reports. Quarterly reports are due on the 14th of the first month after the quarter.</p>
            </div>
            <div className="border border-white/15 bg-white/[0.05] p-5">
              <Users className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold">Board oversight</h3>
              <p className="mt-2 text-xs leading-5 text-white/65">The Municipal Board is assigned customer satisfaction surveys and project field visits. Reports are shared with county structures and disseminated to stakeholders and the public.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/15 pt-6">
            <MapPinned className="h-4 w-4 text-gold-400" aria-hidden="true" />
            <p className="text-xs text-white/70">The Municipality’s implementation framework also identifies the Municipal Board, County Government, County Assembly, development partners, business community and Citizen Fora.</p>
          </div>
        </div>
      </section>

      <section className="bg-paper-warm py-12 md:py-16">
        <div className="shell">
          <p className="eyebrow">Five programme clusters</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-green-900 md:text-3xl">A citizen-readable view of the priorities</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area) => (
              <article key={area.title} className="border border-paper-line bg-white p-5">
                <h3 className="font-display text-sm font-bold text-green-900">{area.title}</h3>
                <p className="mt-2 text-xs leading-5 text-ink-muted">{area.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 border-l-2 border-gold-500 bg-white p-5">
            <p className="text-xs leading-5 text-ink-muted">Board presentation note: this page is a public-facing summary of the published plan. Before formal adoption as an official dashboard, the Municipality should validate the plan version, confirm the current implementation period, and publish approved project status, annual budget allocations, expenditure and performance results from authorised records.</p>
          </div>
          <div className="mt-7">
            <Link href="/public-participation" className="link-arrow">Explore public participation <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
