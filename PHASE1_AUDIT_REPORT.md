# PHASE 1 — AUDIT REPORT

**Subject:** Iten–Tambach Municipality website (`iten-tambach-municipality`)
**Stack:** Next.js 15.5.29 (App Router) · React 19 · TypeScript 5.7 · Tailwind CSS 3.4
**Scope:** Phase 1 critical corrections only. No rebuild, no redesign, no invented content.
**Verification environment:** Node 22 / local production server (`next start`, port 3123)

---

## 1. Findings before implementation

Findings were produced by enumerating the supplied archive before editing: full directory listing,
`grep -rn` across `app/`, `components/`, `lib/`, every data file read in full, every document URL
requested and its payload inspected with `file` / `pdfinfo` / `pdftotext`.

### 1.1 Structure (as supplied)

| Item | Count / detail |
|---|---|
| Route files | 42 (15 static pages, 8 `/services/[slug]` statics, 10 `/projects/[slug]`, 8 `/news/[slug]`, plus `/admin-preview`) |
| Generated endpoints | `/sitemap.xml`, `/robots.txt` |
| Public assets | 34 files returning HTTP 200 (12 photographs referenced, 1 unreferenced, crest, fonts, icons) |
| Source files | 5,207 lines across `app/`, `components/`, `lib/` |
| Data records | 10 projects · 8 news articles · 32 documents · 8 services · 3 forums · 8 FAQs |
| Documentation | `README.md`, `ASSET_CREDITS.md`, `TECHNICAL_AUDIT_REPORT.md` |

Architecture, componentisation and naming were already sound. Nothing in this phase needed to
change the framework, routing model, styling system or build pipeline.

### 1.2 Critical defect register (before)

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| C1 | **Critical** | Homepage stat band presented invented figures as municipal facts: "11 public information sections", "2019 Municipal Charter published", "2035 spatial plan horizon" | `app/page.tsx` stat strip |
| C2 | **Critical** | Homepage "Projects" section rendered **sample project records** as municipal delivery cards, and "Newsroom" rendered **sample news** as the lead story | `app/page.tsx` + `lib/data/projects.ts` (`DEMONSTRATION CONTENT NOTICE`) + `lib/data/news.ts` (`isSample: true` on all 8) |
| C3 | **Critical** | Site search indexed all projects and news including demonstration records | `components/SearchDialog.tsx` |
| C4 | **Critical** | `sitemap.xml` submitted all 41 routes, including 10 demonstration projects and 8 sample articles, to search engines | `app/sitemap.ts` |
| C5 | **High** | `/admin-preview` was reachable and linked from the footer and the mobile drawer by default; access used a shared `?key=` URL secret | `middleware.ts`, `components/SiteHeader.tsx`, `components/SiteFooter.tsx` |
| C6 | **High** | Mobile drawer contained a **hardcoded** "Administration Preview" entry that ignored the configuration flag | `components/SiteHeader.tsx` |
| C7 | **High** | Desktop dropdown navigation was hover-only: no `focus` handler, no `aria-expanded`, no `Escape`, unreachable by keyboard | `components/SiteHeader.tsx` |
| C8 | **High** | `verifiedFile: true` on documents asserted only "the endpoint returns a PDF", but the UI presented it as "Files verified on county site" — a correctness claim the check cannot support | `lib/data/documents.ts`, `app/resources/page.tsx` |
| C9 | **High** | One document record (`citizen-fora-calendar-2024-2025`) pointed at an **HTML index page**, not a file, while declaring a 280 KB PDF | payload inspection: `Content-Type: text/html`, 401 KB, no PDF signature |
| C10 | **Medium** | One document title did not match the file: record titled "Integrated Development Plan (Approved)" / year 2026; PDF is "IDEP 2025–2029" | `pdftotext` cover page |
| C11 | **Medium** | Governance page stated Board composition as municipal fact while citing an instrument served by the County that is headed **"Model Draft Municipal Charter"** (World Bank KUSP) | `pdftotext` of `?mdocs-file=2273` |
| C12 | **Medium** | Contact page and footer presented phone, e-mail, physical address and postal address as settled facts with no confirmation source | `lib/site.ts`, `app/contact/page.tsx`, `components/SiteFooter.tsx` |
| C13 | **Medium** | Service pages instructed citizens to call "during official working hours" — no office hours are published anywhere | `app/services/[slug]/page.tsx` |
| C14 | **Medium** | Privacy policy implied operational data handling and cited the Data Protection Act without distinguishing what is actually collected (nothing) from what would be collected later | `app/privacy/page.tsx` |
| C15 | **Medium** | Terms of use claimed the site was "prepared for presentation to leadership" and asserted document accuracy that had not been established | `app/terms/page.tsx` |
| C16 | **Medium** | Accessibility statement read as a conformance claim ("meets" style phrasing) with no audit behind it | `app/accessibility/page.tsx` |
| C17 | **Medium** | All 13 photographs have **no documented source or licence**; `ASSET_CREDITS.md` itself flagged every one as "do not publish until cleared" | `ASSET_CREDITS.md` |
| C18 | **Low** | Six FAQ answers asserted operational capabilities (submissions received, documents authenticated, officials listed) that are not true of this build | `lib/data/services.ts` |
| C19 | **Low** | Route verifier expected `/admin-preview` to return 200 and wrote its CSV outside the project (`../logs/`), so it could not run from a clean checkout | `scripts/verify-routes.mjs` |
| C20 | **Low** | `README.md` claimed "42 routes" (41 content routes + preview) and documented the `?key=` mechanism as a security feature | `README.md` §2, §3, §10 |

