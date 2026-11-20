# FIREBASE_ARCHITECTURE.md — Iten–Tambach Municipality

## Overview

The platform's backend is Firebase. Prisma/SQLite has been removed as a production dependency.

| Concern | Service | Entry point |
|---|---|---|
| Primary database | Cloud Firestore (Native mode) | `lib/firebase/admin.ts` → `firestore()` |
| Administrator identity | Firebase Authentication (email/password, session cookies) | `lib/auth/session.ts`, `lib/auth/firebase-auth.ts` |
| Document & media storage | Firebase Cloud Storage | `lib/services/storage.service.ts` |
| Trusted server operations | Firebase Admin SDK (server-only) | `lib/firebase/admin.ts` |
| Email notifications | HTTP provider (Resend-compatible) + `/emailOutbox` | `lib/services/email.service.ts` |

## Separation of trust

- **Browser**: renders server-generated pages only. It performs no direct Firestore reads or writes.
  The Firestore and Storage security rules default-deny every client operation.
- **Server (Next.js server actions and route handlers)**: the only code path to data. Every action
  re-verifies the Firebase session cookie, loads the trusted profile from `/adminUsers`, and checks
  the RBAC permission (`lib/auth/rbac.ts`) before touching data.
- **Admin SDK**: initialised exactly once (`lib/firebase/admin.ts`, cached on `globalThis`), guarded
  by `import "server-only"` so it can never be bundled into client code.

## Data flow examples

- *Public news page*: server component → `lib/queries.ts` → `news.service.ts` → Firestore query
  filtered on `status == PUBLISHED`, `publishedAt <= now`, `archivedAt == null`. Failure degrades to a
  labelled empty state (`safeRead`), never a fabricated result.
- *Administrator sign-in*: form → `loginAction` → Identity Toolkit password verification (server-side)
  → Admin SDK verifies account state against `/adminUsers` → ID token exchanged for an HTTP-only
  Firebase **session cookie** → every later request verifies the cookie with `checkRevoked=true`.
- *Document upload*: `uploadDocumentAction` → Zod validation → signature inspection
  (`lib/security/upload.ts`) → bytes to `private/documents/{docId}/{randomName}` in Cloud Storage →
  metadata + SHA-256 in `/documents` → audit entry.
- *Citizen submission*: public form → server action → Zod + honeypot + rate limit → Firestore auto-ID
  document (unguessable) → emails through `/emailOutbox` → audit entry.

## Collections

`adminUsers`, `news`, `projects`, `notices`, `documents`, `submissions`, `submissionNotes`,
`participationOpportunities`, `participationResponses`, `auditLogs`, `settings`, `emailOutbox`,
`rateLimits`, `systemMetadata` — declared once in `lib/firebase/collections.ts`, typed in
`lib/firebase/types.ts`. Field-level detail: `DATABASE_MIGRATION_PLAN.md`.

## Service layer

```
lib/firebase/    admin.ts client.ts config.ts collections.ts types.ts db.ts errors.ts
lib/services/    admin-user, news, project, notice, document, submission,
                 participation, audit, storage, settings, email services
lib/auth/        firebase-auth.ts session.ts rbac.ts audit.ts ratelimit.ts password.ts
lib/actions/     auth.ts admin.ts content.ts submissions.ts   (server actions)
```

All list reads go through `lib/firebase/db.ts#list`, which enforces a hard result cap — no page can
scan a collection unbounded. Consistency-sensitive counters (`notesCount`, `responsesCount`) are
maintained with `FieldValue.increment` (atomic). Reference regeneration on collision, session-cookie
verification and role changes use Admin SDK atomic/revocation primitives.

## Roles and claims

Roles (`SUPER_ADMIN`, `CONTENT_ADMIN`, `PROJECT_ADMIN`, `REVIEWER`) live in the `/adminUsers` profile
(trusted source of truth) and are mirrored into a Firebase custom claim as a cache. Role change or
deactivation updates the profile, rewrites the claim, and calls `revokeRefreshTokens`, so stale
claims cannot grant continued access. The four-eyes rule (no self-approval) is enforced inside every
transition action on the server.

## Security rules

`firestore.rules` and `storage.rules` are default-deny: the only client-allowed reads are published
news, projects, notices, documents metadata and published participation opportunities. Submissions,
notes, responses, adminUsers, auditLogs, settings, rateLimits and emailOutbox have no client access
at all. Rules are one layer; server-side authorisation is independent of them.
