# Iten–Tambach Municipality — Demonstration Website

**Status:** Demonstration project for institutional review. This repository and its deployment are not an approved official publication of Iten–Tambach Municipality or the County Government of Elgeyo Marakwet. Do not represent this site as officially endorsed.

## Architecture

- **Framework:** Next.js 15.5.29 App Router
- **UI:** React 19, TypeScript 5.7, Tailwind CSS 3.4
- **Authentication:** Firebase Authentication with server-verified HTTP-only sessions
- **Authorisation:** server-side role and permission checks
- **Database:** Cloud Firestore via Firebase Admin SDK
- **Files:** Firebase Cloud Storage; private files are served through authorised application routes
- **Validation:** Zod schemas
- **Tests:** Vitest unit tests, Firebase emulator rules tests and Playwright E2E specifications
- **Hosting:** Vercel

This is not a frontend-only project. It contains server actions, API routes, Firebase services, administrator workflows, file handling, audit logging and backup/restore utilities. The retained `prisma/` directory is legacy/migration material; the active application data path is Firestore.

## Safe demonstration defaults

- The public site displays a site-wide demonstration notice.
- Search engines are asked not to index the site.
- Public complaint, enquiry and consultation submissions are **disabled by default**. The server actions and API route reject intake unless both `MUNICIPAL_PUBLICATION_APPROVED=true` and `PUBLIC_SUBMISSIONS_ENABLED=true` are explicitly configured.
- Do not set either approval switch until the Municipality has approved the publication, privacy notice, data controller, processors, retention policy, notification recipient and operational handling process.
- `MUNICIPAL_NOTIFICATIONS_EMAIL` has no placeholder fallback. If it is absent or invalid, internal email notification is not sent.
- County branding is not included in the active UI pending written permission.
- No real administrator account or production credential is committed to this repository.

## Local development

Requires Node.js 20.9+ and npm 10.x.

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run test:rules
npm run check:source
npm run build
```

Route and API checks require a running local server:

```bash
npm run build
npm start
```

In another terminal:

```bash
BASE=http://127.0.0.1:3000 SITE_ORIGIN=http://127.0.0.1:3000 npm run verify:routes
BASE=http://127.0.0.1:3000 SITE_ORIGIN=http://127.0.0.1:3000 npm run verify:api
```

The API verification script expects public intake to be disabled by default. If testing the enabled intake path, use a disposable Firebase emulator/test project and set both `MUNICIPAL_PUBLICATION_APPROVED=true` and `PUBLIC_SUBMISSIONS_ENABLED=true` for the server and test process. The valid-payload test can create a database record; never run it against production data.

## Environment configuration

See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) and [FIREBASE_SETUP.md](FIREBASE_SETUP.md). The principal server-side values are:

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL` and `FIREBASE_ADMIN_PRIVATE_KEY`, or `GOOGLE_APPLICATION_CREDENTIALS`
- `FIREBASE_WEB_API_KEY`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_SITE_URL`
- `PRIVACY_HASH_SECRET` (at least 32 characters)
- `MFA_ENFORCEMENT`
- `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM`
- `MUNICIPAL_NOTIFICATIONS_EMAIL` (must be a verified, institutionally approved address)
- `BACKUP_GCS_BUCKET`

Never commit `.env` files, service-account JSON, private keys, API tokens or administrator credentials.

## Deployment safety

The active production branch is `master`. Do not push directly to it or merge a pull request that changes production without explicit deployment authorisation. Use a separate feature branch and inspect the Vercel Preview deployment first. A Preview deployment is not evidence that Firebase credentials, email delivery, administrator MFA or backup/recovery are operational.

The repository's Vercel Git integration may automatically deploy pushes to its configured production branch. This repository-level instruction does not override that Vercel project setting; an authorised project owner must review and control the production-branch configuration.

## Institutional approvals still required

Before official publication, obtain written confirmation of:

- adopted municipal charter and current Board/Manager appointment records
- institutional identity, approved branding and image licences
- municipal contact details, responsible offices and service responsibilities
- project/news records and document publication authority
- editorial approval and public-notice procedures
- privacy controller, legal basis, processor contracts, data residency, retention and rights handling
- authorisation to enable public submissions and approved notification recipient
- Firebase project ownership, administrator accounts, MFA, deployed rules, backups and recovery tests
- domain, hosting, repository and administrative ownership

See [MUNICIPAL_APPROVAL_CHECKLIST.md](MUNICIPAL_APPROVAL_CHECKLIST.md), [ASSET_CREDITS.md](ASSET_CREDITS.md), and [BACKUP_AND_RECOVERY.md](BACKUP_AND_RECOVERY.md).

## Audit documentation

Historical audit reports describe earlier repository revisions and must not be treated as current runtime evidence. The current source-level findings and outstanding verification items are recorded in `GOVERNMENT_GRADE_AUDIT_REPORT.md`.
