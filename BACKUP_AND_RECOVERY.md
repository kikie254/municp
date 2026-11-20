# BACKUP_AND_RECOVERY.md — Iten–Tambach Municipality

> Honesty note: this document describes procedures the institution must configure in the Google Cloud
> console. The repository cannot configure backups on your project, and no backup has been taken yet.
> Nothing here should be read as a claim that backups exist.

## 1. Firestore backups (scheduled export)

Firebase managed PITR (point-in-time recovery, 7 days) can be enabled in Console → Firestore →
Disaster recovery. For scheduled exports, create a Cloud Scheduler job (daily 02:00 EAT) calling:

```
gcloud firestore export gs://<BACKUP_BUCKET>/firestore/$(date +%F) \
  --project=<PROJECT_ID>
```

Requirements:
- A **separate** bucket from the application's Storage bucket, in a different project if possible,
  with retention lock / object versioning.
- A dedicated service account with `datastore.export` on the source and `storage.create` ONLY on the
  backup bucket — separate backup permissions, not the application's credentials.
- **Retention policy**: e.g. 30 daily, 12 monthly. Remove expired exports with a lifecycle rule.

## 2. Cloud Storage backups

- Enable **Object Versioning** on the application bucket (accidental deletion recovery).
- Optional nightly sync of `private/**` to the backup bucket:
  `gsutil -m rsync -r gs://<APP_BUCKET> gs://<BACKUP_BUCKET>/storage/$(date +%F)/`.
- Access-restrict the backup bucket to the backup service account.

## 3. Audit-log archival (tamper resistance beyond Firestore)

Firestore alone is NOT immutable storage. A scheduled job (Cloud Scheduler → Cloud Function) should
export yesterday's `/auditLogs` to the separately protected backup bucket daily, with object versioning
and write-once retention. Only then can the audit trail be treated as tamper-resistant.

## 4. Recovery objectives (institutional decision — starting recommendation)

- **RPO**: 24 h (nightly export) — reduce to minutes with PITR enabled.
- **RTO**: 4 h (restore export with `gcloud firestore import`, redeploy rules/indexes, verify).

## 5. Recovery procedures

| Scenario | Procedure |
|---|---|
| Compromised administrator account | Console → Auth → disable user (or `setActive(uid,false)`); revoke tokens; audit-log review; password reset via `setAdminPassword`; re-enable only after review |
| Lost privileged credentials | Super admin resets via User management (sessions revoked automatically); sole-admin case: Firebase console password reset + verify identity out-of-band |
| Accidental document deletion | Restore object version from the versioned bucket; metadata rows are archived, never hard-deleted |
| Firestore data corruption | `gcloud firestore import` of the latest export into a NEW project; verify sample records; repoint the deployment |
| Storage object deletion | Restore from version or backup bucket; verify SHA-256 against the Firestore `checksum` field |
| Unauthorized access detected | Disable affected accounts, revoke tokens, export audit logs for the incident window, rotate `PRIVACY_HASH_SECRET` if needed |
| Service outage | `/api/health` shows component status; public pages degrade to empty states; check Firebase status, then rules/index deployments |

**Recovery testing**: quarterly, restore the latest export into a scratch project and verify record
counts and sample integrity against `migration-report.json`-style counts. A backup that has never
been restored is unverified.

## 6. Health endpoint

`GET /api/health` returns component status (database up/down, email configured, storage) with HTTP
503 on Firestore failure — safe for load-balancer probes, discloses no infrastructure details.
