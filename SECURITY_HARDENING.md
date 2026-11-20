# SECURITY_HARDENING.md — production checklist

## Implemented in this codebase

- **Server-side authorisation everywhere** — RBAC matrix (`lib/auth/rbac.ts`) enforced by
  `requirePermission`/`assertPermission` in every page, action and route handler. Hidden UI is never
  an authorisation control.
- **Session security** — Firebase session cookies: `HttpOnly`, `SameSite=Lax`, `Secure` in
  production, TTL 8 h (configurable), verified with `checkRevoked=true`; refresh tokens revoked on
  logout, role change, deactivation and password reset.
- **No secrets in the browser** — `server-only` guards; Admin SDK unreachable from client bundles;
  `NEXT_PUBLIC_` carries identifiers only.
- **Input validation** — Zod on every external input; strict per-field schemas; honeypot on public
  forms; consistent safe error messages (no enumeration, no stack traces).
- **CSRF** — Origin/host check on all state-changing route handlers (`lib/security/csrf.ts`);
  Next.js Server Actions add their own origin validation.
- **Rate limiting** — Firestore-transaction backed fixed windows: login 5/10 min, password reset
  3/h, submissions 5/h, search 40/min. Works across serverless instances.
- **Upload hardening** — size cap (10 MB default), extension allow-list, magic-byte signature
  checks, CSV content screening, SHA-256 checksums, randomised object names, path-traversal-proof
  naming, attachments-only download responses with `X-Content-Type-Options` and a sandbox CSP.
- **Default-deny rules** — `firestore.rules` / `storage.rules` deny all client access except
  published-content reads.
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`
  (`next.config.ts`).

## Required from the institution before production

1. **Enrol MFA** for all SUPER_ADMIN accounts (FIREBASE_SETUP.md §2.5). Enrolment is performed in
   Firebase Authentication (Identity Platform TOTP); the application audits unenrolled sign-ins and
   can deny them entirely with `MFA_ENFORCEMENT=enforce`.
2. **Set `PRIVACY_HASH_SECRET`** to a deployment-specific 32-byte value (IP hash salt).
3. **Content-Security-Policy**: not enabled blind — introduce with nonce plumbing for Next.js inline
   chunks and test (the original team's deliberate position, retained).
4. **Malware scanning**: NOT integrated. If required, add a server-side scanning step (e.g. a
   Cloud Function running ClamAV, or an external scanning API) between upload and publication and
   quarantine unscanned objects. Do not assume the platform scans today — it does not.
5. **CAPTCHA** on public forms: the honeypot plus rate limits are the current anti-automation
   controls. Add reCAPTCHA Enterprise/Cloudflare Turnstile if submission abuse is observed.
6. **Periodic review**: audit-log spot checks, rule review, unused-account cleanup every quarter.
7. **Compromise runbook**: BACKUP_AND_RECOVERY.md §Recovery procedures.
