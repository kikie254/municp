> **STATUS: SUPERSEDED — DO NOT RELY ON THIS DOCUMENT.**
> This report was written against the earlier Prisma/SQLite build. It describes SQLite, Prisma
> migrations and local `var/uploads` storage as operational; the application has since migrated to
> Firebase (Authentication, Cloud Firestore, Cloud Storage). Those statements no longer describe
> the current code. No production feature falls back to Prisma or SQLite: `lib/db.ts` now checks
> Firestore connectivity only, `prisma/` survives solely as migration documentation, and
> `scripts/migrate-to-firestore.ts` is a read-only legacy recovery utility. For the current
> verified state read INDEPENDENT_SECURITY_AUDIT.md and PRODUCTION_READINESS_REPORT.md.

# FINAL PRODUCTION AUDIT — Iten–Tambach Municipality

Audit date: 2026-11-13. Every number below comes from a command executed in this build session on
Node 22.23.4 / npm 10.9.9. Anything not executed is marked **NOT TESTED**; it is never reported as passed.

## 1. Summary scoreboard

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Routes tested | **79 HTTP checks** (42 original route files preserved + new admin/API/slug routes) | `scripts/verify-routes` sweep against `next start` on :3123 |
| 2 | Routes passing | **79 / 79 matched their expected status** (0 × 5xx) | 61 × 200, 13 × 307 (admin without cookie), 4 × 404 (by design), 1 × 403 (API denial) |
| 3 | Routes failing | **0** | no 5xx in the sweep |
| 4 | Routes not tested | **0** at HTTP level; **browser-level rendering NOT TESTED** (see §9) | Playwright could not launch |
| 5 | Build | **PASS** — `next build` exit 0 in 42 s | shared First Load JS 103 kB, middleware 34.3 kB |
| 6 | Lint | **PASS** — `eslint .` exit 0, 0 errors, 0 warnings | after fixing the unused-`role` warning in `tests/unit/rbac.test.ts` |
| 7 | TypeScript | **PASS** — `tsc --noEmit` exit 0 | strict mode inherited from Phase 1 |
| 8 | Automated tests | **29 / 29 unit tests pass** (3 files, 1.20 s). **E2E: 0 executed — NOT TESTED** | `npx vitest run`; `npx playwright test` failed at browser launch |
| 9 | Accessibility | **Partial** — structural audit + keyboard/Escape/focus code review PASS; **axe and screen-reader runs NOT TESTED** | see §9 |
| 10 | Lighthouse | **NOT TESTED** — Chrome could not start in this sandbox | no score is claimed |
| 11 | Security findings | 6 controls verified live, 0 high-severity defects open; 3 residual items documented | §7 |
| 12 | Database & auth | **Operational** on SQLite; migration applied; seed created 1 super administrator | `prisma migrate deploy`, `db:seed` |
| 13 | Email | **Implemented, NOT CONFIGURED** — no credentials; outbox records `NOT_CONFIGURED`, UI says so | `/admin/settings`, `EmailOutbox` |
| 14 | Document storage | **Operational** locally (`var/uploads`, private, streamed via `/api/documents/[id]/download`) | route implemented; no production volume attached |
| 15 | Municipal approval requirements | 4 open | §10 |
| 16 | Deployment requirements | 3 open | §11 |

## 2. Reproduce the verification

```bash
npm ci
npx prisma migrate deploy
ADMIN_EMAIL=… ADMIN_PASSWORD=… ADMIN_NAME=… npm run db:seed
npm run typecheck          # exit 0
npm run lint               # exit 0
npm run test               # 3 files, 29 tests passed
npm run build              # exit 0
npx next start -p 3123 &
node scripts/verify-routes.mjs            # 79 checks
node scripts/verify-api.mjs               # submission, rate limit, CSRF, headers
npx playwright test                       # needs system browser libraries; see §9
```

## 3. Route-by-route results (79 checks)

