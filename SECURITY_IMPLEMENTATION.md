# SECURITY IMPLEMENTATION

Principle: every control below is enforced on the server. Client-side checks exist only to make the
interface pleasant; removing the browser does not remove the control.

## 1. Authentication

| Control | Implementation | Verified how |
|---|---|---|
| Password storage | `scrypt` (RFC 7914), N=16384, r=8, p=1, 64-byte key, 16-byte random salt per password, encoded `scrypt$N$r$p$salt$hash` | Unit tests: hash does not contain the plaintext, 6 segments, two hashes of the same password differ (`tests/unit/password.test.ts`) |
| Comparison | `crypto.timingSafeEqual`; malformed stored hash returns `false` instead of throwing | Unit test |
| Policy | ≥ 12 characters, upper, lower, digit, symbol — enforced in the seed, user creation and reset completion | Unit test (`passwordPolicyIssues`) |
| Session token | 32 random bytes, base64url, delivered as an `httpOnly` cookie; **only** `sha256(token)` is stored | `lib/auth/session.ts`, schema comment on `Session.tokenHash` |
| Cookie flags | `httpOnly`, `sameSite: "lax"`, `secure` when `NODE_ENV=production`, `path=/` | Source |
| Session lifetime | `SESSION_TTL_HOURS` (default 8); expired rows are deleted on read and every session is revoked when a password changes or an account is disabled | Source + `completePasswordResetAction` |
| Login enumeration | Wrong password, unknown email and inactive account all return the identical string `"Email address or password is incorrect."` | Playwright test asserts the alert text |
| Login rate limit | 5 attempts / 10 minutes keyed on `sha256(ip + email)`; a blocked attempt writes `LOGIN_RATE_LIMITED` | Source |
| Password reset | Single-use token, 60-minute expiry, always the same response regardless of account existence, 3 requests / hour, all sessions revoked on completion | Source |
| First administrator | `npm run db:seed` reading `ADMIN_EMAIL`/`ADMIN_PASSWORD`; refuses to overwrite; no credential in the repository | Seed executed in session: `Created super administrator admin@iten-tambach.go.ke` |

## 2. Authorisation

Four roles, twelve permissions (`lib/auth/rbac.ts`). `requirePermission()` runs inside the layout and again
inside each action (`assertPermission`), so a direct action invocation is refused even if the page is
skipped. Evidence from this session:

* 13 administrative routes without a cookie → **307 redirect to `/admin/login`** (all 13).
* The same 13 routes with a valid session → **200**.
* `/api/admin/submissions/export` without a session → **403 `{"error":"Not authorised."}`**.
* `can()` unit tests: `CONTENT_ADMIN` cannot `users:manage`; `PROJECT_ADMIN` cannot `news:write` or
  `news:review`; `REVIEWER` can review but not author.

**Four-eyes rule.** `canApproveOwnWork()` returns `false` for every role, and the transition actions
compare `record.authorId` with the acting user before approving, publishing or rejecting. A refusal is
written to the audit log as `WORKFLOW_DENIED`. This is tested for all four roles.

## 3. Input handling

* Every mutation parses through a `zod` schema (`lib/validation/schemas.ts`); unknown fields are dropped.
* Field length caps on every string (message 6,000 chars, article body 40,000, note 4,000).
* Kenyan phone format validated; email lower-cased and length-capped.
* Consent is `z.literal(true)` — a submission cannot be stored without it.
* Honeypot `website` must be empty; a filled honeypot returns a decoy reference and stores nothing.
* Body content is plain text rendered as paragraphs — no HTML is accepted from any editor, which removes
  the stored-XSS surface for municipal content.

## 4. Output handling / XSS

React escapes all interpolated values. The only `dangerouslySetInnerHTML` in the project is the JSON-LD
block in `components/GovernmentJsonLd.tsx`, which serialises a static object. Search input is echoed into
an `aria-live` region as text. Probe: `GET /api/search?q=<script>alert(1)</script>` returned **200** with
the term reflected as JSON text, not as markup.

## 5. CSRF

* Server Actions: Next.js verifies the action's origin and a per-deployment action identifier.
* REST handlers: `sameOrigin()` compares the `Origin` header host with the request host; a mismatch is
  refused before parsing. Verified: `POST /api/submissions` with `Origin: https://evil.example` returned
  **403**.
* No state-changing GET endpoint exists.

## 6. File upload and delivery

| Control | Implementation |
|---|---|
| Extension allow-list | `.pdf .docx .xlsx .csv .jpg .jpeg .png .webp` |
| Content signature | First bytes compared against the declared type; an `MZ` executable named `.pdf` is rejected (unit test) |
| Size | `MAX_UPLOAD_BYTES`, default 10 MB (unit test rejects an oversized file) |
| CSV hardening | Binary NUL bytes and embedded `<script` rejected |
| Filename | `path.basename` + character stripping + `{}`-free random storage key; traversal test confirms `../../etc/passwd` cannot escape |
| Storage | Private directory, mode `0o640`, outside `/public`; never a public URL |
| Delivery | `/api/documents/[id]/download` with `Content-Disposition: attachment`, `nosniff`, `CSP: default-src 'none'; sandbox`; unpublished + no session → 404; missing bytes → 410 |

## 7. Rate limiting

Database-backed fixed windows, keyed on `sha256("rl:" + key)`, failing open with a log line if the
database is down (availability over strictness for a public municipal service):

| Scope | Limit |
|---|---|
| Submission (form and API) | 5 / hour per address |
| Participation response | 5 / hour per address |
| Search | 40 / minute per address |
| Login | 5 / 10 minutes per address+email |
| Password reset request | 3 / hour per address |

Verified live: seven consecutive submissions returned `201 201 201 201 429 429 429`.

## 8. Secrets and configuration

`.env` is git-ignored; `.env.example` contains placeholders only. No secret is referenced in a Client
Component — `lib/auth/*`, `lib/email/*` and `lib/security/*` import `server-only` where they touch
credentials. `/api/health` and `/admin/settings` report *whether* a value is configured, never the value.
`PRIVACY_HASH_SECRET` salts every stored IP hash; when unset, `/admin/settings` marks it as missing.

## 9. Audit trail

`AuditLog` is append-only by application design (no update or delete path exists). It records actor id,
actor email, action, entity type and id, a ≤ 500-character summary, a hashed source address and the time.
Actions covered: sign-in success/failure/rate-limit, sign-out, password reset requested/completed, all
content create/update/transition events, workflow denials, submission receipt and status changes, case
notes, user creation/update/deactivation, CSV exports, email re-queue.

## 10. Headers

`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy:
strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`,
`X-Powered-By` suppressed. Confirmed by `curl -I` on `/`. A route-scoped CSP is applied to document
downloads; a site-wide CSP is NOT implemented and is listed as a known limitation.

## 11. Dependency posture

Runtime dependencies: `next`, `react`, `react-dom`, `@prisma/client`, `prisma`, `zod`, `lucide-react` —
seven. `npm audit` was not executed in this session because the sandbox registry call was not available;
it is listed as NOT TESTED rather than reported as clean.
