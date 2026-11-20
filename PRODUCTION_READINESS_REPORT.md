# PRODUCTION READINESS REPORT — Iten–Tambach Municipality

Audit date: 2026-11-13. Scope: is the repaired Firebase implementation ready to deploy to the
municipal environment? Verdict: **conditionally ready** — deployable to a staging/preview
environment immediately; production go-live needs the category C and D items below.

## 1. Scoreboard

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Production build | **PASS** — exit 0 | session log |
| 2 | Typecheck / lint | **PASS** — both exit 0 | session log |
| 3 | Unit tests | **PASS** — 29/29 | session log |
| 4 | Firestore + Storage rules tests | **PASS — 13/13, executed** (first run in project history; suite had been unrunnable) | `logs/rules-test.log` |
| 5 | Public route sweep | **PASS** — 41/41 HTTP 200, metadata clean, headers present | `logs/verify-routes.log` |
| 6 | API security checks | **PASS** — CSRF, authorisation, validation, headers, bounds | `logs/verify-api.log` |
| 7 | Admin SDK usage | **REPAIRED** — all privileged calls bound to the named `iten-tambach-admin` app; invalid `getUser(email)` removed | ITM-001/002, grep + build evidence |
| 8 | Session revocation design | **Implemented** — checkRevoked verification + token revocation on deactivation/role change/password reset | code; live check → C |
| 9 | MFA | **Accurately represented** — enrolment in Identity Platform; app audits unenrolled privileged sign-ins; `MFA_ENFORCEMENT=enforce` denies them. Not yet active on a live project | ITM-003; B/C |
| 10 | Citizen data confidentiality | **Verified** (rules tests + intake live checks) | `logs/rules-test.log`, `logs/verify-api.log` |
| 11 | Audit logging | **Implemented** — append-only app path; strict mode for high-risk ops | code; immutability beyond Firestore → D |
| 12 | Legacy database | **REMOVED from active paths** — `lib/db.ts` is Firestore-only; `prisma/` retained as migration documentation only; migration script is read-only recovery utility | ITM-008; grep evidence |
| 13 | Dependency advisories | **13 open** (5 high, 8 moderate) — transitive `@grpc/grpc-js`/`uuid` (fix = firebase-admin 14, breaking), `zod` (fix = zod 4, breaking). Not remotely exploitable in this architecture; scheduled upgrade recommended | `npm audit --omit=dev` |
| 14 | Playwright browser E2E | **NOT RUN** — system browser unavailable in sandbox; specs shipped for pipeline | FUNCTIONAL_TEST_REPORT §5 |
| 15 | Live credential-dependent flows | **NOT RUN** — sign-in, uploads/downloads, exports with data, email delivery | C |

## 2. Acceptance classification

- **A — Fixed and verified**: ITM-001, ITM-002, ITM-004, ITM-005, ITM-006, ITM-007, ITM-008 (evidence
  in SECURITY_FINDINGS_REGISTER.md).
- **B — Implemented but not live-verified**: MFA report/enforce branches, session revocation against
  a real project, role/permission storage matrix, administrator dashboard workflows, Playwright E2E.
- **C — Requires Firebase production credentials**: live administrator sign-in end to end, Identity
  Platform TOTP enrolment, Firestore/Storage rules deployment, document upload/download against the
  real bucket, submission round trip with real records, email provider connection.
- **D — Requires institutional approval**: `MFA_ENFORCEMENT=enforce` activation, email provider and
  notification address selection, audit archival bucket (BACKUP_AND_RECOVERY.md), Data Protection
  Act 2019 sign-off, go-live authorisation.
- **E — Remaining risks**: dependency advisories (§1.13), Firestore audit logs are not immutable
  storage (mitigation = archival export), rate limiter fails open during a Firestore outage
  (documented, logged), `x-forwarded-for` spoofable upstream (IPs used only hashed for limiting).

## 3. Not done deliberately

- No deployment to any live municipal environment was performed or attempted.
- No government-grade certification is claimed. This is an engineering audit, not accreditation.
- No business logic was changed beyond the confirmed defects (ITM-001/002/003/004/005/006/007/008);
  design, pages, navigation, content, roles, forms and workflows are untouched.
