# DEPLOYMENT_GUIDE.md — Iten–Tambach Municipality (Firebase edition)

## Prerequisites

- Node.js ≥ 20.9, npm
- A Firebase project configured per `FIREBASE_SETUP.md` (Auth, Firestore, Storage, rules deployed)
- First administrator provisioned (`npm run admin:provision`)

## Environment variables

Copy `.env.example` → `.env.local` (local) or the hosting provider's environment settings. Required:
`NEXT_PUBLIC_SITE_URL`, the six `NEXT_PUBLIC_FIREBASE_*` values, `FIREBASE_ADMIN_PROJECT_ID`
(+ `FIREBASE_ADMIN_CLIENT_EMAIL`/`FIREBASE_ADMIN_PRIVATE_KEY` unless using Application Default
Credentials), `FIREBASE_WEB_API_KEY`, `PRIVACY_HASH_SECRET`. Optional: `EMAIL_*`,
`MUNICIPAL_NOTIFICATIONS_EMAIL`, `MAX_UPLOAD_BYTES`, `SESSION_TTL_HOURS`.

Never commit `.env.local`, service-account JSON files or private keys.

## Deploy to Vercel

```bash
npm ci
npm run build            # verify locally first
vercel --prod            # or connect the repository in the Vercel dashboard
```

Then add every environment variable in Project → Settings → Environment Variables (Production and
Preview scopes).

## Deploy Firebase assets

```bash
npm i -g firebase-tools && firebase login && firebase use --add
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Post-deployment verification

1. `curl -s https://<domain>/api/health` → `"status":"ok"`, database `up`.
2. Public pages render (home, /news, /projects, /resources, /public-participation, /contact).
3. `/admin/login` renders; wrong password gives the uniform failure message; correct sign-in reaches
   `/admin`; logout clears the session and cannot be replayed (back-button shows the login screen).
4. Create a news draft as CONTENT_ADMIN → sign in as a different reviewer → approve → publish →
   article appears on `/news`; self-approval as the same account is blocked.
5. Upload a document as draft → logged-out download attempt 404 → publish → download works.
6. Submit a public enquiry → reference returned → visible in /admin/submissions with audit entry.
7. Verify no secrets in the client: view-source for any `FIREBASE_ADMIN_` or `PRIVATE_KEY` string —
   none must appear.

## Do not deploy without authorisation

Do not point this deployment at a live government Firebase project without explicit written
authorisation from the Municipality.
