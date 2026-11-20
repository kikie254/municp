# UPDATED DEPLOYMENT GUIDE — Iten–Tambach Municipality (Firebase edition)

This guide supersedes DEPLOYMENT_GUIDE.md where they differ, and reflects the code as repaired in
the 2026-11-13 audit. Prerequisites: Node ≥ 20.9, npm ≥ 10, a Firebase project on the Blaze plan
(Identity Platform for MFA), firebase-tools CLI.

## 1. Firebase project setup (console)

1. Create/select the project; note the project ID and web config values.
2. **Authentication → Sign-in method**: enable **Email/Password** only. Do not enable anonymous or
   email-link sign-in.
3. **Authorized domains**: add the production domain (and the preview domain if used).
4. **Identity Platform**: required for MFA. Enable and turn on the **TOTP** second factor for
   privileged administrator enrolment (SMS is an alternative but needs a verified sender and has
   per-message cost).
5. **Templates**: customise the password-reset email so it is recognisably institutional.
6. **Firestore**: create a Native-mode database (choose the region required by the County's data
   residency policy).
7. **Storage**: create the default bucket.

## 2. Deploy rules and indexes

```bash
firebase login
firebase use --add                 # select the project
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Rules are default-deny (`firestore.rules`, `storage.rules`). Verify locally first:
`npm run test:rules` — 13/13 tests must pass (they run the Firestore and Storage emulators; Java 17+
required).

## 3. Service account

Create a service account with roles **Firebase Admin SDK Administrator Service Agent** and
**Service Account Token Creator** (or use the built-in `firebase-adminsdk` account), generate a JSON
key, and store it in the hosting provider's secret store — never in the repository.

## 4. Environment variables

Copy `.env.example` and set every value in the hosting provider (Vercel project settings →
Environment Variables, or equivalent). Highlights:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Public project identifiers (safe to expose). |
| `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` | Privileged service-account credential. On Google infrastructure you may omit these and rely on Application Default Credentials instead. |
| `FIREBASE_WEB_API_KEY` | Server-held key for the Identity Toolkit password endpoints. |
| `PRIVACY_HASH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` — rotate on request. |
| `SESSION_TTL_HOURS` | Session cookie lifetime (default 8). |
| `MFA_ENFORCEMENT` | `report` (default) until every SUPER_ADMIN has enrolled TOTP, then `enforce`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin; used in reset links and metadata. |
| `EMAIL_*`, `MUNICIPAL_NOTIFICATIONS_EMAIL` | Transactional mail (Resend or compatible). |
| `MAX_UPLOAD_BYTES` | Upload cap (default 10 MB). |

## 5. Provision the first administrator

```bash
ADMIN_EMAIL=… ADMIN_PASSWORD=… ADMIN_NAME=… npm run admin:provision
```

No default account exists anywhere in the source. The password policy is enforced by the script.
Afterwards: enrol a TOTP second factor for that account (Identity Platform), then set
`MFA_ENFORCEMENT=enforce`.

## 6. Build and deploy

```bash
npm ci
npm run build
npm start          # or deploy to Vercel — the app runs on Next.js 15 serverless
```

## 7. Post-deployment verification (run in order)

```bash
curl -s https://<domain>/api/health        # expect {"status":"ok"}
node scripts/verify-routes.mjs             # BASE=https://<domain> — 41/41 expected 200
BASE=https://<domain> node scripts/verify-api.mjs   # security assertions must pass
```

Then manually confirm: administrator sign-in (with and without an enrolled second factor, per
`MFA_ENFORCEMENT`), a complaint submission → reference number → administrator case view, a document
upload → authorised download, and an audit entry for each of those operations in `/admin/audit`.

## 8. Operational controls

- **Backups**: scheduled Firestore export to a protected GCS bucket per BACKUP_AND_RECOVERY.md —
  required for audit-record tamper resistance (Firestore alone is not immutable storage).
- **Monitoring**: `/api/health` returns 503 when Firestore is unreachable — wire it to your
  uptime checker.
- **Data protection**: citizen submissions and internal notes have no client read path (rules
  tested); exports are permission-gated, audited and CSV-formula-neutralised. Retention and
  deletion follow the privacy policy; the migration script never modifies legacy data.
- **Rollback**: redeploy the previous release; Firestore schema changes are additive (no destructive
  migrations exist in this application).
