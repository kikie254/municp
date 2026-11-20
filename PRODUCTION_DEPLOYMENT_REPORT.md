# PRODUCTION HARDENING & DEPLOYMENT READINESS REPORT

Project: Iten–Tambach Municipality (Firebase edition). Audit date: 2026-11-14.
Source: the Phase 2 security-repaired tree. Scope: production hardening, deployment readiness and
final packaging. No website design, page, route, role or workflow was redesigned.

## 1. What changed in this phase

| # | Hardening item | File(s) | Verified how |
|---|---|---|---|
| 1 | Environment validation reporting variable NAMES only; refuses to pass in production with a missing required value | `lib/config/env.ts`, `scripts/check-env.ts`, `npm run env:check[:strict]` | 4 unit tests + `env:check` run |
| 2 | Health probe extended: component states + environment completeness, secret-free, deep mode for operators, 503 on incomplete production config | `app/api/health/route.ts` | build + live HTTP check |
| 3 | Distributed rate limiter with an optional Redis (Upstash REST) backend and the Firestore transaction limiter as the always-present fallback | `lib/auth/ratelimit.ts`, `lib/auth/ratelimit-redis.ts` | typecheck, build; live 429 behaviour needs Firestore — see §6 |
| 4 | Session cookie: lifetime clamped to 1–24 h, `Secure` whenever the origin is https, `httpOnly`, `SameSite=Lax` | `lib/auth/session.ts` | 3 unit tests |
| 5 | IP pseudonymisation refuses the development fallback salt in production (throws instead of degrading) | `lib/security/tokens.ts` | 5 unit tests |
| 6 | Production-safe error handling: public route boundary, root boundary, administration boundary — no message/path/PII in production, digest shown for log correlation | `app/error.tsx`, `app/global-error.tsx`, `app/admin/(dashboard)/error.tsx` | build (all three compiled) |
| 7 | HSTS (production only), `X-DNS-Prefetch-Control: off`, Server Action body limit raised to 12 MB to match the 10 MB upload cap | `next.config.ts` | build + live header check |
| 8 | `/admin-preview` permanently withdrawn — the `NEXT_PUBLIC_ADMIN_PREVIEW=enabled` escape hatch is removed | `middleware.ts` | live 404 check |
| 9 | Dev/production project separation | `.firebaserc` (aliases `dev`, `production`) | file review; console deploy is operator action |
| 10 | Backup + guarded restore tooling that verifies the export operation before claiming success | `scripts/backup-firestore.mjs`, `scripts/restore-firestore.mjs` | syntax-checked; NOT executed (no credentials) — see §6 |
| 11 | Deployment and recovery runbooks with exact Firebase/Vercel steps and verification per step | `DEPLOYMENT.md`, `RECOVERY.md` | new documents |
| 12 | Env template rewritten with scopes, generation commands and the MFA/limiter/backup variables | `.env.example` | review |

## 2. Explicitly NOT weakened

Firestore and Storage rules are unchanged (still default-deny, published-only public reads). No test
was skipped, no assertion relaxed, no security control disabled to obtain a pass. The rules suite is
still executed through the emulators (13/13).

## 3. Status of the three controls that are often over-claimed

- **MFA** — NOT enforced by this application. Enrolment and challenge belong to Identity Platform;
  the app audits unenrolled privileged sign-ins (`MFA_MISSING`) and can refuse them with
  `MFA_ENFORCEMENT=enforce`. The enforce/report branches were typechecked and built but not observed
  against a live project. Do not call the deployment MFA-protected until a challenge is observed.
- **Backups** — tooling delivered and syntax-checked; NOT operational and NOT verified. No export,
  restore or rehearsal was executed (no credentials). `RECOVERY.md` §6 makes the rehearsal mandatory
  before go-live.
- **Email** — provider integration exists; no key was supplied, so nothing was sent. Submissions are
  still stored and the outbox records `NOT_CONFIGURED` honestly.

## 4. Legacy database

`grep` over `app/`, `lib/`, `components/`, `middleware.ts` for `PrismaClient`, `@prisma/client` and
`better-sqlite3`: no matches. `lib/db.ts` performs a Firestore-only connectivity check. `prisma/` is
retained solely as historical schema documentation (excluded from `tsconfig`); the migration script
is a read-only recovery utility requiring an explicitly named SQLite file.

## 5. Test evidence (this phase)

- `npm run typecheck` — exit 0
- `npm run lint` — exit 0, 0 problems
- `npm run test` — 41/41 unit tests, 6 files
- `npm run test:rules` — 13/13 against Firestore + Storage emulators. In this environment port 8080
  was occupied by a stale emulator process from an earlier session, so the run used
  `firebase.emulator-test.json` (Firestore 8091 / Storage 9201) via `npx firebase-tools
  emulators:exec --config firebase.emulator-test.json`. Same rules files, same tests, `Script
  exited successfully (code 0)`, `Tests 13 passed (13)`. The default `firebase.json` ports are what
  CI should use on a clean machine.
- `npm run build` — exit 0
- `npm run check:source` — local image references resolve
- `npm run env:check` — reports by name; strict mode documented
- Secret scan — no real credential in the tree; only `<placeholder>` text
- `npm audit --omit=dev` — advisories remain (transitive `@grpc/grpc-js`, `uuid`; `zod`), fixes are
  breaking-version upgrades scheduled as maintenance, not silently forced

## 6. Outstanding deployment requirements

**Requires Firebase/Vercel credentials (category C):** live admin sign-in; TOTP enrolment and an
observed MFA challenge; session revocation against a real project; rules/indexes deployment; real
document upload and download; submission round trip with a real record; email delivery; Redis or
Firestore limiter behaviour under load.

**Requires institutional approval (D):** `MFA_ENFORCEMENT=enforce`; email provider and sender
identity; backup bucket location/retention; audit archival; Data Protection Act 2019 sign-off;
go-live authorisation.

**Unverified by design (E):** Playwright browser E2E (no system browser in the audit environment);
backup/restore (never executed); dependency upgrades.