### 1.3 What was already correct

Security headers (`nosniff`, `SAMEORIGIN`, referrer policy, `Permissions-Policy`), removal of
`X-Powered-By`, `noindex` header on the preview route, one `h1` per page, canonical URLs on every
route, descriptive `alt` text, `role="alert"` form errors, `aria-invalid`, skip link, visible
`:focus-visible` outline, `prefers-reduced-motion` support, print styles, JSON-LD, and self-hosted
fonts (no third-party font requests). These were preserved, not re-implemented.

---

## 2. Image and asset rights status

Full register in `ASSET_CREDITS.md`. Summary:

| Category | Count | Rights status | Launch blocker |
|---|---|---|---|
| Photographs in `public/images/` | 13 files (12 referenced, 1 unreferenced) | **Unknown** — no creator, source URL or licence recorded for any | **Yes** |
| County crest `public/brand/elgeyomarakwet-crest.png` | 1 | Sourced from the County website; **no written permission on file** | **Yes** |
| Self-hosted fonts (Inter, Manrope) | 8 WOFF2 | SIL OFL 1.1 — documented, redistributable | No |
| Document payloads | 32 records / 31 PDFs | Published by the County at an official endpoint; **redistribution and authentication not established** | No (linked, not mirrored) |

No image was replaced, recoloured or regenerated. No AI-generated substitute was introduced for
any photograph, crest or institutional asset — including in this phase's own additions, which use
CSS borders and lucide icons only. Two assets (`town-centre.jpg` 595×372, `trading.jpg` 750×375) are
displayed above native resolution and render soft on large screens; that is a rights-and-quality
note, not something Phase 1 could fix without a licensed original.

**Editorial risk identified:** several photographs (market, town centre, forest road, highlands)
carry strong place-association and, combined with the Municipality's name and crest on the same
page, could read as commissioned municipal photography. This is why the pre-launch review strip and
the rewritten terms were added — they disclose that photography is unverified pending clearance.

---

## 3. Demonstration content: what was restricted

### 3.1 Single policy, one helper

`lib/content.ts` now defines the policy once:

- `verified` — confirmed by the Municipality; may be published.
- `pending-verification` — plausible but unconfirmed; may be published **only** with a visible label.
- `demonstration` — template/sample; **never** presented as a municipal record.

`publishedNews` and `publishedProjects` are derived through a single filter, so every consumer
(homepage, featured blocks, search, sitemap, related widgets) inherits the same rule instead of
each deciding for itself. `projects.ts` gained an explicit `projectVerification: "demonstration"`
flag on all 10 records; `news.ts` kept `isSample` but typed it as a boolean rather than an optional
literal, so a new record cannot silently default into "real".

### 3.2 Where sample content can and cannot appear now

| Surface | Before | After |
|---|---|---|
| Homepage featured projects | 3 sample cards | Empty state, no cards |
| Homepage newsroom (lead + 2) | Sample articles | Empty state, no articles |
| Site search | Indexed | Not indexed |
| `sitemap.xml` | 41 URLs incl. 18 sample routes | 23 URLs (verified surfaces + services) |
| Related-project widget on project pages | Rendered siblings | Kept (page is already labelled `noindex` and carries a Demonstration banner) |
| News sidebar "Public notices" | Listed plainly | Labelled "template examples" |
| `/projects` listing | Sample cards with chips | Explicit "Template preview — not official records" section, counts relabelled |
| `/news` listing | Sample articles | Explicit "template examples" framing on lead and listing |
| Detail routes | Indexable | `noindex, follow` — confirmed on all 18 routes |

Nothing was deleted: the sample records remain in the data layer as replaceable templates, which is
why no layout lost its structure and why the Municipality can swap content in place.

