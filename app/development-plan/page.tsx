import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Gauge, Landmark, MapPinned, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Integrated Development Plan 2025–2029 | Iten-Tambach Municipality",
  description: "A public-facing overview of the approved Iten Tambach Municipality Integrated Development Plan 2025–2029.",
};

const thematicAllocations = [
  { name: "Urban Governance", amount: "KSh 276,250,000", share: 2.18 },
  { name: "Land Use Planning, Housing and Human Settlements", amount: "KSh 530,100,000", share: 4.19 },
  { name: "Urban Infrastructure and Basic Services", amount: "KSh 9,453,227,000", share: 74.71 },
  { name: "Economic Development and Investment", amount: "KSh 260,000,000", share: 2.05 },
  { name: "Sports, Culture, Tourism and Recreation", amount: "KSh 2,134,500,000", share: 16.87 },
];

const flagshipProjects = [
  { name: "Integrated Roads & Mobility Program", output: "Upgrade 60 km of feeder and access roads", timeline: "2025–2030", estimate: "KSh 1,500 million", lead: "Roads Unit" },
  { name: "Modern Sewerage & Sanitation Project", output: "Construct sewer lines and treatment plants; 40 km of sewer lines listed as a key output", timeline: "2025–2030", estimate: "KSh 1,200 million", lead: "Sanitation Unit" },
  { name: "Solid Waste Management & Recycling Park", output: "Build recycling and composting facilities; recycling park operational", timeline: "2025–2029", estimate: "KSh 500 million", lead: "Waste Unit" },
  { name: "Smart Street Lighting & Safety Project", output: "Install 200 solar streetlights", timeline: "2025–2027", estimate: "KSh 450 million", lead: "Energy Unit" },
  { name: "Fire & Rescue Modernization Project", output: "Repair fire station and train staff", timeline: "2025–2028", estimate: "KSh 650 million", lead: "Fire & Rescue Unit" },
  { name: "Iten Potato Processing Plant", output: "Establish an Irish potato processing plant", timeline: "2025–2028", estimate: "KSh 800 million", lead: "Agriculture Unit" },
  { name: "Municipal SME & Innovation Hub", output: "Establish an SME incubation and training hub", timeline: "2025–2030", estimate: "KSh 400 million", lead: "SME Unit" },
  { name: "Regional Market Redevelopment Project", output: "Renovate the central market and build a wholesale hub", timeline: "2025–2029", estimate: "KSh 600 million", lead: "Trade Unit" },
  { name: "Diaspora Investment & Financing Initiative", output: "Launch diaspora bonds and outreach programmes", timeline: "2025–2030", estimate: "KSh 300 million", lead: "Investment Promotion" },
  { name: "Agro-Industrial Park", output: "Establish an agro-industrial cluster", timeline: "2025–2030", estimate: "KSh 1,200 million", lead: "Industry Unit" },
  { name: "Iten Sports Park & Kamariny Hub", output: "Develop a world-class sports park", timeline: "2025–2029", estimate: "KSh 1,500 million", lead: "Sports Unit" },
  { name: "High-Performance Training Centre", output: "Construct athlete training facilities", timeline: "2025–2028", estimate: "KSh 800 million", lead: "Sports Unit" },
];

const focusAreas = [
  { title: "Urban Governance", body: "Strengthen institutional capacity, legal compliance, public participation, revenue enhancement, by-law enforcement, digitized services and accountability." },
  { title: "Land Use Planning, Housing and Human Settlements", body: "Review the Integrated Physical and Land Use Development Plan, prepare zoning plans, strengthen development control, support affordable housing and upgrade informal settlements." },
  { title: "Urban Infrastructure and Basic Services", body: "Improve roads, walkways, drainage, street lighting, water supply, sanitation and solid waste management, including traffic and parking solutions in the CBD." },
  { title: "Economic Development and Investment", body: "Build on athletics, sports tourism, agriculture and trade through value addition, MSME support, investment promotion and industrial development." },
  { title: "Sports, Tourism, Recreation and Social Development", body: "Upgrade sports facilities, develop adventure and eco-tourism, recreational parks and trails, and strengthen cultural and creative industries." },
];

