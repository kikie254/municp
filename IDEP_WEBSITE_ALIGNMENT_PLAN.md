# Iten–Tambach Municipality Website — IDeP Alignment Plan

**Status:** Assessment and implementation plan  
**Baseline:** Existing Next.js 15 App Router website on `master`  
**Design constraint:** Preserve the current layout, visual identity, navigation pattern, component structure and responsive behaviour. This plan does not authorise a redesign.

## 1. Executive assessment

The current website has a sound technical and presentation foundation: 41 public content routes, eight service areas, a document centre, governance, public participation, investment, project/news templates, search, and four demonstration forms.

The main gap is not the absence of pages. It is the distance between the IDeP's sector programmes, outputs, indicators and reporting model and the information currently exposed through those pages. Several sections remain generic, and project/news records are explicitly demonstration content. They must not be presented as official delivery records.

A critical content defect also requires correction: the FAQ entries in `lib/data/services.ts` claim that feedback and enquiry submissions are recorded in a municipal system and receive reference numbers, while the README and form implementation describe frontend-only demonstrations that do not transmit, store or register submissions. Those claims must be removed or the forms must be connected to an approved, secure backend before they are made.

## 2. IDeP-to-site gap matrix

| IDeP area | Existing site surface | Gap / required improvement |
|---|---|---|
| Water services | Services, resources | Explain water access, supply infrastructure, source protection, billing and service-management priorities without implying the Municipality directly operates services where responsibility belongs elsewhere. |
| Liquid waste and sanitation | Services, resources | Make sewerage, treatment, effluent monitoring and sanitation priorities discoverable; clearly distinguish planned outputs from completed assets. |
| Solid waste management | Existing service page | Connect the published 2025 policy/plan to practical resident guidance, waste reduction, collection information and environmental responsibilities. Do not invent collection schedules. |
| Community/environmental health | Services, resources | Surface food safety, public health education and environmental health priorities with verified responsible-office information. |
| Urban transport | Infrastructure service, projects | Explain road improvement, routine maintenance, walkways, non-motorised transport, parking and transport coordination. Identify the responsible road authority for each published item. |
| Public works, housing and drainage | Infrastructure service, investment | Improve visibility of building standards, development control, stormwater drainage and housing priorities. Do not imply online planning approvals exist. |
| Energy | Infrastructure/service content | Add the IDeP's electricity access and green-energy priorities to the relevant existing content surface. |
| Sports and social empowerment | Projects, news, public spaces | Give athletics, sports facilities, diverse disciplines, recreation, libraries, social facilities and inclusion clear coverage. Distinguish existing facilities from proposals and targets. |
| Tourism, culture and heritage | About, investment, news | Explain sports tourism, natural and cultural heritage, tourism products, visitor information and destination promotion using verified details. |
| Trade and enterprise | Investment, services | Expand trader/business information, markets, enterprise development and investment enquiry guidance. Do not publish unapproved incentives, plots, fees or availability claims. |
| Municipal administration and governance | Governance, about, resources | Explain institutional roles, public accountability, municipal administration and the applicable governance instruments. Confirm adoption status before describing draft instruments as binding. |
| Disaster management and emergency services | Services, contact | Surface risk-awareness and emergency coordination information. Publish emergency contacts only after official confirmation. |
| Monitoring and evaluation | Resources, projects, news | Add an accessible performance/reporting pathway for approved quarterly and annual reports, indicators, targets and implementation updates. This is a major missing public-accountability capability. |
| Public participation | Existing dedicated page and feedback | Link each consultation to its official notice, dates, venue, submission method, supporting documents and subsequent report. Do not invent forum dates or claim submissions are received. |

## 3. Existing architecture to preserve

- Keep all current routes and their established page templates unless a route is demonstrably misleading or redundant.
- Keep the existing header, footer, typography, colours, spacing, cards, responsive breakpoints and interaction patterns.
- Extend existing typed data modules and page components rather than creating parallel page systems.
- Reuse the current resources/document centre for approved IDeP reports and supporting plans.
- Reuse the current project/news templates only for verified municipal records; keep sample records clearly labelled and excluded from public claims, search and indexing as currently intended.
- Preserve existing SEO, security headers, keyboard navigation and accessibility work.

