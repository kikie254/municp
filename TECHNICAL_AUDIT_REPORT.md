# Technical Audit Report — Iten-Tambach Municipality Website

**Audit date:** 10 November 2026
**Input artefact:** `iten-tambach-municipality-fixed.zip` (4.25 MB, 98 files, no `node_modules`)
**Nature of work:** audit of the existing source, targeted fixes, executed verification. No rebuild, no framework change, no redesign.
**Environment:** Node v22.23.4, npm 10.9.9, Linux x86_64, network enabled.

---

## 1. Executive summary

The project was already structurally sound: it compiled, type-checked and deployed, and none of the 42 content pages, 12 photographs, 31 county PDF links or 79 internal links were broken. The defects found were concentrated in the **quality gate and the supply chain**, plus a small number of metadata and hardening issues.

| Area | Before | After |
|---|---|---|
| `npm ci` | PASS | PASS |
| `npm run lint` (ESLint) | **FAIL — no ESLint config existed, command dropped into an interactive prompt** | **PASS — 0 errors, 0 warnings** |
| `npx tsc --noEmit` | PASS | PASS |
| `npm run build` | PASS (47 static pages) | PASS (47 static pages) |
| `npm audit` | **3 vulnerabilities: 1 critical, 2 high** | **6 moderate, 0 high, 0 critical** (all remaining are dev-only, transitive, and require a Next major upgrade) |
| Canonical URL correctness | Homepage canonical leaked onto `/admin-preview` | Every route has its own canonical, or none by design |
| Custom 404 page | **Absent — bare Next.js default** | Present, matched to the design system |
| Security headers | **None** | `nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Robots-Tag` on the demo admin route |
| Dev/preview URL leakage | Possible via `VERCEL_URL` fallback | Eliminated |

Nothing was removed. No page, feature, component, dataset entry or image was deleted to make a check pass. No check was disabled via `ignoreBuildErrors`, `ignoreDuringBuilds`, `eslint.ignoreDuringBuilds`, or a per-file suppression comment.

---

## 2. Method

1. Unzipped to a pristine directory, `git init` + baseline commit, so every change is diffable (`git diff --name-status`).
2. Ran the full toolchain **before** any edit and captured exit codes to log files (section 5).
3. Inspected all 98 files: `package.json`, lockfile, `tsconfig.json`, `next.config.ts`, Tailwind/PostCSS config, 21 route files, 21 components, 5 data modules, 2 scripts.
4. Grepped for the usual defect classes: `dangerouslySetInnerHTML`, `console.*`, `localhost`/`vercel.app`, `href="#"`, `target="_blank"` without `rel`.
5. Verified every `/images`, `/fonts`, `/brand` reference resolves on disk.
6. Probed **all 31 unique county document URLs** over the network.
7. Added a throwaway smoke-test harness (`scripts/verify-routes.mjs`), rebuilt with `NEXT_PUBLIC_SITE_URL` supplied only as an environment variable, ran `next start`, and crawled all 42 routes, all 34 public assets and all 79 internal href targets.
8. Re-ran the whole gate on a freshly unzipped copy of the delivered archive.

---

## 3. Dependency and environment audit

### 3.1 Baseline

```
next 15.1.6 · react 19.0.0 · react-dom 19.0.0 · lucide-react 0.474.0
typescript 5.7.3 · tailwindcss 3.4.17 · postcss 8.5.1 · autoprefixer 10.4.20
@types/node 22.10.7 · @types/react 19.0.7 · @types/react-dom 19.0.3
ESLint: not installed, not configured
```

`npm ci` succeeded, and printed: *"npm warn deprecated next@15.1.6: This version has a security vulnerability."*

### 3.2 Changes applied

