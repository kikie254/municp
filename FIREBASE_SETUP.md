# FIREBASE_SETUP.md — Iten–Tambach Municipality

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> → **Add project** → name it (e.g. `iten-tambach-prod`).
2. Enable **Cloud Billing** (Blaze plan) if you will exceed the free tier — required for Cloud
   Storage egress and scheduled exports.
3. Project settings → **Web app** (`</>`) → register the website. Copy the shown config values into
   the `NEXT_PUBLIC_FIREBASE_*` variables of `.env.local` (they are identifiers, not secrets).

## 2. Firebase Authentication

1. Console → **Authentication → Get started**.
2. Enable the **Email/Password** provider. Do **not** enable Email link or anonymous sign-in.
3. **Authorized domains**: add your production domain (and the Vercel preview domain if used).
4. **Templates** (Authentication → Templates): customise the password-reset email subject/sender so
   citizens and officers recognise the institutional source.
5. **MFA (privileged administrators)**: Console → Authentication → Sign-in method → enable **TOTP**
   (requires Identity Platform; SMS needs a verified sender). Each SUPER_ADMIN enrols a second
   factor after provisioning. Enrolment happens in Firebase Authentication — the password-only
   sign-in flow used by this application cannot enrol a factor on the user's behalf. Enforcement is
   configured with the `MFA_ENFORCEMENT` environment variable (see §MFA policy in
   FIREBASE_AUTHENTICATION_AUDIT.md): `report` (default) audits every sign-in made without an
   enrolled factor; `enforce` denies sign-in to a privileged account with no second factor; `off`
   is a documented institutional decision. The session layer additionally rejects accounts the
   Auth layer disables.

## 3. Firestore

1. Console → **Firestore Database → Create database** → Native mode → choose region `europe-west`
   (or the region the County's policy requires; keep data residency in mind for the DPA).
2. Deploy security rules and indexes from the repo:

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use --add                     # select the project
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

3. The application creates collections on first write; no manual seeding is required.

## 4. Cloud Storage

1. Console → **Storage → Get started** (same region as Firestore).
2. Deploy `storage.rules` (default-deny; command above).
3. Private documents live under `private/documents/{documentId}/…` — nothing under `private/**` is
   ever readable by a client. Delivery is exclusively via `/api/documents/[id]/download`.

## 5. Admin SDK credentials

Preferred (production on Google infrastructure): rely on **Application Default Credentials** and set
only `FIREBASE_ADMIN_PROJECT_ID`.

On Vercel or another host without ADC: create **Project settings → Service accounts → Generate new
private key**, then set `FIREBASE_ADMIN_CLIENT_EMAIL` and `FIREBASE_ADMIN_PRIVATE_KEY` in the host's
environment settings. Store the JSON file nowhere in the repository. Alternatively keep the key in a
secret manager and expose it via `GOOGLE_APPLICATION_CREDENTIALS`.

**The distinction that matters**: `NEXT_PUBLIC_FIREBASE_*` values identify the project and may be
public. `FIREBASE_ADMIN_*` values are privileged credentials — they are read only by server-only
modules (`lib/firebase/config.ts`) and must never be prefixed `NEXT_PUBLIC_` or copied to the browser.

## 6. Provision the first administrator

```bash
ADMIN_EMAIL=admin@municipality.go.ke \
ADMIN_PASSWORD='Use-A-Long-Passphrase-2026!' \
ADMIN_NAME='Municipal Administrator' \
npm run admin:provision
```

The account is created in Firebase Authentication (password never stored in Firestore), the profile
row is written to `/adminUsers` with the SUPER_ADMIN role, and the custom claim is set. Sign in at
`/admin/login`; enrol MFA on first sign-in. No default account exists in the source tree.

## 7. Emulator suite (local testing)

`firebase.json` configures Auth (:9099), Firestore (:8080), Storage (:9199) with UI. Start with:

```bash
firebase emulators:start --project demo-itm
FIRESTORE_EMULATOR_HOST=localhost:8080 FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199 npm run dev
```

Rules tests run against the emulators: `npm run test:rules` (see tests/rules/README).

## 8. Post-setup verification checklist

- `GET /api/health` returns `{"components":{"database":"up",…}}` with HTTP 200.
- An unauthenticated `curl` of an admin page redirects to `/admin/login`.
- Firestore rules: creating a submission via the REST API from a browser context is rejected.
- Upload a test PDF as a draft → confirm the object exists under `private/documents/…` and that a
  logged-out download attempt returns 404; a signed-in attempt returns the bytes.
