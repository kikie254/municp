# SECURITY_THREAT_MODEL.md — Iten–Tambach Municipality (Firebase edition)

Scope: the municipal website backend (Firestore, Firebase Auth, Cloud Storage, Next.js server
layer). STRIDE-organised; each threat lists its mitigation and where it is enforced.

## Spoofing

| Threat | Mitigation | Enforcement point |
|---|---|---|
| Credential stuffing on admin login | Firestore-transaction rate limit (5 / 10 min per IP-hash+email) | `loginAction`, `lib/auth/ratelimit.ts` |
| Password guessing | Firebase Auth password verification; uniform failure message (no user enumeration) | `lib/auth/firebase-auth.ts` |
| Forged session cookie | Firebase session cookie verified server-side with `checkRevoked=true` on every request | `lib/auth/session.ts` |
| Stale claims after role change / deactivation | Trusted profile re-read per request; claim rewrite + `revokeRefreshTokens` | `admin-user.service.ts` |
| Unauthorised account creation | No public registration; provisioning only via `users:manage` action or `scripts/provision-admin.ts`; `/adminUsers` unwritable by clients | `firestore.rules` |

## Tampering

| Threat | Mitigation | Enforcement point |
|---|---|---|
| Client writes to database | Default-deny rules; all writes via Admin SDK after authorisation | `firestore.rules`, actions |
| Audit log modification | Append-only service surface; no update/delete path; rules deny all client access; scheduled export to a separate protected GCS bucket (Firestore alone is NOT immutable) | `audit.service.ts`, BACKUP_AND_RECOVERY.md |
| Unauthorised workflow transitions | Permission + four-eyes check inside each transition; transitions audited | `lib/actions/content.ts` |
| Mass assignment | Zod schemas parse every external input; writes use explicit field lists | `lib/validation/schemas.ts` |
| File content spoofing (`.exe` renamed `.pdf`) | Extension + magic-byte signature inspection + SHA-256 checksum; browser MIME never trusted | `lib/security/upload.ts` |

## Repudiation

All administrative mutations record actor UID/email/role, action, entity, timestamp, hashed IP,
correlation-ready metadata and outcome. High-risk operations (role change, account creation,
deactivation, exports) use `recordAuditStrict` — a failed audit write aborts the operation rather
than letting it complete unlogged. Failures of lenient audit writes are logged loudly, never silent.

## Information disclosure

| Threat | Mitigation |
|---|---|
| IDOR on citizen submissions | Firestore auto IDs (unguessable, non-sequential); notes only via `submissions:manage` service call; no public read path |
| Draft/unpublished content leak | Publication filter inside every public query; download route returns 404 without a session |
| Private document URL leakage | Bytes under `private/**`, unreadable by any client rule; retrieval only through the access-checked route; no permanent signed URLs |
| Internal notes exposure | Separate collection, no public endpoint, no public rule |
| Error/stack leakage | Centralised `logError`/safe messages; no stack traces or internals reach the browser |
| Secret exposure | Admin credentials server-only (`server-only` import guard); `NEXT_PUBLIC_` carries identifiers only; `.env.example` documents the distinction |
| Excessive personal data in logs | Audit summaries capped at 500 chars; IP stored only as salted SHA-256 (`PRIVACY_HASH_SECRET`); passwords/tokens/full citizen messages never logged |

## Denial of service

- Rate limits on login, password reset, public submissions, participation responses and search
  (Firestore-transaction backed — works across serverless instances, not process-local).
- Honeypot field on public forms; validation caps message sizes.
- Hard result caps on every list query; cursor-ready pagination primitives.
- Public pages degrade to labelled empty states on Firestore outage (`safeRead`); the health endpoint
  reports degradation honestly (503) without disclosing infrastructure details.

## Elevation of privilege

- RBAC matrix is the single source of truth (`lib/auth/rbac.ts`); every protected page/action/route
  re-checks the permission server-side. Hidden UI is never an authorisation control.
- Self-role-change blocked; last active SUPER_ADMIN cannot be demoted or deactivated; four-eyes rule
  on approvals. Role lives in the trusted profile, verified per request.
- MFA for privileged administrators: enrolment is performed in Firebase Auth (Identity Platform
  TOTP/SMS second factor) — see FIREBASE_SETUP.md §2.5. The password-only sign-in used by this
  application cannot enrol a factor itself; the sign-in action audits unenrolled privileged
  sign-ins and, with `MFA_ENFORCEMENT=enforce`, refuses them. The session layer rejects accounts
  the Auth layer disables.

## Kenya Data Protection Act, 2019 considerations

Citizen submissions, contact details and participation responses are treated as protected personal
data: minimised fields, consent flag recorded, salted-hash IP pseudonymisation, retention/deletion
under institutional schedule, export restricted and audited. This document does not constitute legal
certification — a formal privacy assessment by the Municipality is required (see OUTSTANDING BLOCKERS
in the engineering report).
