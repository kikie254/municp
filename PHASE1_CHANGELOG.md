# PHASE 1 — CHANGELOG

**Project:** Iten–Tambach Municipality website (Next.js 15 / React 19 / TypeScript)
**Phase:** 1 — Critical professional corrections
**Delivered:** `iten-tambach-municipality-phase1-professional.zip`
**Original archive:** preserved untouched (`original.zip` / `original-backup.zip`, not modified)

This phase is a **controlled correction of the existing project**. No page template, route, colour,
typeface, header/footer structure, hero layout or card style was redesigned or removed. Where a
correction required a visible change, it is listed below with the reason.

---

## 1. Summary of what changed

| # | Area | Change | Files |
|---|---|---|---|
| 1 | Content integrity | Added a single publication-status policy (`verified` / `pending-verification` / `demonstration`) with one filter helper, and consumed it everywhere sample content could leak | `lib/content.ts` (new), `lib/data/news.ts`, `lib/data/projects.ts` |
| 2 | Homepage | Removed invented statistics; replaced with counts recomputed from `lib/data` at build time. Removed sample project cards and sample news cards from the promotional sections; replaced with professional empty states | `app/page.tsx`, `components/EmptyState.tsx` (new) |
| 3 | Homepage copy | Removed the "official digital platform" framing and the claim that content is already official | `app/page.tsx`, `components/SiteFooter.tsx` |
| 4 | Search | Site search indexes published records only. Demonstration projects/news can no longer surface in results | `components/SearchDialog.tsx` |
| 5 | XML sitemap | Demonstration project and news routes removed from `sitemap.xml` (23 URLs, was 41+) | `app/sitemap.ts` |
| 6 | Indexability | Demonstration detail routes now send `robots: index:false, follow:true`; verified on the built server (all 18 sample routes report `noindex, follow`) | `app/projects/[slug]/page.tsx`, `app/news/[slug]/page.tsx` |
| 7 | Admin preview | Removed the `?key=<value>` access-key gate entirely; route withdrawn by default and 404s; nav/footer/sitemap/mobile-drawer entries gated on the flag | `middleware.ts`, `lib/site.ts`, `components/SiteHeader.tsx`, `app/sitemap-page/page.tsx`, `app/robots.ts`, `next.config.ts`, `.env.example` |
| 8 | Mobile navigation | Hardcoded "Administration Preview" link removed from the drawer; now conditional on `adminPreviewEnabled` | `components/SiteHeader.tsx` |
| 9 | Desktop navigation | Dropdowns were hover-only and unreachable by keyboard. Now open on focus, expose `aria-expanded` / `aria-controls`, close on focus-out, and close on `Escape` returning focus to the parent link | `components/SiteHeader.tsx` |
| 10 | Mobile nav a11y | Trigger gains `aria-controls`, `aria-haspopup="dialog"`; drawer gains `id="mobile-navigation"` and keeps `role="dialog"` / `aria-modal` / `aria-label` | `components/SiteHeader.tsx` |
| 11 | Documents | `verifiedFile: boolean` replaced with a three-state `verification` field plus a plain-language `note`. Badges now state what was actually checked. One wrong title corrected. No PDF was created, re-typed or substituted | `lib/data/documents.ts`, `components/DocumentCard.tsx`, `app/resources/page.tsx` |
| 12 | Documents UI | "Files verified on county site" replaced by "Content-checked files" and "File checks only"; library intro now explains the difference between a resolving link and an authenticated document | `app/resources/page.tsx` |
| 13 | Contact details | Unconfirmed office/phone/email/postal values retained (so nothing breaks) but rendered with an explicit pending-verification notice; single flag `site.contactVerification` switches it off once confirmed | `lib/site.ts`, `components/ContactPending.tsx` (new), `app/contact/page.tsx`, `components/SiteFooter.tsx` |
| 14 | Office hours | Removed the instruction to call "during official working hours" — hours are unconfirmed | `app/services/[slug]/page.tsx` |
| 15 | Governance | Board composition retained but the source is now disclosed: the County-served charter file is headed "Model Municipal Charter"; the Municipality must confirm it is the adopted version | `app/governance/page.tsx` |
| 16 | Privacy policy | Rewritten as a labelled draft: separates what is collected today from what operational forms would collect, marks clauses pending approval, removes compliance implications | `app/privacy/page.tsx` |
| 17 | Terms of use | Rewritten as a labelled draft: removes the "prepared for presentation to leadership" and accuracy claims, states the real status of sample content, documents and photography | `app/terms/page.tsx` |
| 18 | Accessibility statement | Removed the implied conformance claim; now records implemented behaviour, this phase's corrections, and an explicit "still to be done" list including an independent audit | `app/accessibility/page.tsx` |
| 19 | Global notice | One-line pre-launch review strip above the masthead so a visitor is never led to assume the site is an adopted official publication | `components/ReviewBanner.tsx` (new), `app/layout.tsx` |
| 20 | FAQ content | Six answers rewritten to remove unverified specifics and to stop implying forms are operational or that documents are authenticated | `lib/data/services.ts` |
| 21 | Projects page | Split into "Verified municipal projects" (empty state) and "Template preview — not official records"; counts relabelled; banned the previous framing that presented counts as municipal achievements | `app/projects/page.tsx` |
| 22 | News page | Lead story and listing explicitly framed as template examples rather than municipal announcements | `app/news/page.tsx` |
| 23 | Test harness | `scripts/verify-routes.mjs` no longer expects `/admin-preview` to be 200; it asserts 404 and that no dashboard markup is served. Output path fixed so the script runs from a clean checkout | `scripts/verify-routes.mjs` |
| 24 | Docs | `README.md` verification status and environment-variable tables corrected; `ASSET_CREDITS.md` rebuilt as an asset register | `README.md`, `ASSET_CREDITS.md` |

