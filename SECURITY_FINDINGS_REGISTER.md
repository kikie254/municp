# SECURITY FINDINGS REGISTER — Iten–Tambach Municipality (Firebase edition)

Every finding below was confirmed against source and, where marked **verified**, reproduced or
re-tested in this audit session. Findings without live execution evidence are marked **B**
(implemented, not live-verified) — never "verified".

---

## ITM-001 — Administrator login used an invalid Admin SDK lookup — HIGH

1. **Finding ID**: ITM-001
2. **Severity**: HIGH (authentication broken)
3. **Affected file**: `lib/actions/auth.ts`
4. **Exact defect**: `getAuth().getUser(parsed.data.email)` — the Admin SDK `getUser()` accepts a
   **UID**, not an email. With a UID-shaped input it throws; it never resolves an account by email.
5. **Exploitation scenario**: No administrator could ever sign in — the login action always threw
   after a successful password check, producing a 500-class failure rather than a session. (It is
   not itself an enumeration vector, but it made the entire privileged surface unusable and pushed
   debugging toward unsafe workarounds.)
6. **Impact**: Total authentication failure of the administrator console.
7. **Recommended correction**: Look the account up with `getUserByEmail()` on the named app.
8. **Actual correction implemented**: login now resolves the profile via
   `firebaseAdminAuth().getUserByEmail(email)` inside a try/catch; a lookup failure after a valid
   password is treated as an ordinary failed sign-in (no enumeration, no stack trace).
9. **Test evidence**: `npm run typecheck` exit 0; `npm run lint` exit 0; 29/29 unit tests;
   production build exit 0. Live sign-in end-to-end requires project credentials → **B for the live
   path**; the API contract (UID vs email) is verified from the SDK typings
   (`node_modules/firebase-admin/lib/auth/identifier.d.ts`).

## ITM-002 — Privileged calls not consistently bound to the named Admin app — HIGH

1. **Finding ID**: ITM-002
2. **Severity**: HIGH
3. **Affected files**: `lib/auth/session.ts`, `lib/auth/firebase-auth.ts`,
   `lib/services/admin-user.service.ts`, `lib/actions/auth.ts`, `lib/actions/admin.ts`
4. **Exact defect**: Nine call sites used bare `getAuth()` (default app) while the project
   initialises `iten-tambach-admin`. If any other default app is ever registered (emulator harness,
   future library import), privileged operations would target the wrong project — or throw when no
   default exists.
5. **Exploitation scenario**: A misconfigured deployment (e.g. an emulator default app registered by
   test code, or ADC picking a different project) silently reads/writes identities and sessions of
   the wrong Firebase project.
6. **Impact**: Cross-project credential and session handling; hard-to-diagnose auth failures.
7. **Recommended correction**: Route every privileged call through the central accessors.
8. **Actual correction implemented**: All call sites now use `firebaseAdminAuth()`,
   `firestore()` and `storageBucket()` from `lib/firebase/admin.ts` (named-app accessors).
   `scripts/provision-admin.ts` and `scripts/migrate-to-firestore.ts` keep their own explicit
   `initializeApp(...)` — they are standalone CLI processes, documented as such.
9. **Test evidence**: grep over the tree after repair shows zero remaining bare
   `getAuth()`/`getFirestore()`/`getStorage()` default-app calls in `lib/` and `app/`;
   `npm run typecheck` and `npm run build` exit 0. **B** for runtime behaviour on Vercel/GCP (needs
   deployment).

## ITM-003 — MFA described as "required" but never enforced — MEDIUM

1. **Finding ID**: ITM-003
2. **Severity**: MEDIUM (misrepresentation of control; documentation falsely claimed enforcement)
3. **Affected files**: `lib/actions/auth.ts` (gap), `FIREBASE_SETUP.md`,
   `SECURITY_HARDENING.md`, `SECURITY_THREAT_MODEL.md`, `scripts/provision-admin.ts`, `.env.example`
4. **Exact defect**: Documentation said MFA is required for privileged administrators; the code had
   no MFA check of any kind, and the password-only sign-in flow (Identity Toolkit REST) cannot
   enrol or challenge a second factor.
5. **Exploitation scenario**: A phished or guessed SUPER_ADMIN password alone yields full
   privileged access, contradicting the documented control.
6. **Impact**: Privileged account compromise with password only.
7. **Recommended correction**: Implement Firebase-supported MFA; honestly document what the flow
   can and cannot do.