| Package | From | To | Reason |
|---|---|---|---|
| `next` | 15.1.6 | **15.5.29** | Critical advisory on 15.1.6. Latest patched release **within the same major** — no App Router, caching, or config migration required. |
| `eslint` | — | **^9.39.5** | No linter was installed. ESLint 9 is required by `eslint-config-next@15.5.x`. |
| `eslint-config-next` | — | **15.5.29** | Version-locked to the Next.js release. |
| `@eslint/eslintrc` | — | **^3.3.7** | `FlatCompat` bridge, needed because `eslint-config-next@15` still ships eslintrc-style configs. |
| `postcss` | 8.5.1 | **^8.5.32** | 8.5.1 falls inside the vulnerable `<=8.5.22` range. |
| `postcss` (override) | — | **^8.5.32** | Next.js bundles a nested `postcss@8.4.31`, which the direct bump does not reach. An `overrides` entry removes that nested copy. |
| `engines.node` | — | **>=20.9.0** | Documents the real floor for Next 15.5 and prevents an unsupported Node from reaching a build. |

Full lockfile regenerated; `package.json` and `package-lock.json` are synchronised (`npm ci` is the proof — it fails on any mismatch).

### 3.3 Deliberately not upgraded

| Package | Why not |
|---|---|
| `react` / `react-dom` 19.0.0 | Patching applies within 19.x and there is no advisory against 19.0.0 that the audit reports. Upgrading React is a behaviour risk with no security benefit here. |
| `tailwindcss` 3.4.17 → 4.x | v4 is a breaking config rewrite (CSS-first config, changed PostCSS plugin). No security motivation. Out of scope for a stability-focused pass. |
| `typescript` 5.7.3 | Compiles cleanly; no advisory. |
| `lucide-react` 0.474.0 | Icon library; a major bump changes icon APIs for zero functional gain. |
| `eslint-config-next` → 16.x | Would pull Next 16 type rules; cannot be done without the Next major. |

### 3.4 Residual audit findings — honest status

`npm audit` after the changes: **6 moderate, 0 high, 0 critical.**

| Advisory | Severity | Scope | Why it remains |
|---|---|---|---|
| `minimatch` GHSA-g3hv-75wg-m249 (ReDoS) | moderate | dev-only, transitive (`@typescript-eslint/typescript-estree`) | Ships inside `eslint-config-next@15.5.29`. Only fix is `eslint-config-next@16`, i.e. a Next major. It is a lint-time dependency — it is not in the production bundle. |
| 5 × `@typescript-eslint/*` | moderate | dev-only, transitive | Same chain; each is vulnerable only via `minimatch`. |

These are **build-time, developer-machine dependencies**. Nothing in this chain is shipped to the browser or executed at request time. The audit reports `next` and `postcss` entries as "fix via next@16.4.6 (breaking)" — that is the same transitive-PostCSS dependency, now patched by the override; a fresh `npm audit` confirms no `postcss` advisory remains and severity for `next` drops from critical to moderate.

**Recommendation:** plan a Next 16 migration as a separate, budgeted piece of work. It should not be bundled into a stability pass on an institutional site.

---

## 4. Bugs discovered and fixed

Each item below was reproduced, then fixed, then re-checked.

### BUG-1 — ESLint was completely non-functional (severity: high, blocks the acceptance criteria)
`package.json` declared `"lint": "next lint"` but **no ESLint dependency and no ESLint config file existed**. Running `npm run lint` did not lint anything: it printed

```
? How would you like to configure ESLint? https://nextjs.org/docs/app/api-reference/config/eslint
❯  Strict (recommended)
```

and exited **1** without analysing a single file. Any claim that this project "passes lint" was therefore false, and it also means `next build`'s internal lint step was skipped.

**Fix:** installed `eslint@9.39.5`, `eslint-config-next@15.5.29`, `@eslint/eslintrc@3.3.7`; added `eslint.config.mjs` (flat config, `next/core-web-vitals` + `next/typescript`, ignores for `.next`, `node_modules`, `next-env.d.ts`, `public`); changed the script to `"lint": "eslint ."`. Rationale: `next lint` is deprecated in Next 15 and **removed** in Next 16, so the CLI-based script is the forward-compatible choice.