---

## 2. What was deliberately **not** changed

- **Design system.** Deep green / gold palette (`tailwind.config.ts`), Manrope + Inter self-hosted
  fonts, spacing scale, shadows, card styling, `.shell` container, hero and `PageHero` layouts,
  section headings, CTA band, footer structure — all untouched.
- **Route structure.** All 42 route files remain. 15 static + 8 service + 10 project + 8 news = 41
  public content routes plus `/admin-preview` (withdrawn by default) and the generated
  `sitemap.xml` / `robots.txt`.
- **Working features.** Document search/filter/sort, news filter/search, project filter, FAQ
  accordion, search dialog, back-to-top, print styles, reduced-motion support, security headers,
  JSON-LD — all preserved and re-tested.
- **Photography and crest.** Not replaced, not recoloured, not redrawn, no AI substitution. Rights
  are documented as unresolved (see `ASSET_CREDITS.md`) rather than papered over.
- **Datasets.** `lib/data/news.ts` (8 articles), `lib/data/projects.ts` (10 records),
  `lib/data/documents.ts` (32 documents) are retained in full as labelled templates — nothing was
  deleted, so no page renders empty and the content can be replaced in place.
- **Dependency set and lockfile.** `package.json` unchanged; `package-lock.json` byte-identical;
  `npm ci` used throughout.

---

## 3. Functionality disabled or restricted

| Item | Previous behaviour | Now |
|---|---|---|
| `/admin-preview` | Reachable by default; footer + sitemap links; optional `?key=` shared secret | 404 by default; all links removed; no key parameter exists; opt in with `NEXT_PUBLIC_ADMIN_PREVIEW=enabled` for a private review build only |
| Sample projects in homepage "Projects" section | Displayed as cards with a "Sample" chip | Not displayed at all; replaced by an empty state |
| Sample news in homepage "Newsroom" section | Displayed as lead story + two cards | Not displayed at all; replaced by an empty state |
| Sample projects/news in site search | Indexed | Excluded |
| Sample projects/news in `sitemap.xml` | Submitted to search engines | Excluded |
| Sample project/news detail pages | Indexable | `noindex, follow` |
| Sample notices in the news sidebar | Listed as "Public notices" | Listed under "Public notices — template examples" |

Nothing else was switched off. No form, filter, page or document link was removed.

---

## 4. Outstanding work (not Phase 1)

1. Municipal approval of every item in `MUNICIPAL_APPROVAL_CHECKLIST.md`.
2. Photography: licence clearance or replacement — **launch blocker**.
3. Verified project, news and public-notice data supplied by the Municipality.
4. Written confirmation of contact details, office hours and office holders.
5. Legal review and adoption of the privacy notice and terms of use.
6. An independent accessibility audit and publication of the result.
7. A real administration system (server-side authentication, roles, audit log) if one is wanted —
   explicitly out of scope; the preview page must not be presented as one.
8. Manual browser QA (Safari/iOS, Android Chrome, screen reader) — not runnable in this environment.

---

## 5. Verification performed in this phase

All results below come from commands run against this build, not from the previous revision's claims.

| Check | Command | Result |
|---|---|---|
| Clean install | `npm ci` | **PASS** — 363 packages, no lockfile drift |
| Lint | `npx eslint .` | **PASS** — 0 errors, 0 warnings |
| Types | `npx tsc --noEmit` | **PASS** — no output |
| Production build | `npm run build` | **PASS** — 41 content routes prerendered + sitemap/robots |
| Routes | `node scripts/verify-routes.mjs` | **PASS** — 41/41 HTTP 200 |
| Canonical / h1 / description | same | **PASS** — none missing, exactly one `h1` per route, no description under 70 chars |
| Internal links | same | **PASS** — 78 distinct internal hrefs, every one < 400 |
| Public assets | same | **PASS** — 34/34 HTTP 200 |
| 404 handling | same | **PASS** — unknown route 404s with the custom page |
| Admin preview withdrawn | same | **PASS** — `/admin-preview` → 404, no dashboard markup in body |
| Sample content leak into homepage | direct HTML inspection | **PASS** — no sample slug, title or chip in `/` |
| Client-bundle secrets | `grep` over `.next/static` | **PASS** — no `ADMIN_PREVIEW_KEY`, no `?key=`, no secret material |
| Security headers | HTTP response headers | **PASS** — nosniff, SAMEORIGIN, referrer policy, permissions policy, no `X-Powered-By` |

Not run (environment limits, recorded honestly): manual browser QA, screen-reader testing,
independent accessibility audit, external link health for the County site beyond the document
endpoints already requested in §Documents of the audit report.
