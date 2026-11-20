# Iten-Tambach Municipality — Official Website

Next.js 15 (App Router) website for **Iten-Tambach Municipality, County Government of Elgeyo Marakwet, Republic of Kenya**.

Frontend-only: content lives in typed local data modules under `lib/data/`, with no database, no paid API and no external service. Deploys to Vercel as a static/SSR Next.js app.

**Verification status of this revision (Phase 1):** `npm ci` (no lockfile drift), ESLint, `tsc --noEmit` and the production build all pass. A route sweep against a running production server returned **41/41 content routes at HTTP 200**, 34/34 public assets at 200, 0 broken internal links, and a 404 for `/admin-preview` (withdrawn by default). 18 demonstration project/news routes are served `noindex, follow` and are absent from `sitemap.xml`. What has *not* been verified is listed in §10 — read it before launch.

**Phase 1 changes:** see `PHASE1_CHANGELOG.md`, `PHASE1_AUDIT_REPORT.md` and `MUNICIPAL_APPROVAL_CHECKLIST.md`. Demonstration records, unverified document metadata and unconfirmed contact details are now labelled or excluded rather than presented as municipal fact.

---

## 1. Quick start

Requires **Node.js 20.9+** (declared in `engines`).

```bash
npm ci                # clean install from the lockfile
npm run dev           # http://localhost:3000
npm run lint          # ESLint (flat config, next/core-web-vitals + next/typescript)
npm run typecheck     # tsc --noEmit
npm run build         # production build
npm start             # serve the production build
npm run check:source  # dependency-free check that literal /images references exist
```

`npm ci` (not `npm install`) is the supported install: it is what CI and Vercel use, and it fails loudly if `package.json` and `package-lock.json` ever drift apart.

### Route/link smoke test

`scripts/verify-routes.mjs` starts from a running server and crawls the built site — every route, every public asset, every internal `href`, canonical tags, `<h1>` counts, `sitemap.xml`, `robots.txt` and the security headers:

```bash
npm run build
npm start &                                   # serves on :3000 by default
BASE=http://127.0.0.1:3000 SITE_ORIGIN=https://your-domain.example \
  node scripts/verify-routes.mjs
```

Set `SITE_ORIGIN` to the value of `NEXT_PUBLIC_SITE_URL` that was used for the build, so canonical URLs can be checked against it. Expect `41/41` content routes at 200, `34/34` assets at 200, no broken internal links, and `/admin-preview` at **404** (this is asserted, not a failure). Results are written to `logs/route-matrix.csv` inside the project.

---

## 2. Deployment on Vercel

1. Push this project (it sits at the repository root) to GitHub/GitLab.
2. Vercel → **Add New → Project** → import the repository.
3. Framework preset: **Next.js** (auto-detected). Leave build command `npm run build` and output `.next` at their defaults.
4. Set the environment variable:

   | Name | Value | Environments |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://<the real domain>`, no trailing slash | Production |

   This one variable drives `metadataBase`, every canonical URL, Open Graph URLs, `sitemap.xml` and `robots.txt`. No source edit is needed to change the domain.
5. Optional hardening variables:

   | Name | Value | Effect |
   |---|---|---|
   | `NEXT_PUBLIC_ADMIN_PREVIEW` | `disabled` | Removes `/admin-preview` (404) and its footer link from the public site |
   | `NEXT_PUBLIC_ADMIN_PREVIEW` | `enabled` | Build-time public flag. Leave unset for every public build: `/admin-preview` then returns 404 and no navigation, footer or sitemap entry exists. `enabled` is for a private review build only — it is **not** authentication. |

6. **Deploy.** `NEXT_PUBLIC_*` values are inlined at build time, so changing them requires a **redeploy**, not a restart.
7. Attach the custom domain under *Settings → Domains*, and make sure it matches `NEXT_PUBLIC_SITE_URL` exactly.
8. After deploying: submit `/sitemap.xml` to Google Search Console, then complete the browser QA in §10.