### 3.3 Statistics

The homepage stat band no longer asserts institutional facts. It now derives four figures from
`lib/data/` at build time (documents listed, documents content-checked, document categories, service
areas) — all four are counts of what the site itself holds, verifiable by inspection, and none is a
municipal claim. The "2019 charter" and "2035 horizon" figures were removed rather than relabelled,
because there is no evidence the charter file is the adopted instrument.

---

## 4. Document verification findings

All 32 records were re-requested and their payloads inspected (HTTP status, `Content-Type`, byte
size against the declared `fileSize`, PDF signature, `pdfinfo`, `pdftotext` cover text compared with
the displayed title).

| Result | Count | Treatment |
|---|---|---|
| Payload is a PDF, size matches, opening text matches title/date → `content-confirmed` | 11 | Badge: "Content checked" |
| Payload is a PDF and resolves, but text is not extractable (scanned/image PDF) or title could not be fully confirmed → `file-only` | 20 | Badge: "File only" + explanatory note |
| Record points at an official page rather than a file → `source-page-only` | 1 | Badge: "Source page only" + explanatory note |

Notable individual outcomes:

- **`citizen-fora-calendar-2024-2025`** — the only record not using a `?mdocs-file=` endpoint; it
  resolved to the County documents **index page**, not a PDF, while declaring 280 KB. Left pointing
  at the official source, downgraded to `source-page-only`, with a note stating no per-file link
  exists. No replacement was invented.
- **`idep`** — corrected from "Integrated Development Plan (Approved), 2026" to
  "Iten–Tambach Municipality Integrated Development Plan (IDEP) 2025–2029"; the file's own cover page
  is the evidence. "Approved" was dropped because approval status is not stated in the payload.
- **`spatial-plan` / `spatial-plan-report`** — 19 MB single-page and 127-page scanned PDFs; no
  extractable text. Marked `file-only` rather than confirmed.
- **`charter`** — text confirmed *and* disclosed as a concern: the document is a **Model Draft
  Municipal Charter** prepared under the World Bank Kenya Urban Support Programme. Composition
  figures on `/governance` (nine members, five appointed competitively, five-year terms) match this
  text, so the page now names the instrument and asks the Municipality to confirm it is the adopted
  version.
- `verifiedFile` was **not** silently re-interpreted: it was replaced by `verification` +
  `note`, and the visual language was changed from "verified" to a claim the check can actually
  support.

No PDF was generated, edited, re-typed or substituted. Document search, filtering, sorting, year
chips and Google-Docs preview links remain in place and were re-tested after the data change.

---

## 5. Institutional details requiring approval

| Detail | Status | Where it appears | Note |
|---|---|---|---|
| "Iten–Tambach Municipality", "Elgeyo Marakwet County", "Republic of Kenya" | Consistent across all pages; no conflicting spellings found | Header, footer, metadata, JSON-LD | Names retained |
| Crest image | Used site-wide, stated as the County crest | Header, footer, favicon, JSON-LD `logo` | Written permission required before launch |
| Telephone `+254 726 780 634` / `0726 780 634` | Unconfirmed | ~24 locations incl. `lib/site.ts`, forms, JSON-LD, 404 page | Now shown with pending-verification notice |
| E-mail `iten.municipality@gmail.com` | Unconfirmed; a free webmail domain for an official body | ~23 locations | Same treatment; institutional-domain address recommended |
| Physical address ("opposite County Assembly, behind IEBC offices, Iten") | Unconfirmed | Contact page, footer, JSON-LD | Retained with notice |
| Postal address "PO Box 220, 30700" | Unconfirmed | Footer, JSON-LD | Retained with notice |
| Office hours | **Not published anywhere** | — | "During working hours" instruction removed from service pages |
| Office holders (Chairperson, Board, Municipal Manager) | **No names supplied** | Governance page | Page states plainly that no officials are named or depicted; none was invented |
| Mandate / vision / mission | Framework-level text citing the Urban Areas and Cities Act, 2011 and the charter | About, Governance | Retained; charter adoption to be confirmed |
| Governance composition | Sourced to a **Model Draft** charter | Governance | Source disclosed in-page |

A single flag, `site.contactVerification`, controls the notice: set it to `"confirmed"` once the
Municipality signs off, and every notice disappears without touching page markup.

---

## 6. Security findings