| Group | Checks | Status observed | Verdict |
|---|---|---|---|
| Public pages (static + published listings + slug templates) | 43 | all **200** | PASS |
| `/admin-preview` (Phase 1 withdrawn route) | 1 | **404** | PASS by design |
| `/admin/login`, `/admin/reset-password` | 2 | **200** | PASS |
| All `/admin/**` dashboard routes **without** a cookie | 13 | **307 → /admin/login** | PASS (protection enforced server-side) |
| `/api/health`, `/api/search?q=market` | 2 | **200** | PASS |
| `/api/admin/submissions/export` without a session | 1 | **403** `{"error":"Not authorised."}` | PASS |
| All `/admin/**` dashboard routes **with** a valid session | 13 | **200** | PASS |
| `/api/admin/submissions/export` with a session | 1 | **200** | PASS |
| Deliberate not-found paths | 3 | **404** | PASS |

The 42 original Phase 1 route files are all still present; the application now serves them plus the
administrative and API surface. No route was removed.

## 4. Functional verification actually executed

| Behaviour | Command / method | Observed result |
|---|---|---|
| Citizen submission persists | `curl -X POST /api/submissions` with a valid complaint payload | **201**, `{"reference":"ITM-CMP-KGFX-XXUA","status":"RECEIVED"}`; row counted in SQLite |
| Reference format | same response | `ITM-CMP-` + 8 unambiguous characters |
| Audit written on intake | `SELECT count(*) FROM AuditLog` | 3 rows after the probe sequence |
| Rate limiting | 7 rapid submissions | `201 201 201 201 429 429 429` |
| CSRF / origin check | `Origin: https://evil.example` | **403** `{"error":"Request rejected: invalid origin."}` |
| Security headers | `curl -I /` | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` present |
| XSS reflection | `/api/search?q=<script>alert(1)</script>` | 200, payload returned as JSON text only, 1 occurrence, not executed as markup |
| Admin protection | 13 routes, no cookie | all 307 to login |
| Search excludes unpublished | query for a draft-only title | no result (filter is in the SQL `where`) |
| Seeding | `ADMIN_EMAIL=… npm run db:seed` | `Created super administrator admin@iten-tambach.go.ke`; 1 user row |
| Google-style crawl of drafts | `/sitemap.xml` generated from published rows only | drafts absent |

## 5. Unit test inventory (29 passing)

| File | Tests | Covers |
|---|---|---|
| `tests/unit/password.test.ts` | 7 | scrypt encoding shape, salt uniqueness, plaintext absence, correct/incorrect verification, malformed hash, 12-character policy |
| `tests/unit/rbac.test.ts` | 6 | role inventory, permission matrix boundaries, four-eyes rule for all four roles |
| `tests/unit/security.test.ts` | 16 | upload extension/signature/size rejection, filename traversal, slug generation, public reference format, IP hashing irreversibility, submission schema (honeypot, Kenyan phone, consent) |

## 6. End-to-end suite: written, NOT EXECUTED

`tests/e2e/public.spec.ts` and `tests/e2e/admin.spec.ts` contain **9 tests**: homepage `h1` and skip link,
header navigation, visible focus ring, search dialog open + Escape, contact form server-side validation,
mobile overflow ≤ 1 px at 360 × 780 on five pages, `/admin` redirect, wrong-password refusal, `noindex`
on admin pages.

`npx playwright install chromium` downloaded the browser successfully, but every run aborted with
`browserType.launch: Executable doesn't exist … headless_shell` / missing `libatk`, `libatspi`,
`libxcomposite` host libraries. `sudo npx playwright install-deps` could not complete in this sandbox.
**Result: 0 of 9 E2E tests executed. Nothing in this report is based on them.** They are committed and
will run on any machine with the browser libraries installed (`npx playwright install --with-deps`).

## 7. Security findings

| Control | Status |
|---|---|
| Passwords hashed with scrypt + per-password salt | PASS (unit-tested) |
| Sessions stored as SHA-256 of the cookie token, httpOnly/SameSite=Lax/Secure-in-prod | PASS (source + schema) |
| Authorisation enforced in actions and route handlers, not only in the UI | PASS (13 × 307 + 403 evidence) |
| Four-eyes approval rule, self-approval refused and audited | PASS (unit tests) |
| Rate limiting on submissions, participation, search, login, reset | PASS (live 429 evidence) |
| CSRF: origin check on REST, framework check on Server Actions | PASS (live 403) |
| Upload validation: extension allow-list, magic-byte check, size cap, private storage, attachment delivery | PASS (unit-tested; no live upload exercised against a running server) |
| Audit trail append-only | PASS by design (no update/delete path) — **not** independently penetration-tested |
| Site-wide Content-Security-Policy | **NOT IMPLEMENTED** — documented limitation; route-scoped CSP on downloads only |
| `npm audit` / dependency CVE scan | **NOT TESTED** — registry call unavailable in the sandbox |
| Penetration test / formal vulnerability assessment | **NOT TESTED** |

