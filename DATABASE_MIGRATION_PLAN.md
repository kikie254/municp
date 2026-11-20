# DATABASE_MIGRATION_PLAN.md — Prisma/SQLite → Firestore

## 1. Source inventory (audited before migration)

Every Prisma model in `prisma/schema.prisma` and every code location that depended on it was
inventoried. 16 source files consumed Prisma; all now use Firestore services:

| Prisma model | Firestore collection | Migration utility mapping |
|---|---|---|
| User | `adminUsers` | Profile fields migrated; **passwords are NOT migrated** — accounts must be provisioned in Firebase Auth (script provided), after which the profile `uid` should be reconciled to the Auth UID |
| Session | — (dropped) | Replaced by Firebase Auth session cookies; nothing to migrate |
| PasswordReset | — (dropped) | Replaced by Firebase's out-of-band reset pipeline |
| NewsArticle | `news` | Status/workflow/timestamps preserved; `authorName`/`reviewerName` denormalised; `searchTerms` recomputed |
| ProjectRecord | `projects` | As above; `budget` migrated only as stored (never invented) |
| PublicNotice | `notices` | Full preservation incl. `expiresAt`, `documentId` |
| DocumentRecord | `documents` | Metadata migrated; `storagePath` set to `legacy/{storageKey}` — **bytes must be re-uploaded to Cloud Storage** and `storagePath` updated (flagged as a migration anomaly) |
| Submission | `submissions` | Auto IDs in Firestore; human-readable `reference` preserved; `notesCount` rebuilt |
| SubmissionNote | `submissionNotes` | Preserved with `authorName` denormalised; counter rebuilt |
| ParticipationOpportunity | `participationOpportunities` | Preserved; `responsesCount` rebuilt |
| ParticipationResponse | `participationResponses` | Preserved with `opportunityId` relationship |
| AuditLog | `auditLogs` | Preserved append-only; `outcome` defaults to SUCCESS for history rows |
| RateLimit | `rateLimits` | Not migrated — transient counters |
| EmailOutbox | `emailOutbox` | Preserved for history |
| Setting | `settings` | Key → document ID |

## 2. Was there data to migrate?

**No.** The supplied ZIP contains `prisma/schema.prisma`, `prisma/migrations/20260101000000_init/`
and `prisma/seed.ts` but **no SQLite database file** (no `*.db` / `*.sqlite*` anywhere in the
archive). There are no production records to transfer. Per the ground rules, no records were
invented; the migration utility is delivered ready to run when a real database is supplied.

## 3. Running the migration

```bash
npm i --no-save better-sqlite3 dotenv
DATABASE_URL="file:./var/data/app.db" \
FIREBASE_ADMIN_PROJECT_ID=... \
FIREBASE_ADMIN_CLIENT_EMAIL=... \
FIREBASE_ADMIN_PRIVATE_KEY="<service-account private_key value, kept in the secret store — never in a shell history>" \
npm run migrate:to-firestore
```

Properties:

- **Read-only source** — the SQLite file is opened `readonly`; it is never modified or deleted.
- **Idempotent / safe reruns** — every document is written with `merge: true` under the source
  record's ID, so reruns overwrite the same documents instead of duplicating.
- **Anomaly detection** — duplicate slugs across collections, missing relationship targets
  (author/reviewer/assignee not found), missing tables.
- **Verification** — counts per collection (read vs written) and a 3-document sample re-read per
  collection; output in `migration-report.json`.
- **Rollback** — the original database and uploaded files are left untouched; rollback is "point the
  deployment back at the previous revision". No destructive operation is performed at any point.

## 4. Post-migration steps

1. Re-upload legacy document bytes to `private/documents/{documentId}/{name}` and update each
   document's `storagePath` (checksums are already in Firestore to verify integrity).
2. Provision administrator accounts in Firebase Auth and reconcile `adminUsers/{uid}`.
3. Verify sample records (script output) and spot-check checksums with
   `verifyChecksum()` in `lib/services/storage.service.ts`.

## 5. Legacy dependency removal

`grep` verification after migration (see FINAL_ENGINEERING_REPORT): no `PrismaClient`, no `prisma.`
call sites, no `DATABASE_URL` references remain in application code. `@prisma/client` and `prisma`
are removed from `package.json` (dependencies, scripts and `postinstall`). The `prisma/` directory is
retained as historical documentation of the source schema for data-recovery purposes.