8. **Actual correction implemented**: (a) Documentation rewritten — enrolment happens in Firebase
   Authentication (Identity Platform TOTP/SMS); the application flow enrols nobody. (b) New
   `MFA_ENFORCEMENT` policy in the login action: `report` (default) writes an `MFA_MISSING` audit
   event for every privileged sign-in without an enrolled factor; `enforce` **denies** such
   sign-ins; `off` is an explicit institutional decision. Detection reads
   `UserRecord.multiFactor.enrolledFactors` from the Admin SDK. (c) `.env.example` documents the
   variable; provision-admin output points the operator at enrolment.
9. **Test evidence**: `npm run typecheck` exit 0; `npm run build` exit 0. The enforce/report
   branches require a real project with an unenrolled privileged account → **B**.

## ITM-004 — Rules test suite was never executable (claimed but not run) — MEDIUM

1. **Finding ID**: ITM-004
2. **Severity**: MEDIUM (unverified core security control)
3. **Affected files**: `vitest.config.ts`, `tests/rules/firestore.rules.test.ts`, `package.json`
4. **Exact defect**: `npm run test:rules` ran vitest with the default config whose `include` was
   `tests/unit/**` only → "No test files found" and exit 1. Two tests also used an invalid Storage
   handle (`bucketOf(...).file is not a function`) and two `any`-typed callbacks that failed lint.
   The previous report's claim that rules tests were "delivered" was true; that they had *passed*
   anywhere was never true.
5. **Exploitation scenario**: Rule regressions (e.g. opening `submissions` to clients) would never
   be caught by CI.
6. **Impact**: The primary client-side data protection had zero automated verification.
7. **Recommended correction**: Make the suite runnable and pass it.
8. **Actual correction implemented**: New `vitest.rules.config.ts` (rules-only include, emulator
   timeouts); `test:rules` script points at it; the suite self-skips when
   `FIRESTORE_EMULATOR_HOST` is absent so plain `npm run test` stays green; Storage tests rewritten
   to the modular JS SDK (`ref/uploadBytes/getBytes`); `any`-callbacks replaced with the SDK's
   `RulesTestContext`.
9. **Test evidence**: **Executed**: `npm run test:rules` — emulators started (firestore
   v1.22.0, storage rules runtime v1.1.3), **13/13 tests pass** — published-only public reads,
   deny-all confidential collections, private-object download denial, upload denial. Log:
   `logs/rules-test.log`. → **A (fixed and verified)**.

## ITM-005 — `npm run verify:api` referenced a nonexistent script — MEDIUM

1. **Finding ID**: ITM-005
2. **Severity**: MEDIUM (acceptance gate silently absent)
3. **Affected files**: `package.json` (missing `scripts/verify-api.mjs`)
4. **Exact defect**: `package.json` declared `"verify:api": "node scripts/verify-api.mjs"` but the
   file did not exist — the command always failed with MODULE_NOT_FOUND, so the documented security
   verification of the API surface had never run.
5. **Exploitation scenario**: Regressions in API authorisation/CSRF would ship unnoticed.
6. **Impact**: Unverifiable API security posture.
7. **Recommended correction**: Implement the script or remove the script entry.
8. **Actual correction implemented**: `scripts/verify-api.mjs` written: health, search bounds,
   anonymous export refusal (both export endpoints), unknown-document download, cross-origin
   (CSRF) rejection, payload validation, valid-payload intake, rate-limit behaviour observation,
   security headers. Fails loudly on assertion failure; appends evidence to `logs/verify-api.log`.
9. **Test evidence**: **Executed** against a production `next start` server: all security
   assertions pass (health degraded 503 without Firestore credentials; anonymous exports 403;
   unknown download 404; cross-origin POST 403; invalid payload 422 with field errors; headers
   nosniff + no-store). Log: `logs/verify-api.log`. → **A**.

## ITM-006 — Upload validation used `createHash` without importing it — LOW

1. **Finding ID**: ITM-006
2. **Severity**: LOW
3. **Affected file**: `lib/security/upload.ts`
4. **Exact defect**: `createHash` was referenced (checksum computation for every accepted upload)
   but never imported in the top module scope — the file's import sat after the function bodies
   (bottom-of-file duplicate). Any accepted upload threw `ReferenceError: createHash is not
   defined`.
