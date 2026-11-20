# RECOVERY.md — backup, restore and disaster recovery

Firestore and Cloud Storage recovery for the Iten–Tambach municipal platform.

> **Status of this document.** The procedures below use the official Google tooling and the two
> scripts in `scripts/`. The scripts were written and syntax-checked in this repository but have
> **not** been executed against a real project — no credentials were available in the audit
> environment (`PRODUCTION_HARDENING_REPORT.md` §Outstanding). Treat backups as **not operational**
> until you have completed §6 (rehearsal) and recorded the result.

---

## 1. What must be protected

| Data | Location | Loss impact | Recovery source |
|---|---|---|---|
| Citizen submissions, notes | Firestore `submissions`, `submissionNotes` | Statutory: personal data loss / DPA 2019 | Firestore export |
| Participation responses | `participationResponses` | Personal data | Firestore export |
| Audit log | `auditLogs` | Loss of accountability evidence | Firestore export (separate long-retention bucket) |
| Administrator profiles | `adminUsers` | Privileged access broken | Firestore export + Firebase Auth export |
| Published content | `news`, `projects`, `notices`, `documents` | Site degradation | Firestore export |
| Passwords / accounts | Firebase Authentication (not in Firestore) | Account access | Firebase Auth `auth:export` (hashes included) |
| Document files | Cloud Storage `private/**`, `public/**` | Irreplaceable records | Storage transfer / bucket backup |

Firebase Authentication users are **not** covered by a Firestore export. Export them separately:

```bash
firebase auth:export auth-export-$(date +%F).json --format=json --project iten-tambach-prod
```

Store that file encrypted; it contains password hashes.

---

## 2. Prerequisites (one-time, production project)

```bash
gcloud auth login
gcloud config set project iten-tambach-prod

# Bucket in the same location as the Firestore database (required for exports)
gcloud storage buckets create gs://itm-firestore-backups \
  --location=<same region as Firestore> \
  --uniform-bucket-level-access \
  --public-access-prevention

# Retention: keep 35 daily, then a monthly lineage. Adjust to the County's records policy.
gcloud storage buckets update gs://itm-firestore-backups --lifecycle-file=lifecycle.json
```

`lifecycle.json`:

```json
{
  "lifecycle": {
    "rule": [
      { "action": {"type": "Delete"}, "condition": {"age": 35, "matchesPrefix": ["firestore/iten-tambach-prod/"]} },
      { "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 90, "matchesPrefix": ["firestore/iten-tambach-prod/"]} }
    ]
  }
}
```

Enable Object Versioning on the audit bucket if the County requires immutable retention:

```bash
gcloud storage buckets update gs://itm-firestore-backups --versioning
```

---

## 3. Running a backup

```bash
BACKUP_GCS_BUCKET=gs://itm-firestore-backups \
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-prod \
npm run backup:firestore
```

The script:

1. refuses to run without a `gs://` destination and a project;
2. calls `gcloud firestore export` for the listed collections (audit logs included by default);
3. **polls the long-running operation** and only prints `BACKUP VERIFIED` when the operation reports
   `SUCCESSFUL`. Any other state — including an unparseable response — is reported as a failure.

Narrow the scope when needed:

```bash
BACKUP_COLLECTIONS=auditLogs,submissions npm run backup:firestore
```

Record the printed `gs://…/firestore/<project>/<timestamp>` URI — that exact string is what a restore
needs.

---

## 4. Scheduling

**Option A — Cloud Scheduler + Cloud Run job (recommended).** Create a job from this repository's
image with the entrypoint `node scripts/backup-firestore.mjs`, then schedule it:

```bash
gcloud scheduler jobs create http itm-firestore-backup \
  --schedule="0 1 * * *" --time-zone="Africa/Nairobi" \
  --uri="https://<cloud-run-job-trigger>" --http-method=POST \
  --oidc-service-account-email=itm-backup@iten-tambach-prod.iam.gserviceaccount.com
```

The scheduler service account needs `roles/datastore.importExportAdmin` and
`roles/storage.objectAdmin` on the bucket only.

**Option B — CI schedule** (GitHub Actions cron) running the same command with a service-account key
held in repository secrets.

**Option C — manual, documented in the operations log** — acceptable only for the first weeks, never
as the steady state.

Alert on absence of a backup: point a monitor at the bucket (object count for the day) or at a
`systemMetadata/lastBackup` document that the job writes on success. A backup you do not monitor is
a backup that will silently stop.

---

## 5. Restore procedure

A restore **overwrites** documents in the target project. Do it deliberately.

