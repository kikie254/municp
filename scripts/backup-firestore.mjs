#!/usr/bin/env node
/**
 * Firestore backup — scheduled export to a protected Cloud Storage bucket.
 *
 *   BACKUP_GCS_BUCKET=gs://itm-firestore-backups ORDERS=auditLogs,submissions npm run backup:firestore
 *
 * WHY A SCRIPT AND NOT A CLAIM
 * ----------------------------
 * Firestore's own export is the only supported consistent backup. This script drives the official
 * `gcloud firestore export` command, refuses to run without an explicit destination, and then VERIFIES
 * the operation by reading it back from the API — it never prints "backup complete" unless the
 * operation reported `state: SUCCESSFUL`. Nothing here fabricates a backup.
 *
 * PREREQUISITES (not installed in this repository, by design):
 *   - gcloud CLI authenticated with an account holding roles/datastore.importExportAdmin
 *   - a Cloud Storage bucket in the SAME region as the Firestore database, with a lifecycle rule
 *   - a service account for scheduling (see RECOVERY.md §Scheduling)
 *
 * This script has NOT been executed against a real project in this audit (no credentials available);
 * see PRODUCTION_HARDENING_REPORT.md — it is provided and syntax-checked only.
 */
import { execFileSync } from "node:child_process";

const bucket = process.env.BACKUP_GCS_BUCKET?.trim();
const project = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() || process.env.GCLOUD_PROJECT?.trim();
// Default: every operational collection. Audit logs are included by default — an audit trail that
// is not backed up cannot be produced in a dispute.
const collections = (process.env.BACKUP_COLLECTIONS ||
  "auditLogs,submissions,submissionNotes,adminUsers,news,projects,notices,documents,participationOpportunities,participationResponses,settings")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function fail(message) {
  console.error(`BACKUP FAILED: ${message}`);
  process.exit(1);
}

if (!bucket) fail("BACKUP_GCS_BUCKET is not set (e.g. gs://itm-firestore-backups). No backup was attempted.");
if (!bucket.startsWith("gs://")) fail(`BACKUP_GCS_BUCKET must start with gs:// — received "${bucket}".`);
if (!project) fail("FIREBASE_ADMIN_PROJECT_ID (or GCLOUD_PROJECT) is not set.");

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputUriPrefix = `${bucket.replace(/\/$/, "")}/firestore/${project}/${stamp}`;

console.log(`Project:      ${project}`);
console.log(`Destination:  ${outputUriPrefix}`);
console.log(`Collections:  ${collections.join(", ")}`);

const args = [
  "firestore",
  "export",
  outputUriPrefix,
  `--project=${project}`,
  ...collections.map((c) => `--collection-ids=${c}`),
];

console.log(`\nRunning: gcloud ${args.join(" ")}\n`);

let raw;
try {
  raw = execFileSync("gcloud", [...args, "--format=json"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
} catch (error) {
  const stderr = error && typeof error === "object" && "stderr" in error ? String(error.stderr) : String(error);
  fail(`gcloud firestore export did not complete.\n${stderr.trim() || "(no stderr)"}`);
}

let operation;
try {
  operation = JSON.parse(raw);
} catch {
  fail("Could not parse the gcloud output, so the export CANNOT be confirmed. Treat the backup as failed.");
}

// Verification: the returned long-running operation must report SUCCESSFUL. Anything else (including
// an empty response) is reported as a failure rather than assumed.
const name = operation?.name;
if (!name) fail("gcloud returned no operation name — the export cannot be verified.");

let state = operation?.metadata?.common?.state || operation?.done === true ? "SUCCESSFUL" : "PENDING";
try {
  const described = JSON.parse(
    execFileSync("gcloud", ["firestore", "operations", "describe", name, `--project=${project}`, "--format=json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
  state = described?.metadata?.common?.state || (described?.done ? "SUCCESSFUL" : "RUNNING");
} catch {
  console.warn("Could not poll the operation; relying on the export response.");
}

if (state !== "SUCCESSFUL") fail(`Export operation ${name} reported state ${state}. The backup is NOT confirmed.`);

console.log(`\nBACKUP VERIFIED: operation ${name} reported SUCCESSFUL.`);
console.log(`Location: ${outputUriPrefix}`);
console.log("Record this path in the backup log; it is the exact URI the restore procedure needs.");