5. **Exploitation scenario**: Not directly attacker-controlled, but it broke the entire document
   upload workflow and obscured signature-validation failures.
6. **Impact**: Document upload feature broken at runtime.
7. **Recommended correction**: Import once at module top.
8. **Actual correction implemented**: `import { createHash } from "node:crypto";` added at the top;
   the stray bottom import removed (was a duplicate-identifier typecheck error).
9. **Test evidence**: 16 upload-inspection unit tests pass (real PDF/PNG accepted, disguised
   executable rejected, disallowed extension rejected, empty file rejected, CSV binary/script
   rejection); `npm run typecheck` exit 0. → **A**.

## ITM-007 — Lint failures (2 errors, 1 warning) — LOW

1. **Finding ID**: ITM-007
2. **Severity**: LOW
3. **Affected files**: `tests/rules/firestore.rules.test.ts`,
   `scripts/migrate-to-firestore.ts`
4. **Exact defect**: Two `@typescript-eslint/no-explicit-any` errors and an unused eslint-disable
   directive — `npm run lint` exit 1, contradicting the repo's own acceptance gate.
5. **Exploitation scenario**: None directly; CI gate failure.
6. **Impact**: Broken quality gate.
7. **Recommended correction**: Type the callbacks; remove the stale directive.
8. **Actual correction implemented**: SDK `RulesTestContext` type used; stale directive removed
   with an explanatory comment on the intentional `any` (optional better-sqlite3).
9. **Test evidence**: `npm run lint` exit 0, 0 problems. → **A**.

## ITM-008 — `FINAL_PRODUCTION_AUDIT.md` described SQLite/Prisma as operational — INFORMATIONAL

1. **Finding ID**: ITM-008
2. **Severity**: INFORMATIONAL
3. **Affected files**: `FINAL_PRODUCTION_AUDIT.md` (and legacy-tree review)
4. **Exact defect**: The old report states the database is "Operational on SQLite" and storage is
   local `var/uploads` — describing the pre-Firebase build.
5. **Exploitation scenario**: An operator following the stale report would run Prisma migrations
   and provision the wrong infrastructure.
6. **Impact**: Misleading operations guidance.
7. **Recommended correction**: Mark superseded; confirm no active legacy dependency.
8. **Actual correction implemented**: Supersession notice prepended pointing at the current
   reports. Verified: the only `prisma`/SQLite references are the historical schema (excluded from
   `tsconfig`), the seed utility, and the read-only migration script (documented recovery tool);
   `lib/db.ts` performs Firestore-only connectivity checks; no production route imports Prisma;
   no bcrypt anywhere (passwords live only in Firebase Authentication).
9. **Test evidence**: grep evidence in session log; `prisma` excluded from typecheck; build exit 0.
   → **A** (documentation).

## Findings verified as NOT present (with evidence)

| Area | Conclusion | Evidence |
|---|---|---|
| Public read of drafts/submissions/admin records | Rules deny; published-only reads allowed | 13/13 emulator tests (`logs/rules-test.log`) |
| IDOR on submissions/notes | No client read path; IDs are 20-char auto IDs; admin reads permission-gated | rules tests; `lib/firebase/db.ts`; `assertPermission` calls |
| Mass assignment | Zod schemas whitelist fields; services write explicit field maps | `lib/validation/schemas.ts`, services |
| CSV/formula injection in exports | Leading `=+-@` neutralised; RFC 4180 escaping | `app/api/admin/**/export/route.ts` |
| Malicious uploads | Extension + magic-byte signature + size + CSV text scan; random object names under `private/` | 16 unit tests; `lib/security/upload.ts`, `storage.service.ts` |
| Default-deny storage | All client reads/writes denied, including `public/**` and `private/**` | emulator storage tests |
| Privilege escalation via stale claims | Role changes/deactivation/password resets revoke refresh tokens; `verifySessionCookie(token, true)`; Firestore profile is the role source | `lib/auth/session.ts`, `admin-user.service.ts` (live test → B) |
| Self-approval (four-eyes) | Server-side block in `transitionNewsAction` and equivalent actions | `lib/actions/content.ts` |
| Enumeration on login/reset | Identical failure message; generic reset response | `lib/actions/auth.ts` |
| Secret leakage | Only `.env.example` placeholders in tree; no `AIza…`/private keys in source | static scan, session log |
