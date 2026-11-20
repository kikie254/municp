# ENVIRONMENT SETUP

## 1. Requirements

| Component | Version | Notes |
|---|---|---|
| Node.js | ≥ 20.9.0 (tested on 22.23.4) | `package.json` `engines` |
| npm | 10.x (lockfile v3) | `package-lock.json` is committed and is the source of truth |
| Database | SQLite 3 (dev) or PostgreSQL 14+ (production) | Prisma 6.19.0 |
| Disk | writable directory for `UPLOAD_DIR` and the SQLite file | Must be outside `/public` |

## 2. Local install

```bash
npm ci                     # uses the committed lockfile; runs prisma generate on postinstall
cp .env.example .env       # then edit DATABASE_URL and the seed values
npm run db:migrate         # applies prisma/migrations/20260101000000_init
ADMIN_EMAIL=you@example.go.ke ADMIN_PASSWORD='YourStrongPassword1!' npm run db:seed
npm run dev                # http://localhost:3000
```

Sign in at `/admin/login`. Create further accounts in **User management**; do not add them to the seed.

## 3. Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | `http://localhost:3000` | Canonical origin for metadata, canonical tags, Open Graph, sitemap, robots. No trailing slash. Inlined at build time. |
| `DATABASE_URL` | Yes | `file:./var/data/app.db` | Prisma connection string. Use a pooled Postgres URL in production. |
| `PRIVACY_HASH_SECRET` | Production | development fallback | Salt for IP hashes and rate-limit keys. Generate 32 random bytes as hex. |
| `SESSION_TTL_HOURS` | No | `8` | Administrative session lifetime. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Seed only | — | First super administrator. Never commit these. |
| `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM` | No | — | Outbound mail. Without them messages are recorded as `NOT_CONFIGURED`. |
| `MUNICIPAL_NOTIFICATIONS_EMAIL` | No | `[email removed]` | Internal recipient for citizen submissions. |
| `UPLOAD_DIR` | No | `./var/uploads` | Private document storage. |
| `MAX_UPLOAD_BYTES` | No | `10485760` | Upload ceiling. |
| `NEXT_PUBLIC_ADMIN_PREVIEW` | No | unset | Phase 1 static review route. Any value other than `enabled` keeps it at 404. |

## 4. Safe start behaviour

The application starts with only `DATABASE_URL` set. What each missing value does:

* **No `NEXT_PUBLIC_SITE_URL`** — canonical URLs fall back to `http://localhost:3000`. This is correct for local work and must be fixed before launch, because canonical tags would otherwise point at localhost.
* **No `PRIVACY_HASH_SECRET`** — hashes use a fixed development salt. Personal data is still not stored in clear, but the salt is public, so `/admin/settings` shows the check as failing.
* **No email credentials** — submissions are stored and given a reference; the citizen is told that no acknowledgement email could be sent; `/admin/settings` lists `NOT_CONFIGURED`; the outbox can be re-queued later.
* **No `UPLOAD_DIR`** — defaults to `./var/uploads`, created on first upload.
* **Database unreachable** — public pages render their empty states, `/api/health` returns 503, `/admin/login` explains that sign-in is unavailable. Nothing is silently accepted.

## 5. Verifying a fresh install

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # eslint .
npm run test          # vitest run  (unit suite)
npm run build         # next build
npm run verify:routes # optional: needs a running server on BASE (default :3123)
```

## 6. Administrator lifecycle

1. First super administrator: `npm run db:seed` with the three `ADMIN_*` variables.
2. Further administrators: `/admin/users` → *Add an administrator*. Role and initial password are set there.
3. Password reset: `/admin/reset-password` → email with a 60-minute single-use link. If no email provider is configured the action says so and instructs the user to ask a super administrator, rather than pretending a mail was sent.
4. Disabling an account deletes its sessions immediately; the last active super administrator cannot be disabled and nobody can disable themselves.