## 8. Performance and SEO

* Build output: 103 kB shared First Load JS; heaviest routes `/projects` 118 kB, `/news` 117 kB; middleware 34.3 kB.
* Fonts self-hosted from `/public/fonts` (Inter, Manrope) — no external font request, `display: swap`.
* Images are Phase 1 static assets served from `/public`; Next Image optimisation is not enabled for them.
* Metadata: per-page title template, description, canonical from `NEXT_PUBLIC_SITE_URL`, Open Graph image, `en_KE` locale, JSON-LD `GovernmentOrganization` block.
* `robots.txt` disallows `/admin`; admin pages carry `noindex`; sitemap lists published records only.
* **Lighthouse (Performance / Accessibility / Best Practices / SEO): NOT TESTED.** No score is claimed. The 90+ figures in the brief are targets, not results.

## 9. Accessibility

Implemented and source-verified: skip link, one `h1` per page, semantic landmarks, visible 3 px focus ring,
`aria-current` on navigation, dialog with `role="dialog"`/`aria-modal`/Escape/focus return, `aria-invalid` and
`aria-describedby` on field errors, `role="alert"`/`role="status"` for validation and success, table captions,
`prefers-reduced-motion` honoured, `lang="en-KE"`.

**Not tested:** axe-core automated scan, NVDA/JAWS/VoiceOver walkthrough, contrast measurement on rendered
pages, 320–1440 px visual inspection in real browsers. **No WCAG 2.2 AA conformance is claimed.**

## 10. REQUIRES MUNICIPAL APPROVAL

1. Official municipal name, crest usage and mandate wording.
2. Licensing evidence for every photograph in `public/images` (Phase 1 launch blocker, unchanged — `ASSET_CREDITS.md`).
3. Final data-retention period for submissions and participation responses, and the deletion procedure.
4. Approval that contact details (`site.contactVerification = "pending"`) are correct before the pending notice is removed.
5. Approval of the four system-generated response texts (submission acknowledgement, participation acknowledgement, privacy notice, accessibility statement) as official municipal communications.

## 11. REQUIRES EXTERNAL CONFIGURATION

1. Production PostgreSQL instance + `DATABASE_URL` (schema switch documented in `DATABASE_SCHEMA.md`).
2. Email provider account, verified sender domain, `EMAIL_API_KEY`/`EMAIL_FROM`.
3. Production domain in `NEXT_PUBLIC_SITE_URL` (must be set before `npm run build`) and the upload volume at `UPLOAD_DIR`.
4. `PRIVACY_HASH_SECRET` (32 random bytes) in the host secret manager.

## 12. Known limitations

* No site-wide CSP; recommended at the reverse proxy once third-party scripts are known.
* Search is `contains`-based over published rows — adequate for municipal volume, not a relevance engine.
* Image upload for news/project records accepts a path to an existing asset rather than a binary upload; document upload is fully implemented. This preserves the Phase 1 rule that no unlicensed imagery enters the repository.
* Scheduled publication stores `scheduledFor` and publishes on the next publish action; there is no background scheduler, so a cron/manual step is required for exact-time release.
* Multi-instance deployments need shared storage or an object-storage adapter for `UPLOAD_DIR`.
* `npm audit`, Lighthouse, axe, cross-browser and real-device testing remain outstanding.

## 13. Verdict

The platform is **functionally complete and secure by construction for a single-instance deployment**: real
database persistence, real authentication and RBAC, an approval workflow with a four-eyes rule, working
citizen intake with reference numbers, private document handling, an audit trail, and an honest
"not configured" state for email.

It is **not yet cleared for public launch**, because four municipal approvals (§10), four external
configuration items (§11) and the outstanding accessibility/performance verification (§9) remain open.