```bash
# 1. Dry run first — prints the exact command, writes nothing.
RESTORE_URI=gs://itm-firestore-backups/firestore/iten-tambach-prod/2026-11-14T01-00-00-000Z \
RESTORE_CONFIRM=restore-iten-tambach \
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-prod \
npm run restore:firestore

# 2. Execute.
RESTORE_URI=<same URI> RESTORE_CONFIRM=restore-iten-tambach RESTORE_EXECUTE=yes \
FIREBASE_ADMIN_PROJECT_ID=iten-tambach-prod \
npm run restore:firestore

# 3. Scoped restore of a single collection (e.g. auditLogs only).
RESTORE_COLLECTIONS=auditLogs RESTORE_EXECUTE=yes ... npm run restore:firestore
```

The script aborts unless `RESTORE_CONFIRM` is exactly `restore-iten-tambach` and the URI is `gs://`.

**Recommended safer variant for partial loss:** restore into the *dev* project first
(`FIREBASE_ADMIN_PROJECT_ID=iten-tambach-dev`), inspect the data, and only then restore the specific
collections into production. This avoids overwriting good production data with an old export.

### Cloud Storage recovery

```bash
# Mirror the bucket to a recovery bucket (one-way, preserves structure)
gcloud storage rsync -r gs://iten-tambach-prod.appspot.com gs://itm-document-recovery

# Restore a single document object
gcloud storage cp gs://itm-document-recovery/private/documents/<id>/<file> \
  gs://iten-tambach-prod.appspot.com/private/documents/<id>/<file>
```

Storage objects are immutable in this application (uploads never overwrite: names are randomised per
upload), so recovery is a copy-back and never a merge conflict. After copying objects back, the
Firestore `documents` metadata already points at the original path, so no metadata edit is needed —
confirm with one download.

---

## 6. Rehearsal (mandatory before go-live)

A backup that has never been restored is unverified. Once, in the dev project:

1. Seed 5 submissions and 2 documents.
2. Run `npm run backup:firestore` and note the URI.
3. Delete the seeded documents.
4. Run the restore (dry run, then execute).
5. Confirm all 5 submissions and 2 documents are back, with matching reference numbers.
6. Record in the operations log: date, URIs, duration, who performed it, result.

Until step 6 exists, describe backups as **configured, not verified**.

---

## 7. Post-restore verification checklist

- [ ] `curl -s https://<domain>/api/health?deep=1` → `status: "ok"`
- [ ] `/admin/audit` shows the expected number of entries (spot-check the oldest and newest)
- [ ] Sample 10 submissions across statuses; reference numbers match the pre-incident export
- [ ] One administrator can sign in; session works; unchanged roles
- [ ] One published page renders; one document downloads
- [ ] `BASE=https://<domain> npm run verify:api` passes
- [ ] Incident record updated with the restore URI and time window of data loss

---

## 8. Firebase Authentication recovery

- **Single account locked out:** administrator resets the password from `/admin/users`
  (`revokeRefreshTokens` is called, so stolen sessions die too), or the officer uses the
  self-service reset at `/admin/reset-password`.
- **Account deleted by mistake:** `npm run admin:provision` re-creates the Auth user + profile +
  claim. The historical UID changes, so audit entries referencing the old UID remain as history.
- **Bulk loss:** `firebase auth:import auth-export-<date>.json --hash-algo=...` using the parameters
  recorded when the export was taken. **The hash parameters must be recorded at export time** — add
  them to the operations log, because an import without them cannot restore passwords.

---

## 9. Disaster scenarios and first actions

| Scenario | First action | Recovery |
|---|---|---|
| Accidental document deletion in a collection | Stop the app's write path if it is still deleting (`MFA_ENFORCEMENT`/feature flag not present — use Vercel rollback) | Scoped restore of that collection from the most recent export |
| Ransomware / mass corruption | Revoke all sessions: `firebase auth:export` then disable users, rotate service-account key | Full restore + rotate every secret (§10) |
| Service-account key leaked | Delete the key in Google Cloud IAM immediately, create a new one, update Vercel env, redeploy | No data restore needed; review `auditLogs` for the exposure window |
| Firestore region outage | Nothing (Google-managed availability) | Serve the static/degraded site if the platform allows; monitor |
| Bad rules deployment | `git checkout <previous> -- firestore.rules && firebase deploy --only firestore:rules` | Immediate; rules are versioned in git |

---

## 10. Secret rotation runbook

1. `PRIVACY_HASH_SECRET` — rotate annually or on suspicion. Rotating changes future IP hashes only;
   old audit entries keep their existing hashes (document that in the incident record).
2. Firebase service-account key — rotate yearly. Create new key → update Vercel env → redeploy →
   confirm `/api/health` → delete the old key.
3. Firebase web API key — restrict it by HTTP referrer in Google Cloud console; rotate if abused.
4. Email provider key — rotate in the provider dashboard, then update Vercel.
5. Administrator passwords — reset through `/admin/users`, which revokes sessions.
