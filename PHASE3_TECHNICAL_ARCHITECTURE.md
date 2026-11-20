# PHASE 3 — TECHNICAL ARCHITECTURE

## 1. Shape of the system

```
Browser
  │  HTML (RSC)                      ┌──────────────────────────────┐
  ├─────────────────────────────────►│ Next.js 15 App Router         │
  │  Server Action POST              │  app/(public)  · app/admin     │
  ├─────────────────────────────────►│  app/api/*  (route handlers)  │
  │                                  └───────────┬──────────────────┘
  │                                              │
  │                        ┌─────────────────────┼───────────────────────┐
  │                        ▼                     ▼                       ▼
  │                 lib/actions/*          lib/queries.ts        lib/security/*
  │                 lib/validation/*       lib/admin-queries.ts  lib/auth/*
  │                        │                     │                       │
  │                        └──────────┬──────────┘                       │
  │                                   ▼                                  ▼
  │                            lib/db.ts (Prisma)              node:crypto, fs
  │                                   │
  │                     ┌─────────────┴─────────────┐
  │                     ▼                           ▼
  │            SQLite (dev / offline)      PostgreSQL (production)
  │                     │
  │            var/uploads (private files) ──► /api/documents/[id]/download
  │
  └── lib/email/mailer.ts ──► Resend HTTPS API  (or NOT_CONFIGURED, honestly)
```

One deployable unit. No separate backend service, no message broker, no external auth server: the
municipality can host it on any Node 20.9+ host (VPS, Vercel, Render, Azure App Service) with a managed
Postgres instance.

## 2. Layers and their single responsibility

| Layer | Files | Rule |
|---|---|---|
| Presentation | `app/**/page.tsx`, `components/**` | Renders. Server Components read through `lib/queries.ts`; Client Components hold only transient UI state. |
| Mutation | `lib/actions/*.ts` (`"use server"`) | The only way data changes. Each action: `assertPermission` → `zod` parse → database write → audit row → `revalidatePath`. |
| HTTP API | `app/api/**/route.ts` | Machine intake and file delivery. Same-origin check, rate limit, validation, no HTML. |
| Data access | `lib/queries.ts` (published only), `lib/admin-queries.ts` (all records) | Publication filtering lives in the SQL `where` clause, never in the component. |
| Domain rules | `lib/auth/rbac.ts`, `lib/content.ts`, `prisma/schema.prisma` | Roles, permissions, publication status semantics. |
| Infrastructure | `lib/db.ts`, `lib/security/*`, `lib/email/mailer.ts` | Connections, hashing, uploads, tokens, outbound mail. |

## 3. Request paths

**Public read.** `GET /news/[slug]` → `getNewsBySlug()` → `SELECT … WHERE status='PUBLISHED' AND publishedAt<=now AND archivedAt IS NULL` → if no row, the Phase 1 template of the same slug is served with `robots: noindex`; otherwise `notFound()`.

**Citizen write.** `POST /contact` (Server Action `submitSubmissionAction`) → `sameOrigin()` → `submissionSchema` → failure returns field errors to the same page; success → rate limit → `prisma.submission.create` with a public reference → internal notification + acknowledgement through `sendMail` → `recordAudit("SUBMISSION_RECEIVED")` → response renders the reference, and states `emailStatus` truthfully.

**Administrative write.** `POST /admin/news/[id]` (`saveNewsAction`) → `assertPermission("news:write")` → `newsSchema` → update → if the record was `PUBLISHED`, set `status=DRAFT, publishedAt=null` → `recordAudit` → `revalidatePath` on `/admin/news`, `/news`, `/news/[slug]`.

**File delivery.** `GET /api/documents/[id]/download` → published document: stream with `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy: default-src 'none'; sandbox`. Unpublished document: requires a session, else 404. Missing bytes on disk: 410.

## 4. Rendering and caching

| Route class | Strategy | Why |
|---|---|---|
| Static marketing pages (`/about`, `/governance`, `/investment`, `/services/[slug]`, …) | Prerendered at build | No per-request data |
| Listings that read the database (`/news`, `/projects`, `/public-participation/[slug]`) | `dynamic = "force-dynamic"` | A withdraw or publish must take effect immediately, not after a rebuild |
| Administration | `force-dynamic` on every page | Session-scoped content, `noindex` metadata |
| Sitemap | Generated at request time from published records | Unpublished routes must never be listed |

There is no `revalidate` window on public database pages: correctness beats cache hits for municipal
notices, and the queries are indexed counts and `findMany` with a small `take`.

## 5. Failure behaviour

* **Database unreachable** — `safeRead()` returns the caller's fallback (`[]`/`null`), so pages render their labelled empty state instead of a 500; `/api/health` returns 503 and `/admin/settings` shows the failing check. Writes are refused, never queued silently.
* **Email unconfigured** — `sendMail` returns `{status:"NOT_CONFIGURED"}`, the outbox row records it, and the citizen-facing message says no email was sent. No fake success.
* **Upload directory missing** — `storeFile` creates it (`mkdir -p`); a permission error surfaces as a failed action with a message, not a silent no-op.
* **Session expired mid-form** — the action returns `"Your session has expired. Sign in again."`; nothing is written.

## 6. Scale and maintenance

Indexes exist on every filter used by the public queries (`status+publishedAt`, `category`,
`status+publishedAt+expiresAt`). Content volume for a municipality (hundreds of records) is far below
where a search service is justified; `contains` queries over indexed columns remain fast. The migration
folder is linear and forward-only, so a future change is a new folder plus `prisma migrate deploy`.
