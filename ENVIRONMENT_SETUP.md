# Environment Setup — Iten–Tambach Municipality Demonstration Website

This repository's active backend uses Firebase. The older SQLite/Prisma instructions in previous revisions are obsolete; `prisma/` is retained only as legacy/migration material.

## Requirements

| Component | Version / requirement |
|---|---|
| Node.js | 20.9 or newer |
| npm | 10.x recommended |
| Framework | Next.js 15.5.29 |
| Database | Cloud Firestore |
| Authentication | Firebase Authentication |
| File storage | Firebase Cloud Storage |
| Local testing | Firebase Emulator Suite, Java runtime for emulators |

## Local install

```bash
npm ci
npm run dev
```

Create `.env.local` locally. Do not commit it. Use a dedicated Firebase development or emulator project, never production credentials.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical HTTPS site origin |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project identifier |
| `FIREBASE_ADMIN_PROJECT_ID` | Yes | Firebase Admin SDK target; must match the intended project |
| `FIREBASE_ADMIN_CLIENT_EMAIL` + `FIREBASE_ADMIN_PRIVATE_KEY` | One credential method required | Service-account credentials; alternatively use ADC |
| `GOOGLE_APPLICATION_CREDENTIALS` | Alternative | Path to a service-account JSON held outside the repository |
| `FIREBASE_WEB_API_KEY` | Yes | Server-side Identity Toolkit sign-in/reset flow |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | For file workflows | Cloud Storage bucket identifier |
| `PRIVACY_HASH_SECRET` | Production | At least 32 characters; salt for pseudonymised network identifiers |
| `MFA_ENFORCEMENT` | Institutional decision | `report`, `enforce` or `off`; enforcement requires enrolled privileged accounts |
| `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM` | Optional | Outbound email integration |
| `MUNICIPAL_NOTIFICATIONS_EMAIL` | Optional, but required for internal email alerts | Verified institutional recipient; there is no placeholder fallback |
| `MUNICIPAL_PUBLICATION_APPROVED` | **Defaults to false** | Explicit institutional approval gate. When false, the site displays the demonstration notice, is noindex and has no sitemap. |
| `PUBLIC_SUBMISSIONS_ENABLED` | **Defaults to disabled** | Public intake is enabled only when both this and `MUNICIPAL_PUBLICATION_APPROVED` are `true` after written approval of the public channel and its privacy/operational controls |
| `BACKUP_GCS_BUCKET` | Recommended | Separate protected bucket for scheduled Firestore exports |

Run the environment check without exposing values:

```bash
npm run env:check
npm run env:check:strict
```

The checker prints variable names and presence only. It must never print secret values.

## Safe public-intake policy

Public forms and `POST /api/submissions` are disabled unless both `MUNICIPAL_PUBLICATION_APPROVED=true` and `PUBLIC_SUBMISSIONS_ENABLED=true`. The UI hides the input fields when disabled; the server actions and API route independently reject direct requests. Keep the flag unset on the demonstration deployment.

Before enabling it, the Municipality must approve the website as an official channel, publish an approved privacy notice, designate the data controller/contact, confirm processor arrangements and data residency, set retention/deletion periods, provision authorised staff, test escalation and response procedures, and supply a verified `MUNICIPAL_NOTIFICATIONS_EMAIL`.

Use only a disposable emulator or test Firebase project when testing the enabled path. The API verification script includes a valid submission probe that may create a database record.

## Administrator provisioning

No default administrator account exists. Provision an administrator only in an authorised Firebase project:

```bash
ADMIN_EMAIL='verified-admin@example.org' \
ADMIN_PASSWORD='use-a-unique-long-passphrase' \
ADMIN_NAME='Approved Administrator' \
npm run admin:provision
```

The values above are examples for local shell syntax only; do not use them as actual credentials. Enrol MFA for privileged users and test sign-in/session revocation against the intended Firebase project.

## Testing

```bash
npm run typecheck
npm run lint
npm run test
npm run test:rules
npm run build
```

For route/API smoke tests, start the built server and run `npm run verify:routes` and `npm run verify:api` from another terminal. Do not run write-capable verification probes against production data.

## Backup and recovery

The presence of backup scripts is not proof that scheduled exports, retention locks or recovery tests exist. Follow [BACKUP_AND_RECOVERY.md](BACKUP_AND_RECOVERY.md), configure a separate institutional backup bucket and perform a documented restore test before go-live.
