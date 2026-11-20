# PHASE 3 CHANGELOG — Real Functionality and Backend

Stack decision: **Prisma 6.19.0 with SQLite for local/offline work and PostgreSQL for production.**
Rationale: it runs with no external service in the sandbox, the same schema compiles for both providers,
migrations are files that can be reviewed and committed, and it adds exactly two dependencies
(`prisma`, `@prisma/client`) plus `zod` for validation. No ORM-alternative, auth library or queue was
introduced: sessions, hashing and rate limiting use `node:crypto` and the database already present.

## 1. Additions

### Database and migrations
* `prisma/schema.prisma` — 15 models, SQLite provider (development default), `env("DATABASE_URL")`.
* `prisma/schema.postgresql.prisma` — identical models, PostgreSQL provider, for the production switch.
* `prisma/migrations/20260101000000_init/migration.sql` + `migration_lock.toml` — committed, applied with
  `npx prisma migrate deploy` (verified: migration applied, all tables present).
* `prisma/seed.ts` — creates the first `SUPER_ADMIN` from `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME`.
  Refuses to overwrite an existing account, enforces the password policy, writes a `USER_BOOTSTRAPPED`
  audit row. No credential exists anywhere in the source tree.

### Core libraries
`lib/db.ts` (Prisma singleton, `databaseReachable()`, `safeRead()`), `lib/auth/password.ts` (scrypt,
N=16384 r=8 p=1, 64-byte key, per-password salt, `timingSafeEqual`), `lib/auth/session.ts` (DB session,
SHA-256 token hash only, httpOnly/SameSite=Lax/secure-in-production cookie, `requireUser()`,
`requirePermission()`), `lib/auth/rbac.ts` (4 roles × 12 permissions, `can()`), `lib/auth/audit.ts`,
`lib/auth/ratelimit.ts` (DB fixed window), `lib/security/tokens.ts`, `lib/security/upload.ts`
(signature sniffing), `lib/security/csrf.ts`, `lib/email/mailer.ts`, `lib/validation/schemas.ts` (zod),
`lib/queries.ts` (published reads only), `lib/admin-queries.ts` (administrative reads).

### Server actions
`lib/actions/auth.ts` (login, logout, password reset request + completion),
`lib/actions/submissions.ts` (citizen submission, participation response),
`lib/actions/content.ts` (news, projects, notices, documents, participation: save + workflow transitions),
`lib/actions/admin.ts` (submission status/assignment, case notes, users, email retry).

### Route handlers
`/api/health`, `/api/search`, `/api/submissions`, `/api/documents/[id]/download`,
`/api/admin/submissions/export`, `/api/admin/participation/[id]/export`.

### Administrative area (17 routes)
`/admin` overview, `/admin/news` + `/admin/news/[id]`, `/admin/projects` + `/admin/projects/[id]`,
`/admin/notices`, `/admin/documents`, `/admin/submissions` + `/admin/submissions/[id]`,
`/admin/participation`, `/admin/users`, `/admin/audit`, `/admin/settings`, `/admin/denied`,
`/admin/login`, `/admin/reset-password`, `/admin/reset-password/complete`.

### Public surface converted to real persistence
* `app/contact/page.tsx` and `app/feedback/page.tsx` — `PublicSubmissionForm` (server action).
* `app/public-participation/page.tsx` — lists published consultations; `[slug]` page serves them.
* `app/news`, `app/news/[slug]`, `app/projects`, `app/projects/[slug]` — published database records take
  precedence; the Phase 1 template records still resolve so no route breaks, and they stay `noindex`.
* `app/api/search` + `SearchDialog` — search runs against published records only.

## 2. Workflow

`DRAFT → IN_REVIEW → APPROVED → PUBLISHED → (unpublish)`, with `reject` returning an item to `DRAFT`.
Enforced server-side: the actor must hold `news:review`/`projects:review` to approve, and
`canApproveOwnWork()` returns `false` for every role, so a self-approval attempt is refused and logged as
`WORKFLOW_DENIED`. Editing a published article sets it back to `DRAFT` with `publishedAt = null`.

## 3. Preserved from Phase 1

Design system, all 42 Phase 1 route files, content-status policy (`verified` / `pending-verification` /
`demonstration`), `ReviewBanner`, `ContactPending`, the withdrawn `/admin-preview`, security headers,
fonts, images, `ASSET_CREDITS.md`, `MUNICIPAL_APPROVAL_CHECKLIST.md` and all Phase 1 documentation.

## 4. Deliberately NOT done (and why)

| Item | Status | Reason |
|---|---|---|
| Real email delivery | Implemented, unconfigured | No provider credential exists. Messages are stored as `NOT_CONFIGURED` and the citizen is told plainly. |
| Object storage (S3/R2) | Not implemented | Files are written to a private directory with an access-checked download route; the deployment guide documents the mount/volume requirement and the S3 swap point. |
| Multi-step approval chains | Not implemented | A single reviewer step matches the four roles requested; more steps would be speculative. |
| Rich-text editor | Not implemented | Body is plain text with blank-line paragraphs, which removes the stored-XSS surface entirely. |
| Citizen accounts / status portal | Not implemented | Would require an approved identity and privacy scheme. Status tracking exists on the administrative side (6 states). |
| Full-text search engine | Not implemented | Prisma `contains` over published records is sufficient at municipal content volumes and adds no service dependency. |