Self-hosting instead: `npm ci && npm run build && npm start` behind an HTTPS reverse proxy, with `NEXT_PUBLIC_SITE_URL` set at build time.

---

## 3. Routes (41 content pages + withdrawn preview + 2 generated files)

15 static + 8 service + 10 project + 8 news = **41 content pages**, plus `/admin-preview` (withdrawn by default, 404) and generated `/sitemap.xml` and `/robots.txt`. Counts come from `lib/data/`, not from this table; all 41 were confirmed to return HTTP 200 from a production server. The 18 demonstration `/projects/*` and `/news/*` routes are served `noindex, follow` and are excluded from `sitemap.xml` (23 URLs).

| Route | Purpose |
|---|---|
| `/` | Home — hero, quick access, about, priorities, projects, participation, documents, news, investment, CTA |
| `/about` | Mandate, vision, mission, seven core values |
| `/governance` | Board composition, administration, accountability |
| `/services` | Eight municipal service areas |
| `/services/[slug]` | 8 service detail pages |
| `/projects` | Filterable project gallery by category and status |
| `/projects/[slug]` | 10 project records — facts panel, objectives, related documents |
| `/public-participation` | Forums, notices, reports, how to participate, participation form |
| `/investment` | Investment potential, enterprise, trade, planning resources, enquiry form |
| `/resources` | Document centre — search, category, year, sort, preview/download |
| `/news` | Featured story, filterable newsroom, notices sidebar |
| `/news/[slug]` | 8 article templates |
| `/feedback` | Categories, grievance redress, FAQ accordion, feedback form |
| `/contact` | Contact cards, location panel, contact form |
| `/privacy`, `/accessibility`, `/terms` | Legal and accessibility statements |
| `/sitemap-page` | Human-readable site index |
| `/admin-preview` | Dashboard demonstration — `noindex`, no data, optional server-side key |
| `/sitemap.xml`, `/robots.txt` | Generated metadata routes |
| *(any unknown path)* | Custom `app/not-found.tsx`, HTTP 404, `noindex` |

---

## 4. Features

- Sticky header with dropdown navigation and a full-screen mobile drawer; skip-to-content link; back-to-top
- Site-wide search dialog across pages, documents, projects and news — keyboard operable, `Esc` to close, `aria-modal`
- Document library with query / category / year / sort, synced to the URL (`?q=`, `?category=`) so results are linkable
- Four validated forms (contact, feedback, participation, investment enquiry) with inline errors, `aria-invalid`, `aria-describedby`, `role="alert"`, focus moved to the first invalid field, and a preview panel
- JSON-LD `GovernmentOrganization` structured data on the homepage
- Security headers, `X-Robots-Tag` on the demo admin route, `poweredByHeader` disabled

**Forms do not transmit, store or register anything.** This is a frontend demonstration; every form states this on the page. There is no backend endpoint, no database and no email delivery. Wiring submissions to a real inbox or ticketing system is a separate piece of work (see §9).

---

## 5. Project structure

```
app/                    routes, layout, not-found, global CSS, sitemap.ts, robots.ts
components/             SiteHeader, SiteFooter, PageHero, cards, library, search, CTA band
components/forms/       Field, DemoNotice, useFormState, four form components
lib/site.ts             institution, contact, navigation, footer links, URL resolution
lib/data/               documents.ts, projects.ts, news.ts, services.ts, pages.ts
scripts/                check-source.mjs, verify-routes.mjs
public/brand/           Elgeyo Marakwet crest
public/images/          13 regional photographs (JPEG + WebP)
public/fonts/           self-hosted Inter and Manrope woff2
```

---

## 6. Brand and content provenance