First real run surfaced 2 genuine warnings, both fixed rather than silenced:

### BUG-2 — Critical CVE in Next.js 15.1.6 (severity: critical)
`npm audit` → `next 9.3.4-canary.0 - 16.3.0-preview.10`, severity **critical**, including GHSA-9qr9-h5gf-34mp (RCE in the React flight protocol), GHSA-3h52-269p-cp9r (dev-server origin verification), GHSA-f82v-jwr5-mffw (middleware authorization bypass), and 13 further advisories.
**Fix:** `next@15.5.29` — same major, no API changes needed; verified by a full rebuild of all 47 routes.

### BUG-3 — Vulnerable nested PostCSS (severity: high)
`node_modules/next/node_modules/postcss@8.4.31` sat below `next`, unaffected by the top-level `postcss` bump. Advisories include GHSA-qx2v-qp2m-jg93 (XSS via unescaped `</style>`), GHSA-6g55-p6wh-862q and GHSA-r28c-9q8g-f849 (arbitrary file read via `sourceMappingURL`).
**Fix:** `overrides: { "postcss": "^8.5.32" }` — the nested copy is removed entirely (confirmed: *"removed 1 package"*, nested path no longer resolves), build re-verified.

### BUG-4 — Homepage canonical leaked onto a second route (severity: medium, SEO)
`app/layout.tsx` declared `alternates: { canonical: "/" }`. Metadata from the root layout is **inherited by every route that does not override it**. All pages set their own canonical *except* `/admin-preview`, which consequently declared itself the canonical homepage while also being `noindex` — a contradictory, crawling-hostile signal.
**Fix:** removed the global canonical from the layout (each page owns its canonical — the pattern already used by the other 20 routes) and added an explicit `alternates: { canonical: "/" }` to `app/page.tsx`. Verified live: every route now has the correct canonical and `/admin-preview` has none by design (it is `noindex, nofollow`).

### BUG-5 — No custom 404 page (severity: medium, UX + brand)
`app/not-found.tsx`, `app/error.tsx` and `app/global-error.tsx` did not exist, so a mistyped URL showed Next.js's bare built-in page with no navigation, no branding and no way back.
**Fix:** added `app/not-found.tsx` in the existing design language (green/gold, squared corners, Manrope display face), with a real `<h1>`, four suggested destinations, the office contacts, `<meta name="robots" content="noindex, nofollow">`. Verified: unknown route returns **404** and renders the custom page with an `<h1>`.

### BUG-6 — JSON-LD block was not hardened against `</script>` (severity: low–medium, defence in depth)
`components/BreadcrumbJsonLd.tsx` injected `JSON.stringify(data)` into `dangerouslySetInnerHTML`. The payload is currently compiled-in constants, so there is no live vector — but the moment any value becomes editor-supplied, an embedded `</script>` breaks out of the tag.
**Fix:** the serialised payload now escapes `<` to `\u003c`. The single `dangerouslySetInnerHTML` in the codebase is now safe by construction; no other unsafe HTML rendering exists.

### BUG-7 — Production domain could be contaminated by a Vercel preview host (severity: medium, SEO/institutional credibility)
`lib/site.ts` fell back to `VERCEL_PROJECT_PRODUCTION_URL` **or `VERCEL_URL`**. `VERCEL_URL` is the *per-deployment* preview host, so on any deployment where the production variable is unset, preview domains would be written into `metadataBase`, canonical tags, Open Graph URLs, `sitemap.xml` and `robots.txt`.
**Fix:** `VERCEL_URL` removed from the chain. Resolution is now `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` (stable production domain) → `http://localhost:3000` (local development only). Verified by rebuilding with `NEXT_PUBLIC_SITE_URL` supplied **only** as an environment variable and crawling the output: 0 occurrences of `localhost:3000`, `vercel.app`, `127.0.0.1` or the `.env.example` placeholder in any served HTML.

