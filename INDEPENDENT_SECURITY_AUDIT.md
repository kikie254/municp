# INDEPENDENT SECURITY AUDIT — Iten–Tambach Municipality (Firebase edition)

Audit date: 2026-11-13. Independent verification performed against the delivered ZIP
`iten-tambach-municipality-firebase.zip` on Node 22.23.4 / npm 10.9.9. Nothing in this report is
taken from previous audit claims: every result below comes from a command executed in this session,
and commands that could not run are named with the exact reason.

## 1. Verdict

The delivered implementation is a genuine Firebase migration, not a facade: the site reads and
writes Firestore through the Admin SDK, authentication is delegated to Firebase Authentication, and
documents are stored in Cloud Storage behind a default-deny ruleset. The two headline defects from
the audit brief were confirmed and repaired (Finding A: privileged calls not consistently bound to
the named `iten-tambach-admin` app; Finding B: an invalid `getAuth().getUser(email)` call in the
login path that would throw on every sign-in). Rules testing, previously claimed but never actually
executable, was repaired and **executed**: 13/13 Firestore+Storage emulator tests pass. The
production build, route sweep, API security checks and unit suite all pass with execution evidence
in `logs/`.

The application is **deployable but not yet production-certified**: live end-to-end sign-in, MFA
enrolment, session revocation against the real project and the role/permission storage matrix
require the institution's Firebase credentials (category C items, §5).

## 2. What was executed (evidence)

| Command | Result | Evidence |
|---|---|---|
| `npm ci` | 598 packages installed | session log |
| `npm run typecheck` | exit 0 (re-run after every code change) | session log |
| `npm run lint` | exit 0, 0 errors 0 warnings (2 pre-existing errors fixed) | session log |
| `npm run test` | **29/29** unit tests pass (3 files) | session log |
| `npm run test:rules` | **13/13** rules tests pass against Firestore + Storage emulators (firebase-tools 15.36.0, OpenJDK 21) | `logs/rules-test.log` |
| `npm run build` | exit 0, First Load JS 103 kB | session log |
| `npm run verify:routes` | **41/41 public routes HTTP 200**, security headers + internal-link crawl clean | `logs/verify-routes.log` |
| `npm run verify:api` | **12/12 security assertions pass** (new script — previously missing) | `logs/verify-api.log` |
| `npm audit --omit=dev` | 13 vulnerabilities (5 high, 8 moderate) — see §4 | session log |
| Credential-leak static scan | no real keys in source; only `.env.example` placeholders | session log |

## 3. Forensic map (Phase 1)

- **Routes**: 15 static public pages + 26 slug/listing pages + `/admin/**` (dashboard group guarded
  by `requireUser()` in `app/admin/(dashboard)/layout.tsx`) + API (`/api/health`, `/api/search`,
  `/api/submissions`, `/api/documents/[id]/download`, `/api/admin/submissions/export`,
  `/api/admin/participation/[id]/export`). All 41 public routes verified 200.
- **Server actions**: `lib/actions/{auth,admin,content,submissions}.ts` — every mutation begins with
  `assertPermission(<permission>)` against the server-side session.
- **Firebase init**: single named app `iten-tambach-admin` in `lib/firebase/admin.ts`, cached on
  `globalThis` in dev; service-account or Application Default Credentials. After repair, **every**
  privileged call routes through `firebaseAdminAuth()` / `firestore()` / `storageBucket()` from this
  module (see ITM-002).
- **Firestore access**: all through `lib/firebase/db.ts` helpers — bounded queries (`MAX_PAGE = 500`),
  auto IDs, malformed-ID rejection, timestamp conversion.
- **Dead code / duplicates**: `createPasswordResetLink` in `lib/auth/firebase-auth.ts` is unused
  (the action uses its own wrapper) — harmless, retained. `scripts/check-source.mjs` is a build
  helper, not a security control. No conflicting Prisma/SQLite service remains active (ITM-008).

## 4. Residual risks (category E)

| Risk | Detail |
|---|---|
| Dependency advisories | `@grpc/grpc-js` (high, transitive of firebase-admin 12; fix is the breaking firebase-admin 14 upgrade), `zod` (high; fix is zod 4 — breaking for schema author), `uuid` (moderate, transitive). None are remotely exploitable in this architecture (no gRPC server is exposed; zod is fed bounded form payloads), but upgrading firebase-admin/zod is the recommended next maintenance window. |
| Audit immutability | Firestore audit logs are append-only **at application level**; Firestore is not immutable storage. The documented control (scheduled export to a protected GCS bucket, BACKUP_AND_RECOVERY.md) must actually be provisioned by the institution. |
| Rate limiter fail-open | On a Firestore outage the limiter fails open (logged loudly). Acceptable for availability; consider a CDN-level limit at the edge. |
| IP attribution | `x-forwarded-for` is client-spoofable upstream of the proxy; IP values are only used hashed for rate limiting, never for authorisation. |

## 5. Acceptance classification

- **A — Fixed and verified**: ITM-001, ITM-002, ITM-004, ITM-005, ITM-006, ITM-007, ITM-008 (see
  SECURITY_FINDINGS_REGISTER.md for per-finding test evidence).
- **B — Implemented, not live-verified**: MFA enforcement path (code + typecheck verified; needs a
  privileged account with an unenrolled factor to observe the deny), session revocation against a
  real project, storage role matrix, administrator dashboard workflows.
- **C — Requires Firebase production credentials**: live sign-in end to end, Identity Platform TOTP
  enrolment, rules deployment, emulator-free rule re-check against the real project.
- **D — Requires institutional approval**: enabling `MFA_ENFORCEMENT=enforce`, email provider
  selection, audit archival bucket, go-live sign-off.
- **E — Remaining risks**: §4 above.
