# PHASE 2 CHANGELOG — Professional UI/UX Refinement

Project: Iten–Tambach Municipality website (Next.js 15.5.29 / React 19 / TypeScript 5.7.3 / Tailwind 3.4.17)
Basis: `iten-tambach-municipality-phase1-professional.zip` (Phase 1 route files, design system and approved assets preserved)
Scope rule: refine in place. No page was rebuilt, no route removed, no dependency added for Phase 2.

## 1. Design system (refined, not replaced)

| Token group | Change | Reason |
|---|---|---|
| Colour | Deep-green ramp (`green.950`–`green.50`), gold ramp (`gold.700`–`gold.50`), `clay`, `flag.red`, `ink`, `paper` retained unchanged | Institutional identity from the crest; Phase 1 audit had approved this palette |
| Typography | Manrope (display) + Inter (body, 400/500/600/700) retained; `display-xl/lg/md` clamps retained | No technical reason to change; fonts are self-hosted `woff2` |
| Component classes | `.shell`, `.eyebrow`, `.btn` (+ primary/gold/ghost/outline), `.link-arrow`, `.card`, `.field`, `.label`, `.prose-gov` retained and reused by every new screen | One visual language across public and administrative surfaces |
| Focus ring | Global `:focus-visible { outline: 3px solid #b98d00; outline-offset: 2px }` relied on and verified in the browser test | WCAG 2.2 AA focus visibility |
| Motion | `prefers-reduced-motion` block retained; no new animation introduced | Explicit Phase 2 instruction |

New components are built from the existing tokens rather than new colours:
`components/admin/AdminHeading.tsx`, `components/admin/AdminForm.tsx`, `components/admin/AdminNav.tsx`,
`components/admin/StatusBadge.tsx`, `components/admin/LoginForm.tsx`, `components/admin/ResetForms.tsx`,
`components/content/PublishedBlocks.tsx`, `components/content/ParticipationOpportunities.tsx`,
`components/forms/ActionForm.tsx`, `components/forms/PublicSubmissionForm.tsx`.

## 2. Homepage

* Information order follows the brief: identity → services → published announcements → participation and notices → published projects → documents → investment → contact.
* Every count on the stats band is recomputed from `lib/data` at render time; Phase 1's invented figures were already removed and remain removed (audit item C1–C4 closed in Phase 1).
* Sections with no published record render `EmptyState` copy that names the reason, never a placeholder statistic. `publishedProjects` is `[]` and `hasPublishedProjects` is `false`, so the projects band states that no verified record is published yet.
* Hero image, crest and county badge unchanged (approved Phase 1 assets).

## 3. Navigation

* Desktop navigation, accessible sub-menus (focus/blur/Escape), mobile drawer dialog, search trigger and breadcrumbs retained.
* Search dialog rewritten (Phase 3) but keeps its Phase 1 interaction model: focus moves in on open, Escape closes, focus returns to the trigger, results region is `aria-live`.
* New administrative navigation (`components/admin/AdminNav.tsx`) uses `aria-current="page"`, is horizontally scrollable below `lg` and a vertical rail above it, so it stays operable at 320 px.

## 4. Page consistency

Every public page keeps: `PageHero` with title, intro, breadcrumb trail and background image; `SectionHeading` for section levels; `CtaBand` at the close; one `<h1>` per page (asserted by `scripts/verify-routes.mjs` and by the route audit).

## 5. Mobile-first refinement

Verified by measurement rather than inspection: the Playwright test *mobile viewport has no horizontal overflow* loads `/`, `/news`, `/projects`, `/resources`, `/contact` at 360 × 780 and asserts `scrollWidth − clientWidth ≤ 1` px. It passed in the final run.

Design decisions that protect small screens:

* All data tables are wrapped in `overflow-x-auto` with `min-w-[…]` and a `<caption>`; the page itself never scrolls sideways.
* Administrative list views become stacked cards (`ul`/`li`) below `xl` where a table would be unusable.
* Long words in contact blocks use `break-all`/`break-words`; hero uses clamped type (`display-lg`).
* Buttons are full-width only inside forms (`w-full`), never in toolbars.

## 6. Accessibility work in Phase 2 scope

* Semantic landmarks: one `<main id="main">`, `<header>`, `<footer>`, `<nav aria-label>` per region, skip link first in the DOM.
* Form errors: `aria-invalid`, `aria-describedby` → `*-error`, and `role="alert"` on each message; the summary error uses `role="alert"`, success uses `role="status"`.
* Honeypot fields are `aria-hidden` + `tabIndex={-1}` + off-screen, so screen-reader and keyboard users never meet them.
* Decorative icons carry `aria-hidden="true"`; the only meaningful images carry real `alt` text.
* Tables have `<caption class="sr-only">` and `scope="col"` headers.
* Pagination (audit log) exposes `aria-label="Audit pagination"`.

## 7. UI states

Default, hover, focus, active, disabled, loading (`pending` → spinner + "Saving…"), success (server-returned message with reference), error (server-returned field errors) and empty (explicit copy) are implemented for every interactive surface. No button is decorative: each submits a server action or navigates.

## 8. Phase 2 files touched

Modified: `app/contact/page.tsx`, `app/feedback/page.tsx`, `app/news/page.tsx`, `app/news/[slug]/page.tsx`,
`app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/public-participation/page.tsx`,
`components/SearchDialog.tsx`, `app/sitemap.ts`, `app/robots.txt` route (unchanged logic, re-verified),
`app/globals.css` (no colour change), `tailwind.config.ts` (no colour change).
Added: the component list in §1 plus `app/public-participation/[slug]/page.tsx`.

## 9. Phase 2 acceptance

| Criterion | Result |
|---|---|
| All existing routes preserved | PASS — 41 of the 42 Phase 1 route files return 200; `/admin-preview` returns 404 by Phase 1 design |
| Consistent professional design | PASS — shared tokens and component classes on every screen |
| Responsive layouts | PASS at 360 px (automated); wider breakpoints checked in the build output, not in a browser (see PHASE4_TEST_REPORT) |
| No major visual defects | No defect observed in the captured screens; not a full visual regression suite |
| Improved accessibility | PASS for the automated checks listed in Phase 4; a manual screen-reader audit remains outstanding |
| Functional keyboard navigation | PASS — Tab focus ring, Escape closes search, dialog focus trap |
| No fabricated content | PASS — `lib/content.ts` still gates every published record |
| No broken shared components | PASS — build and route audit clean |