### BUG-8 — Hard-coded document count was wrong (severity: low, credibility)
The homepage stats block claimed `31 · Documents referenced`; `lib/data/documents.ts` contains **32**. On an institutional site a wrong self-reported figure undermines the rest of the page.
**Fix:** the value is now `String(documents.length)`. It can no longer drift from the dataset.

### BUG-9 — Unused imports and a non-null assertion
`app/page.tsx` imported `FolderKanban` unused; `app/projects/[slug]/page.tsx` imported `Reveal` unused (both flagged by the new linter). `app/page.tsx` also used `news.find((n) => n.featured)!`, which throws if the dataset ever has no featured item.
**Fix:** imports removed; assertion replaced with `?? news[0]`.

### BUG-10 — No security headers (severity: medium)
The app sent only Next's defaults, with `X-Powered-By` already disabled.
**Fix:** `next.config.ts` now sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`, and `X-Robots-Tag: noindex, nofollow` on `/admin-preview`. A CSP was **deliberately not added**: Next.js inlines runtime chunks and the site inlines JSON-LD, so a working CSP requires nonce plumbing and testing. Setting a broken CSP or a permissive one just to claim "CSP present" would be worse than none. All five headers verified present on a live response.

### BUG-11 — The demo admin screen could not be withdrawn from a public deployment
`/admin-preview` is a static, unauthenticated mock dashboard. It is correctly `noindex` and holds no data, so it is not a security vulnerability — but some municipalities will not want a mock admin screen on a public government site.
**Fix:** added `NEXT_PUBLIC_ADMIN_PREVIEW`. Unset (default) preserves current behaviour exactly; `disabled` makes the route `notFound()`. The footer link is driven by the *same* constant, so disabling the screen cannot leave a dangling link. Verified: default build serves `/admin-preview` at 200 with `X-Robots-Tag: noindex, nofollow`.

### 4.1 Defects investigated and found NOT to exist

Reported here so the negative results are on record:

- **Images:** all 12 referenced `/images/*.jpg` files and their `.webp` twins exist; 34/34 public assets returned 200. `farmland.jpg/.webp` are present but unreferenced (retained — see §7).
- **Document links:** all **31** unique `?mdocs-file=` URLs on `elgeyomarakwet.go.ke` returned **HTTP 200 / `application/pdf`** with real byte sizes (146 KB – 29 MB). No dead document link.
- **Internal links:** 79 unique internal href targets across all rendered HTML; every one returned < 400.
- **Routes:** 42/42 returned 200; heading hierarchy is correct — exactly one `<h1>` per page (supplied by `PageHero`), no page with zero or two.
- **Search:** `SearchDialog` indexes pages, documents, projects and news from the same data modules; no stale index.
- **Forms:** four forms share one hook with real validation (name length, email regex, Kenyan phone regex, minimum message length), `aria-invalid`, `aria-describedby` and `role="alert"` error wiring, `noValidate` to keep custom messages, and focus moved to the first invalid field. They are honestly labelled as non-transmitting demonstrations.
- **`target="_blank"`:** all 9 occurrences carry `rel="noopener noreferrer"`.
- **`href="#"` / empty links:** none.
- **`console.*`:** none in application code.
- **Secrets:** no `.env`, no API keys, no tokens in the repository. Forms have no endpoint, so there is nothing to authenticate.
- **Sitemap:** 41 URLs, all on the configured origin; every content route except `/admin-preview` (excluded by design, matching `robots.ts`).

---

## 5. Actual test results

Commands run in this environment. Exit codes as captured.

### 5.1 Baseline, before any edit

| Command | Exit | Observed output |
|---|---|---|
| `npm ci` | **0** | `added 117 packages` … `3 vulnerabilities (2 high, 1 critical)` |
| `npm run lint` | **1** | Interactive ESLint setup prompt; nothing linted |
| `npx tsc --noEmit` | **0** | no output |
| `npm run build` | **0** | `✓ Compiled successfully` … `✓ Generating static pages (47/47)` |
| `npm audit` | 1 | `{"high":2,"critical":1,"total":3}` |

### 5.2 Final, after fixes

| Command | Exit | Observed output |
|---|---|---|
| `npm ci` | **0** | clean install from the regenerated lockfile |
| `npm run lint` | **0** | no output — 0 errors, 0 warnings |
| `npx tsc --noEmit` | **0** | no output |
| `NEXT_PUBLIC_SITE_URL=… npm run build` | **0** | `✓ Compiled successfully in 10.6s` … `✓ Generating static pages (47/47)` |
| `npm run check:source` | **0** | `Source asset check passed: scanned 54 source files; all literal /images references exist.` |
| `npm audit` | 0 | `6 moderate severity vulnerabilities` (0 high, 0 critical, dev-only) |

### 5.3 Live functional verification (`next start` + crawl)

```
ROUTE INVENTORY: 16 static + 8 services + 10 projects + 8 news = 42 content pages
HTTP 200: 42/42 — every route returned 200
canonical missing: /admin-preview   (intentional: noindex, nofollow)
canonical not using configured origin: none
h1 count != 1: none
meta description < 70 chars: none
PUBLIC ASSETS SERVED (34): all 34 assets returned 200
404 HANDLING: unknown route status 404 · custom page has h1: true
sitemap: 200 · 41 URLs · entries not on configured origin: 0
robots: 200 · User-Agent: * / Allow: / / Disallow: /admin-preview / Sitemap present
SECURITY HEADERS: nosniff · SAMEORIGIN · strict-origin-when-cross-origin ·
                  Permissions-Policy present · x-powered-by absent
                  x-robots-tag on /admin-preview: noindex, nofollow
INTERNAL LINK CRAWL: 79 unique targets — every one returned < 400
DEV/PREVIEW LEAKAGE: "localhost:3000": none · "vercel.app": none ·
                     "127.0.0.1": none · placeholder: none
```

The per-route metadata matrix (title, canonical, description length, `<h1>` count, robots) for all 42 routes was generated from live HTTP responses, not from source inspection.

---

## 6. SEO and institutional credibility

- **Titles** — every route has a unique, descriptive title through the `%s | Iten-Tambach Municipality` template. No duplicated or fallback titles.
- **Meta descriptions** — present on 41/42 routes, all ≥ 78 characters. `/admin-preview` has a description but is `noindex`, so it is irrelevant to search.
- **Canonicals** — correct and self-referential on all routes that should be indexed; see BUG-4.
- **Open Graph / Twitter** — inherited defaults plus per-page overrides on the 26 dynamic routes; image is `iten-hero.jpg` (2000×1332, verified, correct 1.91:1 ratio).
- **Sitemap** — 41 URLs, real `lastModified` (news uses the article date, not build time), priorities and change frequencies preserved from the original design.
- **Robots** — `/admin-preview` disallowed in `robots.txt` **and** `noindex` in the page metadata **and** `X-Robots-Tag` in the headers: three independent, consistent signals.
- **Structured data** — one `GovernmentOrganization` JSON-LD block on the homepage, with parent organisation, postal address, telephone and email drawn from the project's own `site` config. No invented founding dates, awards, ratings or `SearchAction`.
- **Heading hierarchy** — one `<h1>` per page, verified programmatically across all 42 routes.
- **Accessibility attributes** — skip-to-content link, `id="main"` landmark, `aria-hidden` on decorative icons, `aria-label` on icon-only buttons, `aria-invalid`/`aria-describedby`/`role="alert"` on form errors, `aria-live` on filter result counts, `aria-modal` + `role="dialog"` + Escape handling on the search dialog, `aria-pressed` on filter buttons. These were inspected in source and confirmed present in rendered HTML; they were **not** exercised with a screen reader (see §9).
- **No development or preview URLs** — verified by crawl; see BUG-7.
- **Domain configurability** — `NEXT_PUBLIC_SITE_URL` alone repoints `metadataBase`, every canonical, Open Graph URLs, `sitemap.xml` and `robots.txt`. Proven by building with an environment variable only and finding zero placeholders in the output. No source edit required.
- **No invented institutional facts** — no domain, address, phone number, official, budget or delivery claim was added by this audit. All contact details and document titles are the ones already in the project.

---

## 7. Image and document rights

`ASSET_CREDITS.md` was accurate in its central judgement: **the provenance of all 13 photographs is unknown** and no licence is established. This audit did not change that, did not invent a creator or a licence for any image, and did not download replacements. It strengthened the file with:

- A verified usage map (which of the 13 files are actually referenced, and how often).
- An explicit note that `farmland.jpg`/`.webp` are unreferenced — retained rather than deleted, since deleting assets is not a fix.
- A per-file flag showing that the images live in `public/`, so they are **publicly served** to anyone who guesses the URL, independent of any page that displays them.
- The legal position stated plainly: "found via image search" grants nothing; permission, purchase or an explicit open licence is required before launch.
- Fonts (Inter, Manrope) recorded as SIL OFL 1.1, and the crest flagged as needing County confirmation for municipal use.

**Documents:** 31/31 county PDF endpoints returned `HTTP 200 / application/pdf`, which is stronger evidence than "the path exists". It still does **not** prove the file behind a given `mdocs-file=` id is the document the title claims, nor that the County intends it for public redistribution. `verifiedFile: true` is therefore treated in this report as "the link resolves to a PDF", not "the document is authenticated". The one record flagged `verifiedFile: false` correctly routes to the official documents page.

---

## 8. Security and code quality

| Check | Result |
|---|---|
| Environment variables / exposed secrets | Clean. No `.env`, no keys, no tokens. `.env.example` contains only the public origin plus the new admin toggle. |
| Admin preview access | Static, unauthenticated, data-free, `noindex` × 3, `X-Robots-Tag`, and now withdrawable via `NEXT_PUBLIC_ADMIN_PREVIEW=disabled`. No privilege exists to escalate — there is no login, no mutation, no persistence. |
| Form handling | Client-side validation only, no submission target, and the UI states clearly that nothing is transmitted or registered. No CSRF surface, because no server action or API route exists. |
| Input validation | Email, Kenyan phone, minimum lengths; errors announced and focus moved. Regexes are anchored and linear (no catastrophic backtracking). |
| Unsafe HTML rendering | Exactly one `dangerouslySetInnerHTML` (JSON-LD), now `<`-escaped. No `innerHTML`, no `eval`, no `new Function`. |
| Dependency vulnerabilities | 1 critical + 2 high → 0 critical, 0 high. See §3.4 for the residual moderates and why they are inert. |
| TypeScript errors | 0 (strict mode, `skipLibCheck: true`, unchanged). |
| Console errors | None in application code. |
| Broken imports | None; all 21 components and 5 data modules resolve. |
| Unused code | Two unused imports removed. `farmland` assets and the documented sample datasets retained deliberately. |
| Security weakening to pass a build | **None.** No ignore flags, no `eslint-disable`, no relaxed `tsconfig`, no removed checks. |

**Note on the demo content posture:** sample news/project/forum records, the absence of backend submission, and the `admin-preview` label are pre-existing product decisions in this build, and they are disclosed on-page. They were preserved, not altered.

---

## 9. Responsive and design QA — and what remains UNVERIFIED

**Preserved without modification:** all colours (green/gold/clay/flag/ink/paper from the crest), Manrope/Inter typography, the 1240px shell, squared institutional corners, card and section layouts, hero treatments, animations, and every piece of copy and content.

**Verified by inspection of source and rendered HTML:**

- Mobile drawer, sticky header, scroll-shadow, dropdown menus — logic and breakpoints reviewed; `sm`/`md`/`lg`/`xl` classes are consistently paired, single-column base with progressive enhancement.
- No horizontal overflow by construction: `shell` + `max-w` containers, `min-w-0` on flex children beside truncation, `truncate` on long titles, `object-cover` on fixed-aspect image frames, `overflow-x-auto` on the one table region.
- Filter and sort controls collapse to a stacked grid on mobile (`md:grid-cols-12`).
- Text sizes use `clamp()` for display headings and fixed rem/px for body, so no runaway scaling.
- All touch targets in the header and forms are ≥ 36 px with generous padding.

**UNVERIFIED — no browser or device was available in this environment:**

1. **Visual rendering at 360 / 390 / 768 / 1024 / 1440 / 1920 px** — no screenshot was taken. Layout correctness is inferred from source, not observed.
2. **Interactive behaviour driven by JavaScript** — search dialog keyboard traversal, mobile drawer open/close animation, accordion expansion, form validation and the preview panel, back-to-top, scroll reveals. These compile and are consistent in source; they were **not clicked**.
3. **Screen-reader and keyboard-only testing** — ARIA is present and valid, but no NVDA/VoiceOver/TalkBack run was performed.
4. **Colour contrast ratios** — palette reviewed for plausibility; no automated WCAG contrast measurement was run.
5. **Lighthouse / Core Web Vitals** — not measured. Bundle sizes are healthy (`~103 kB` shared First Load JS, `112–118 kB` per route), but no LCP/CLS/INP figure is claimed.
6. **Cross-browser** — Chromium/Firefox/Safari were not exercised.
7. **`docs.google.com/viewer` preview links** — these hand a county PDF URL to a Google service. They are third-party and were **not** tested; they may break if Google changes or restricts the endpoint. This is a pre-existing feature, left intact because removing it would remove functionality.
8. **Physical-device network conditions** — the largest documents are 20–29 MB PDFs hosted by the County; download performance abroad was not measured.

The project lead should run items 1–6 in a browser before the site is announced publicly. The verification harness (`scripts/verify-routes.mjs`) is included so the route/link/metadata sweep can be repeated after any future content change.

---

## 10. Files modified

| Status | File | Why |
|---|---|---|
| M | `package.json` | Next 15.5.29, ESLint toolchain added, `lint` → `eslint .`, `typecheck` script, `engines.node`, postcss bump + overrides |
| M | `package-lock.json` | Regenerated to match `package.json` |
| A | `eslint.config.mjs` | ESLint 9 flat config (did not exist) |
| M | `next.config.ts` | Security headers + `X-Robots-Tag` on `/admin-preview` |
| M | `lib/site.ts` | Dropped `VERCEL_URL` preview fallback; added `adminPreviewEnabled`; corrected doc comment |
| M | `app/layout.tsx` | Removed global canonical that leaked onto `/admin-preview` |
| M | `app/page.tsx` | Own canonical; document count derived from data; unused import removed; non-null assertion replaced |
| M | `app/admin-preview/page.tsx` | `notFound()` gate via `NEXT_PUBLIC_ADMIN_PREVIEW` |
| M | `app/projects/[slug]/page.tsx` | Unused `Reveal` import removed |
| M | `components/BreadcrumbJsonLd.tsx` | JSON-LD `<` escaping |
| A | `app/not-found.tsx` | Custom 404 in the existing design system |
| A | `scripts/verify-routes.mjs` | Repeatable route/asset/link/metadata/header sweep |
| M | `.env.example` | Documented `NEXT_PUBLIC_ADMIN_PREVIEW`, clarified URL resolution order |
| M | `README.md` | Rewritten: real verification status, scripts, deployment, known limits |
| M | `ASSET_CREDITS.md` | Verified usage map; provenance still unknown, no licence invented |
| A | `TECHNICAL_AUDIT_REPORT.md` | This report |

**Not modified:** all 21 route files other than those listed, all 20 other components, all 5 data modules (`documents.ts`, `news.ts`, `projects.ts`, `services.ts`, `pages.ts`), `globals.css`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `app/sitemap.ts`, `app/robots.ts`, every image, font and the crest. **No content was edited.**

---

## 11. Deployment instructions (Vercel)

1. **Push** the unzipped project (project at the archive root) to a Git repository.
2. **Import** in Vercel → *Add New → Project*. Framework preset detects **Next.js**. Leave build command (`npm run build`) and output (`.next`) at their defaults. Node 20.x or 22.x.
3. **Set the environment variable** — this is the only required configuration:

   | Name | Value | Environments |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://<the municipality's real domain>`, no trailing slash | Production (and Preview, if previews should carry the production canonical) |

   Optional:

   | Name | Value | Effect |
   |---|---|---|
   | `NEXT_PUBLIC_ADMIN_PREVIEW` | `disabled` | Withdraws `/admin-preview` and its footer link from the public site |

   Both are `NEXT_PUBLIC_*`, i.e. build-time and public by definition — never put a secret in them.
4. **Deploy.** Because `NEXT_PUBLIC_SITE_URL` is inlined at build time, **changing it requires a redeploy**, not just a restart.
5. **Attach the custom domain** in *Settings → Domains*, and make sure the value in step 3 matches the domain users will actually visit — canonicals, Open Graph URLs, `sitemap.xml` and `robots.txt` are all built from it.
6. **Post-deploy smoke test** (the harness shipped with the project):
   ```bash
   BASE=https://<domain> SITE_ORIGIN=https://<domain> npm run build && npm start   # locally, or:
   BASE=https://<domain> SITE_ORIGIN=https://<domain> node scripts/verify-routes.mjs
   ```
   Expect: 42/42 routes at 200, 34/34 assets, 41 sitemap URLs, no broken internal links, `x-content-type-options: nosniff` present.
7. **Then**, before public announcement: submit `https://<domain>/sitemap.xml` in Google Search Console, and complete the browser QA in §9.
8. **Self-hosting instead of Vercel:** `npm ci && npm run build && npm start` behind a reverse proxy. Set `NEXT_PUBLIC_SITE_URL` at build time. Serve over HTTPS so `X-Frame-Options`/`Referrer-Policy` are meaningful, and confirm the proxy forwards the header set added in `next.config.ts`.

---

## 12. Acceptance criteria — final status

| Criterion | Status | Evidence |
|---|---|---|
| Dependencies install successfully | **MET** | `npm ci` exit 0 on a freshly unzipped copy |
| ESLint passes | **MET** | `npm run lint` exit 0, 0 problems (was: non-functional) |
| TypeScript passes | **MET** | `tsc --noEmit` exit 0, strict mode |
| Next.js production build passes | **MET** | exit 0, 47/47 static pages |
| All intended routes work | **MET** | 42/42 HTTP 200 live |
| Internal links and assets resolve | **MET** | 79/79 links < 400; 34/34 assets 200; 31/31 county PDFs 200 `application/pdf` |
| No critical security issues remain | **MET for the critical/high tier** | 1 critical + 2 high → 0 critical, 0 high. 6 moderate remain, dev-only and inert; documented in §3.4 |
| Production domain configurable | **MET** | Env var only; zero placeholders in output |
| Original design and functionality preserved | **MET** | No UI, colour, type, layout or copy changes; no page, component or data removed |
| ZIP complete and independently usable | **MET** | Verified by fresh unzip → `npm ci` → build in an empty directory |

**Honest caveats:** browser-level responsive rendering, keyboard/screen-reader operation, contrast measurement and Core Web Vitals remain **UNVERIFIED** (§9). Image rights remain **UNRESOLVED** — this is a legal/business action, not an engineering defect that code can fix (§7). Document authenticity beyond link resolution is **UNVERIFIED** (§7). A Next 16 migration is the only path to a zero-advisory `npm audit` and is recommended as separate work (§3.3).