- **Crest** — from the County Government's official site, reproduced without redrawing or recolouring. Confirm permission for municipal web use.
- **Colours** — sampled from the crest: deep green `#062B1C` / `#083A26`, gold `#E8B800`, flag red `#B0231A` (notices only), warm paper `#FAF8F3`.
- **Typography** — Manrope (display) and Inter (text), self-hosted (SIL OFL 1.1).
- **Documents** — titles, dates and file sizes follow the County's published Iten Municipality listing (32 records; 31 with `verifiedFile: true`, 1 routed to the official source page). Files are **never mirrored**; they link to the County's own endpoint. During this audit all 31 unique URLs returned `HTTP 200` with `application/pdf`. That proves the link resolves — not that the file is the document claimed, nor that redistribution is authorised.
- **Photography** — provenance **unknown** for all 13 files. No licence is claimed. See `ASSET_CREDITS.md`; this must be resolved before public launch.

---

## 7. Deliberate omissions

Intentionally absent because no verified information was supplied, and inventing it was out of scope:

- Names, photographs and biographies of Board members, the Chairperson or the Municipal Manager
- Budgets, contractors, start or completion dates, delivery claims for projects
- Confirmed forum dates, venues and agendas
- Service charges, turnaround times and office hours
- Investment incentives, land availability, tax exemptions, returns
- Office map coordinates

Project records, news articles and forum listings are labelled as sample content in the data files and in the UI (badges and notices on the relevant templates).

---

## 8. Institutional information still required

1. Verified names, designations and photographs of the Municipal Board, Chairperson and Municipal Manager
2. Approval of the proposed Vision and Mission statements
3. Verified project data — locations, status, dates, budgets, agencies, photographs
4. Confirmed public notices, forum calendar and participation reports
5. Official office hours and map coordinates (or an embed URL)
6. Approval to publish service standards and turnaround times
7. Confirmation of which telephone/email lines may be published, and a decision on routing form submissions
8. Written clearance for the photographs and the crest

---

## 9. Environment variables

| Name | Required | Public? | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Yes — inlined into HTML | Canonical origin for metadata, sitemap, robots |
| `NEXT_PUBLIC_ADMIN_PREVIEW` | No | Yes | `disabled` withdraws `/admin-preview` and its footer link |
| `NEXT_PUBLIC_ADMIN_PREVIEW` | No | No (build-time flag) | `/admin-preview` 404s unless `enabled`; then `X-Robots-Tag: noindex, nofollow, noarchive`. Not authentication |

URL resolution order: `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` (stable production domain) → `http://localhost:3000`. `VERCEL_URL` is deliberately **not** used, because it is a per-deployment preview host and must never appear in canonical or Open Graph output.

Copy `.env.example` to `.env.local` for local overrides; env files are git-ignored.

---

## 10. Verification status

**Executed successfully in this revision** (network-enabled, Node 22.23.4, npm 10.9.9):

| Check | Result |
|---|---|
| `npm ci` | pass — clean install from lockfile |
| `npm run lint` | pass — 0 errors, 0 warnings |
| `npm run typecheck` | pass |
| `npm run build` | pass — 47/47 static pages, `✓ Compiled successfully` |
| `npm run check:source` | pass — 54 source files scanned |
| `npm audit` | 6 moderate, 0 high, 0 critical (all dev-only, transitive — see report) |
| Route sweep (`next start`) | 41/41 content routes HTTP 200, 34/34 assets 200, 0 broken internal links, 23 sitemap URLs (demonstration routes excluded), `/admin-preview` 404, security headers present |

**Not verified — requires a browser or human review:**

1. Visual rendering at 360 / 390 / 768 / 1024 / 1440 / 1920 px (no screenshots were taken).
2. JavaScript interactions: search dialog, mobile drawer, accordions, form validation and preview, back-to-top.
3. Screen-reader and keyboard-only testing, and WCAG contrast measurement.
4. Lighthouse / Core Web Vitals.
5. Cross-browser behaviour (Chromium, Firefox, Safari).
6. The third-party `docs.google.com/viewer` preview links on document cards.
7. Document authenticity beyond "the endpoint returns a PDF".
8. Images and crest rights — unresolved, and a launch blocker.

Run `scripts/verify-routes.mjs` again after any content change; it needs no extra dependencies.

---

© 2026 Iten-Tambach Municipality, County Government of Elgeyo Marakwet. Demonstration build.
