# DATA_MIGRATION.md — quick guide

Full rationale: `DATABASE_MIGRATION_PLAN.md`. Model-by-model mapping is in §1 there.

**State of the data**: the delivered ZIP contained no SQLite database file (only
`prisma/schema.prisma`, `prisma/migrations/20260101000000_init/` and `prisma/seed.ts`), so there were
no records to migrate and none were invented.

When a real database exists:

```bash
npm i --no-save better-sqlite3 dotenv
DATABASE_URL="file:./var/data/app.db" \
FIREBASE_ADMIN_PROJECT_ID=... FIREBASE_ADMIN_CLIENT_EMAIL=... FIREBASE_ADMIN_PRIVATE_KEY="..." \
npm run migrate:to-firestore
```

- Read-only against the source; idempotent (safe reruns, no duplicates).
- Detects duplicate slugs/references and missing relationship targets.
- Writes `migration-report.json` with per-collection counts and sample verification.
- Leaves `storagePath="legacy/…"` on migrated documents — re-upload their bytes to Cloud Storage and
  update the path (flagged as an anomaly in the report).
- Provision administrators into Firebase Auth (`npm run admin:provision`) and reconcile
  `adminUsers/{uid}`; passwords are never migrated.
- Rollback: the source database is never modified; revert the deployment to restore service.

The `prisma/` directory is retained in the repository purely as historical documentation of the source
schema for data-recovery purposes; no application code depends on it.