export default function DevelopmentPlanPage() {
  return (
    <>
      <PageHero
        eyebrow="Planning and accountability"
        title="Integrated Development Plan 2025–2029"
        intro="The approved five-year framework for guiding urban growth, service delivery and socio-economic transformation in Iten Tambach Municipality."
        image="/images/iten-town-aerial.jpg"
        imageAlt="Aerial view of Iten town and surrounding highlands"
        crumbs={[{ label: "Integrated Development Plan" }]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="shell">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-paper-line bg-paper-warm p-5">
              <p className="eyebrow">Planning horizon</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">2025–2029</p>
              <p className="mt-1 text-xs text-ink-muted">Five-year Integrated Development Plan.</p>
            </div>
            <div className="border border-paper-line bg-paper-warm p-5">
              <p className="eyebrow">Total resource requirement</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">KSh 12.654B</p>
              <p className="mt-1 text-xs text-ink-muted">Thematic-area estimates in the approved plan.</p>
            </div>
            <div className="border border-paper-line bg-paper-warm p-5">
              <p className="eyebrow">Thematic areas</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-green-900">5</p>
              <p className="mt-1 text-xs text-ink-muted">The five areas that organise the plan’s priorities.</p>
            </div>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow">The development framework</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-green-900 md:text-3xl">A coordinated plan for the Municipality</h2>
              <p className="mt-4 text-sm leading-7 text-ink-soft">
                The approved IDeP sets out the Municipality’s priorities for urban governance; land use, housing and human settlements; infrastructure and basic services; economic development and investment; and sports, tourism, recreation and social development.
              </p>
              <p className="mt-3 text-sm leading-7 text-ink-soft">
                The plan identifies inadequate water supply, the absence of a sewerage system, gaps in road and drainage infrastructure, limited affordable housing, weak development control and constrained municipal revenue as key challenges to address.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="https://elgeyomarakwet.go.ke/iten-municipality-documents/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FileText aria-hidden="true" /> County document centre <ArrowUpRight aria-hidden="true" />
                </a>
                <Link href="/resources?category=Integrated+Development+Plans" className="btn btn-outline">
                  Browse related plans
                </Link>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-ink-muted">The approved 2026 second-edition PDF was supplied for this page review. The County document centre is linked for official publication access; this page does not claim that the uploaded PDF has been independently published there.</p>
            </div>

            <div className="border border-paper-line bg-paper-warm p-6">
              <div className="flex items-center gap-3">
                <Landmark className="h-5 w-5 text-gold-600" aria-hidden="true" />
                <h3 className="font-display text-base font-bold text-green-900">Resource mobilisation</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink-muted">The plan categorises the overall requirement into County funding and external funding. Table 14 provides the thematic totals but does not expose a verifiable split between the two columns in the supplied copy.</p>
              <div className="mt-5 border-t border-paper-line pt-4">
                <p className="text-xs font-semibold text-green-900">Funding approaches identified in the plan</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-ink-soft">
                  <li>• Own-source revenue</li>
                  <li>• Equitable share of national revenue</li>
                  <li>• Development partners and conditional grants</li>
                  <li>• Public-private partnerships (PPPs)</li>
                </ul>
              </div>
              <p className="mt-5 border-t border-paper-line pt-4 text-[11px] leading-5 text-ink-muted">These are resource mobilisation strategies, not evidence that the full amount has been appropriated, secured or spent.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-warm py-12 md:py-16">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Thematic resource requirements</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-green-900 md:text-3xl">Where the plan directs resources</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">Values reproduce the thematic totals in Table 14 of the approved IDeP. They are estimates, not actual expenditure or confirmed funding.</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {thematicAllocations.map((item) => (
              <div key={item.name} className="border border-paper-line bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-bold text-green-900">{item.name}</h3>
                  <span className="shrink-0 font-display text-base font-extrabold text-green-800">{item.amount}</span>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden bg-paper-warm">
                  <div className="h-full bg-green-700" style={{ width: item.share + "%" }} />
                </div>
                <p className="mt-2 text-[11px] text-ink-muted">{item.share.toFixed(2)}% of total resource requirement (calculated from Table 14)</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-paper-line pt-5">
            <p className="text-sm font-bold text-green-900">Total resource requirement</p>
            <p className="font-display text-xl font-extrabold tabular-nums text-green-900">KSh 12,654,077,000</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Flagship projects</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-green-900 md:text-3xl">Selected projects in the implementation framework</h2>
            </div>
            <span className="hidden text-xs text-ink-muted sm:inline">Estimates in KSh millions</span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted">The examples below are taken from the plan’s project framework. The stated timelines are reproduced as written; some projects run to 2030 even though the overall IDeP period is 2025–2029.</p>
          <div className="mt-6 overflow-x-auto border border-paper-line">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-green-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Project</th>
                  <th className="px-4 py-3 font-semibold">Key output / activity</th>
                  <th className="px-4 py-3 font-semibold">Timeline</th>
                  <th className="px-4 py-3 text-right font-semibold">Estimated cost</th>
                  <th className="px-4 py-3 font-semibold">Lead agency / unit</th>
                </tr>
              </thead>
              <tbody>
                {flagshipProjects.map((project, index) => (
                  <tr key={project.name} className={index % 2 === 0 ? "bg-white" : "bg-paper-warm"}>
                    <td className="px-4 py-3 font-semibold text-green-900">{project.name}</td>
                    <td className="px-4 py-3 text-ink-soft">{project.output}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{project.timeline}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-semibold tabular-nums text-green-900">{project.estimate}</td>
                    <td className="px-4 py-3 text-ink-soft">{project.lead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-ink-muted">This is a selected extract, not the complete project register. Project estimates should not be added to the thematic totals as a separate funding pool.</p>
        </div>
      </section>

      <section className="bg-green-950 py-12 text-white md:py-16">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-light">Monitoring and evaluation</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">Track delivery. Report progress. Improve services.</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Chapter Six sets out the arrangements for monitoring IDeP implementation, including data collection, analysis, reporting and information sharing.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="border border-white/15 bg-white/[0.05] p-5">
              <Gauge className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold">Monitoring responsibilities</h3>
              <p className="mt-2 text-xs leading-5 text-white/65">The County Monitoring & Evaluation Committee (COMEC) is responsible for outcome-level indicators. Sector M&E committees monitor service-delivery indicators.</p>
            </div>
            <div className="border border-white/15 bg-white/[0.05] p-5">
              <FileText className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold">Reporting schedule</h3>
              <p className="mt-2 text-xs leading-5 text-white/65">Operational monitoring is monthly, quarterly and annually. The Municipality prepares quarterly and annual performance reports for County review and public dissemination.</p>
            </div>
            <div className="border border-white/15 bg-white/[0.05] p-5">
              <Users className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold">Board oversight</h3>
              <p className="mt-2 text-xs leading-5 text-white/65">The Municipal Board conducts customer satisfaction surveys and project field visits, and forwards collected data to sector M&E structures and the County data desk.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/15 pt-6">
            <MapPinned className="h-4 w-4 text-gold-400" aria-hidden="true" />
            <p className="text-xs text-white/70">Implementation involves the Municipal Board and Management, County Government, national agencies, development partners, business community and Citizen Fora.</p>
          </div>
        </div>
      </section>

      <section className="bg-paper-warm py-12 md:py-16">
        <div className="shell">
          <p className="eyebrow">Five thematic areas</p>
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
            <p className="text-xs leading-5 text-ink-muted">Board presentation note: this page is a summary of the approved IDeP, not a live implementation dashboard. Project status, annual budget allocations, expenditure and performance results should only be published when validated against authorised municipal records.</p>
          </div>
          <div className="mt-7">
            <Link href="/public-participation" className="link-arrow">Explore public participation <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