| ID | Finding | Severity | Action |
|---|---|---|---|
| S1 | `?key=` shared secret in the URL used to access `/admin-preview` | **High** | **Removed.** A URL secret leaks through browser history, proxy/access logs, `Referer`, screenshot and shared links; it also cannot express *who* is asking. Its presence also implied a working access-control model that does not exist. |
| S2 | Preview reachable and advertised by default | High | Withdrawn by default: route 404s, entries removed from footer, mobile drawer and HTML sitemap, `Disallow` retained in `robots.txt`, `X-Robots-Tag: noindex, nofollow, noarchive` when enabled |
| S3 | Preview page could be mistaken for a real administration portal | Medium | Red in-page disclaimer retained and reinforced: no authentication, no live data |
| S4 | No authentication, authorisation, CSRF protection or audit logging | **High (by design, documented)** | Out of scope for Phase 1; documented as a production requirement. No fake login was built. |
| S5 | Secrets in client bundle | — | **Verified absent**: no `ADMIN_PREVIEW_KEY`, no `?key=`, no secret material in `.next/static` |
| S6 | Missing CSP | Medium | Not added: a correct policy needs nonce plumbing through the App Router and would risk breaking existing inline scripts. Documented, not faked. |
| S7 | Preview opt-in is a build-time public variable | Low | `NEXT_PUBLIC_ADMIN_PREVIEW` is readable by anyone who inspects the bundle — acceptable because it reveals only the existence of a demo page. A real admin surface must sit behind server-side auth, not a flag. |
| S8 | Header hardening | — | Retained and verified on the running server: `nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/microphone/geolocation/payment, no `X-Powered-By` |

Additional integrity note: `BreadcrumbJsonLd.tsx` escapes `<` as `\u003c` to prevent `</script>`
breakout — correct, and left as is.

---

## 7. Accessibility findings

| ID | Finding | Action |
|---|---|---|
| A1 | Desktop dropdowns hover-only, unreachable by keyboard | Now open on focus, close on focus-out, `Escape` closes and returns focus to the parent link; `aria-expanded` and `aria-controls` added |
| A2 | Mobile menu trigger lacked a relationship to the panel | `aria-controls="mobile-navigation"` + `aria-haspopup="dialog"`; drawer carries `id`, `role="dialog"`, `aria-modal`, `aria-label` |
| A3 | Mobile drawer showed an unconditional administration link | Removed; now conditional on configuration, and labelled "(demonstration)" when shown |
| A4 | Misleading conformance language | Rewritten: implemented behaviour, what changed in this phase, and an explicit "still required: independent audit" list |
| A5 | Preserved correctly | Skip link, one `h1` per route, focus-visible 3px gold outline, `prefers-reduced-motion`, form `role="alert"` + `aria-invalid`, `sr-only` live result counts, `alt` text on every image |

**No WCAG conformance is claimed** — by the site or by this report. Nothing here substitutes for a
manual audit with assistive technology, which was not possible in this environment.

---

## 8. Internal link and consistency check

| Check | Result |
|---|---|
| Routes returning 200 | 41 / 41 |
| Canonical URL present and on configured origin | All |
| Exactly one `h1` per route | All |
| Meta description ≥ 70 chars | All |
| Distinct internal hrefs | 78 — every one returned < 400 |
| Public assets | 34 / 34 → 200 |
| Unknown route | 404 with the custom page and a single `h1` |
| `sitemap.xml` | 200, 23 URLs, no demonstration routes |
| Dead links to the withdrawn preview | None (footer, drawer, HTML sitemap all gated) |
| Duplicate content / placeholder text | `name@example.com` occurrences are input placeholder attributes only, not published content |

---

## 9. Findings after implementation

- No surface presents a demonstration record as a municipal achievement, announcement or notice.
- No homepage statistic is an institutional claim; all four are counts of site-held data.
- No route exposes the preview feature; the access key no longer exists in the codebase.
- Every document badge now states what was actually checked.
- Every unconfirmed contact detail is visibly marked pending verification, behind one flag.
- The three policy pages are labelled drafts with their approval requirement stated in-page.
- Design system, 42 route files, datasets, forms, filters and photography are intact.

Residual risk is concentrated where it must be: **content and rights approval by the Municipality**,
and the absence of a real administration system (deliberately out of scope).

---

## 10. Outstanding risks

1. **Photography rights (launch blocker).** 13 images, zero documented licences.
2. **Crest permission (launch blocker).** County mark used without written authorisation on file.
3. **Contact accuracy.** Phone, e-mail, addresses and hours are unconfirmed; a wrong number on a
   municipal site misdirects citizens.
4. **Charter status.** Governance composition rests on a model draft until adoption is confirmed.
5. **Document authenticity.** 20 records are "file resolves" only; scanned PDFs could not be
   verified against their titles.
6. **No real administration system.** Documented; must not be presented as one.
7. **No CSP.** Deliberately deferred.
8. **Manual/browser QA and assistive-technology testing** were not executable here.
