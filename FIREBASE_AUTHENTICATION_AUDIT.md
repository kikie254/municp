# FIREBASE AUTHENTICATION AUDIT — Iten–Tambach Municipality

Audit date: 2026-11-13. Evidence: session execution logs, `logs/verify-api.log`,
`logs/verify-routes.log`, `logs/rules-test.log`, SDK typings in `node_modules/firebase-admin`.

## 1. Architecture as verified

- **Credential check**: never against a local hash. `lib/auth/firebase-auth.ts` calls the Identity
  Toolkit REST endpoint `accounts:signInWithPassword` with the server-held `FIREBASE_WEB_API_KEY`;
  the returned ID token is exchanged for a Firebase session cookie. No password, hash or token is
  stored in Firestore (`bcrypt`/`prisma` scans: zero production hits — see ITM-008 register).
- **Session cookie**: `createSessionCookie(idToken, { expiresIn: SESSION_TTL_HOURS(8h) })`, HTTP-only,
  SameSite=Lax, Secure in production, path `/`. Verified by code inspection; live issuance needs
  project credentials (B).
- **Verification on every request**: `verifySessionCookie(token, true)` — `checkRevoked=true` — then
  the Firestore `/adminUsers/{uid}` profile is loaded and must be `isActive`. The Firestore profile,
  not the token claim, is the authoritative role source.
- **Guards**: `requireUser()` in `app/admin/(dashboard)/layout.tsx` protects the whole dashboard
  group; `requirePermission()/assertPermission()` enforce the RBAC matrix on every mutation.
- **App binding (ITM-002, fixed)**: every Auth operation now goes through `firebaseAdminAuth()`
  from `lib/firebase/admin.ts` (named app `iten-tambach-admin`). Grep evidence: no default-app
  `getAuth()`/`getFirestore()`/`getStorage()` calls remain in `lib/` or `app/`.

## 2. Login sequence (Finding B) — repaired

1. Zod validation (`loginSchema`).
2. Distributed rate limit `login:{ipHash}:{email}` — 5 attempts / 10 min, transactional Firestore
   counter; blocked attempts audited (`LOGIN_RATE_LIMITED`).
3. Password verified via Identity Toolkit (`signInWithPassword`); `EMAIL_NOT_FOUND`,
   `INVALID_PASSWORD`, `INVALID_LOGIN_CREDENTIALS`, `USER_DISABLED` all return one identical failure
   message — no enumeration.
4. **Repaired (ITM-001)**: profile resolved with `firebaseAdminAuth().getUserByEmail(email)` — the
   old code called `getUser(parsed.data.email)`, which is invalid (getUser takes a UID) and would
   have thrown on every sign-in. Lookup failure after a valid password = generic failure.
5. Profile must exist and `isActive` — a deactivated or unprovisioned account cannot sign in.
6. **MFA policy (ITM-003, new)**: for SUPER_ADMIN accounts the sign-in action reads
   `UserRecord.multiFactor.enrolledFactors`; with `MFA_ENFORCEMENT=report` (default) an
   `MFA_MISSING` audit event records every sign-in without a second factor; `enforce` denies the
   sign-in outright; `off` is an explicit institutional decision.
7. Session cookie created; `lastLoginAt` touched; `LOGIN_SUCCESS` audited with IP hash + truncated
   user agent; redirect to `/admin`.

## 3. Session lifecycle — audit table

| Event | Control | Verified |
|---|---|---|
| Logout | Cookie cleared (maxAge 0) + `revokeRefreshTokens(uid)`; revocation failure never blocks sign-out | Code (B live) |
| Deactivation | `updateUser(disabled:true)` + `revokeRefreshTokens` + profile `isActive:false` | Code (B live) |
| Role change | Profile + custom claim updated + `revokeRefreshTokens` — stale claims cannot persist | Code (B live) |
| Password reset (assisted) | `updateUser(password)` + `revokeRefreshTokens` | Code (B live) |
| Self-service reset | Identity Toolkit `accounts:resetPassword`; Firebase revokes sessions on password change | Code (B live) |
| Old session after deactivation | `verifySessionCookie(token, true)` rejects revoked cookies; `isActive` re-checked from Firestore every request | Code (B live) |
| Concurrent sessions | All invalidated by revocation on role/password/deactivation changes | Code (B live) |

## 4. MFA position (honest statement)

- Real second factors (TOTP/SMS) are provided by **Firebase Identity Platform**, not this codebase.
  The application's server-action login (Identity Toolkit REST) cannot enrol or challenge a factor.
- The application therefore (a) documents enrolment as a Firebase-console step (FIREBASE_SETUP §2.5),
  (b) **audits** unenrolled privileged sign-ins (`MFA_MISSING`), and (c) can **deny** them via
  `MFA_ENFORCEMENT=enforce`. A password-only sign-in is never described as MFA-protected anywhere in
  the updated documentation.
- Enforce/report branches typechecked and built; live observation requires a project with an
  unenrolled privileged account → **B**.

## 5. Provisioning

`scripts/provision-admin.ts`: no default account, no password in source; `ADMIN_EMAIL`/
`ADMIN_PASSWORD`/`ADMIN_NAME` env-driven; password policy enforced; profile + SUPER_ADMIN claim
written; re-run re-syncs without overwriting. Output now instructs the operator to enrol TOTP and
flip `MFA_ENFORCEMENT` after enrolment.

## 6. Findings

| ID | Severity | Summary | Status |
|---|---|---|---|
| ITM-001 | HIGH | `getUser(email)` invalid — login always failed | Fixed; typecheck/build/tests pass; live sign-in → C (credentials) |
| ITM-002 | HIGH | Bare `getAuth()` on 9 call sites | Fixed; grep + build evidence |
| ITM-003 | MEDIUM | MFA claimed, never enforced | Fixed (policy + honest docs); live enforce → B/C |
