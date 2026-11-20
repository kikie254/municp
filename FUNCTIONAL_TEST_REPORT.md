# FUNCTIONAL TEST REPORT — Iten–Tambach Municipality

Audit date: 2026-11-13. Everything below reflects commands actually executed in this session; items
that could not be executed live are named with the exact reason and classified B/C.

## 1. Execution environment

Node 22.23.4, npm 10.9.9, OpenJDK 21 (emulator runs). Production server exercised via
`next start` on port 3123 with `NEXT_PUBLIC_SITE_URL`/`FIREBASE_ADMIN_PROJECT_ID` placeholders —
Firestore intentionally unreachable in the sandbox, so all data-dependent paths report their
designed degraded behaviour, which is itself part of the verification.

## 2. Build and quality gates

| Command | Result |
|---|---|
| `npm ci` | 598 packages, exit 0 |
| `npm run typecheck` | exit 0 |
| `npm run lint` | exit 0 (0 errors, 0 warnings — after ITM-006/ITM-007 fixes) |
| `npm run test` | **29/29** unit tests, 3 files (security 16, password 7, rbac 6) |
| `npm run test:rules` | **13/13** against Firestore + Storage emulators (`logs/rules-test.log`) |
| `npm run build` | exit 0; First Load JS shared 103 kB; middleware 34.7 kB |
| `npm run verify:routes` | **41/41 routes HTTP 200**; metadata/canonical/h1 checks clean; 69 unique internal links all < 400; no dev-URL leakage beyond the configured origin; security headers present (`logs/verify-routes.log`, `logs/route-matrix.csv`) |
| `npm run verify:api` | **all security assertions pass** (`logs/verify-api.log`) |

## 3. Public workflows

- **Route integrity**: every public page (15 static + 8 services + 10 projects + 8 news) returned
  200 with correct title/canonical/single-h1 metadata. No route was removed by the Firebase
  migration; the 42 original Phase-1 route files remain in the tree.
- **Search**: bounds enforced (≥2 chars, ≤120 chars → 400); with Firestore unavailable the endpoint
  returns a labelled outage rather than a fake "no results".
- **Citizen submission workflow (live HTTP)**:
  - cross-origin POST rejected 403 (`Invalid origin.`) — CSRF control works;
  - invalid payload → 422 with per-field messages;
  - valid payload → intake accepted up to the Firestore write; without credentials the write fails
    and the endpoint returns a generic 500 with no internals leaked. **The full round trip (write →
    reference number → administrator sees the record) requires project credentials → C.**
- **Document download**: unknown/unpublished document → 404 without a session (verified live);
  authorised download of a real object → C (storage credentials).

## 4. Administrator workflows (B — implemented, not live-verified)

The sandbox cannot create Firebase Auth accounts, so the interactive flows below were verified by
code-path execution in the build (typecheck/build/tests) and by the rules tests; they require a
provisioned project to observe end to end:

- Provision (`npm run admin:provision`) → login (`loginAction`) → session cookie → dashboard guard
  (`requireUser`) → content create → submit for review → approve (four-eyes enforced server-side:
  `article.authorId === auth.user.id` blocks self-approval) → publish → audit record.
- Citizen case management: `updateSubmissionAction` (status whitelist `RECEIVED…CLOSED`, assignment,
  resolvedAt) and `addSubmissionNoteAction` (internal notes in a denied collection), both audited.
- Public participation: publish opportunity → citizen response (server action) →
  `participation:manage` export (`/api/admin/participation/[id]/export`, live-verified 403 for
  anonymous callers).
- User management: `saveUserAction`/`toggleUserAction` — last-super-admin protection, self-role
  change blocked, role change + deactivation + password set all revoke refresh tokens and write
  strict audit records.

## 5. What was NOT tested

- Playwright browser E2E (`tests/e2e/*.spec.ts`): not executed — system browser libraries are not
  installable in this sandbox. These specs remain for the deployment pipeline (same limitation as
  the previous build session; reported honestly, never claimed as passed).
- Live sign-in, MFA enrolment, session revocation against the real Firebase project → C.
- Email delivery (`EMAIL_PROVIDER=resend` configured but no key) — the mailer honestly reports
  `NOT_CONFIGURED` and the UI says so; outbox records preserved.

## 6. Evidence index

`logs/verify-routes.log`, `logs/route-matrix.csv`, `logs/verify-api.log`, `logs/rules-test.log`,
`logs/13-functional-verify.log`, plus session logs for typecheck/lint/test/build/audit.