## 4. Implementation sequence

### Phase A — Content integrity and source mapping
1. Correct the FAQ/form contradiction: forms are demonstrations until a real approved submission service exists.
2. Audit every service, priority, FAQ, page claim and document record against its source.
3. Label each claim as verified, pending municipal confirmation, or demonstration.
4. Record the IDeP page/table supporting each proposed website update.
5. Do not promote IDeP targets or budgets to actual achievements or current expenditure.

### Phase B — IDeP content alignment (no layout changes)
1. Enrich the existing eight service pages with the IDeP's relevant mandates, objectives and strategies.
2. Strengthen the existing Investment page with tourism, trade, enterprise and business-enquiry information.
3. Strengthen Governance and Public Participation with institutional roles and the IDeP reporting/participation model.
4. Add monitoring and evaluation information within the existing resources/governance surfaces.
5. Update homepage copy and existing priority summaries to reflect the IDeP's real sector priorities without adding or rearranging sections.

### Phase C — Verified public information
1. Replace sample project/news entries only when official project or communication records are supplied.
2. For each project, require source, location, responsible agency, approved status, dates, budget source, progress evidence and last-updated date.
3. For each notice, require issuing office, publication date, deadline/event details and authoritative source.
4. Add quarterly/annual performance reports only after publication and approval are confirmed.

### Phase D — Functional and quality assurance
1. Connect forms only after an approved recipient, data-protection notice, backend, access controls, spam controls and retention process are agreed.
2. Test all routes, links, document downloads, search, forms and responsive breakpoints.
3. Conduct keyboard and screen-reader checks; do not claim WCAG conformance without an audit.
4. Run lint, typecheck, production build and route/link smoke tests.
5. Obtain municipal content, crest and photography permissions before public launch.

## 5. Critical defects / launch blockers

- **Form truthfulness:** FAQ answers currently claim data is stored and reference numbers are issued, contradicting the frontend-only form implementation. Fix before publication.
- **Institutional facts:** Board/office-holder details, contact details, office hours and some governance claims require written confirmation.
- **Asset rights:** Existing audit records unknown licences for the photographs and no written permission for the crest. Obtain clearance or replace with approved assets.
- **Demonstration content:** Do not publish sample project/news entries as official municipal records.
- **Document accuracy:** A working PDF URL does not prove that its contents, title, date or approval status are correct.
- **Plan currency:** Confirm whether the supplied IDeP is the currently operative/adopted version before labelling it as the authoritative current plan.

## 6. Data model recommendation

For future public project, programme and performance records, retain provenance and status alongside display content. Minimum fields should include:

- `verificationStatus`: `verified`, `pending-verification`, or `demonstration`
- `sourceTitle`, `sourceUrl`, `sourcePage`
- `responsibleInstitution`
- `lastReviewedAt`
- `planPeriod` and `reportingPeriod`, where applicable
- `targetValue`, `actualValue`, `unit`, and `reportingDate` for indicators

Never infer an actual value from an annual target. Never present a planned output as a completed project.

## 7. Acceptance criteria

- No visual/layout regression: existing page structure, styling and responsive navigation remain unchanged.
- Every new IDeP-derived claim has a traceable source and page reference.
- No sample project, news item, target, budget or planned output is represented as a verified achievement.
- Forms accurately state whether data is transmitted, stored or acknowledged.
- All existing routes and links pass the repository's automated checks.
- Content requiring municipal approval is visibly held as pending rather than silently published as fact.

## 8. Source basis

Primary source: supplied *Iten Municipality Integrated Development Plan* PDF, especially Chapter Four (sector objectives and strategies), the programme/output/target tables (approximately pp. 35–41), the resource summary (p. 47), and Chapter Six (monitoring and evaluation, pp. 49 onward).

Repository baseline: `README.md`, `PHASE1_AUDIT_REPORT.md`, `MUNICIPAL_APPROVAL_CHECKLIST.md`, `lib/data/services.ts`, `lib/data/projects.ts`, `lib/data/news.ts`, and `lib/site.ts`.

**Important:** This document is an implementation plan, not municipal approval. The IDeP's historic targets, estimates and proposed outputs must be checked against current approved budgets, annual plans and implementation reports before being published as current status.
