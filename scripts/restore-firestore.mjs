#!/usr/bin/env node
/**
 * Firestore restore — deliberate, guarded recovery from an export.
 *
 *   BACKUP_GCS_BUCKET=gs://itm-firestore-backups \
 *   RESTORE_URI=gs://itm-firestore-backups/firestore/<project>/<timestamp> \
 *   RESTORE_CONFIRM=restore-iten-tambach npm run restore:firestore
 *
 * SAFETY DESIGN
 * -------------
 *  - Requires RESTORE_URI (an explicit export path) and RESTORE_CONFIRM (a fixed phrase). A restore
 *    overwrites documents; it must never be one keystroke away.
 *  - Defaults to a DRY RUN: it prints exactly what would happen and exits 0.
 *  - `RESTORE_EXECUTE=yes` performs the import. `RESTORE_COLLECTIONS` limits the scope.
 *  - Never prints credentials; it shells out to the authenticated gcloud CLI.
 *
 * This script has NOT been executed against a real project in this audit (no credentials available).
 * See RECOVERY.md for the full procedure, including the post-restore verification checklist.
 */
import { execFileSync } from "node:child_process";

const project = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() || process.env.GCLOUD_PROJECT?.trim();
const uri = process.env.RESTORE_URI?.trim();
const confirm = process.env.RESTORE_CONFIRM?.trim();
const execute = process.env.RESTORE_EXECUTE === "yes";
const collections = (process.env.RESTORE_COLLECTIONS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function fail(message) {
  console.error(`RESTORE ABORTED: ${message}`);
  process.exit(1);
}

if (!project) fail("FIREBASE_ADMIN_PROJECT_ID (or GCLOUD_PROJECT) is not set.");
if (!uri) fail("RESTORE_URI is not set. Point it at an export prefix produced by backup-firestore.mjs.");
if (!uri.startsWith("gs://")) fail("RESTORE_URI must start with gs://.");
if (confirm !== "restore-iten-tambach") fail('RESTORE_CONFIRM must be exactly "restore-iten-tambach".');

console.log(`Project:    ${project}`);
console.log(`Source:     ${uri}`);
console.log(`Scope:      ${collections.length ? collections.join(", ") : "ALL collections in the export"}`);
console.log(`Mode:       ${execute ? "EXECUTE (writes to Firestore)" : "DRY RUN (no writes)"}`);

const args = ["firestore", "import", uri, `--project=${project}`, ...collections.map((c) => `--collection-ids=${c}`)];

if (!execute) {
  console.log(`\nDry run. The command that would run is:\n  gcloud ${args.join(" ")}\n`);
  console.log("Set RESTORE_EXECUTE=yes to perform it.");
  process.exit(0);
}

console.log(`\nRunning: gcloud ${args.join(" ")}\n`);
let raw;
try {
  raw = execFileSync("gcloud", [...args, "--format=json"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
} catch (error) {
  const stderr = error && typeof error === "object" && "stderr" in error ? String(error.stderr) : String(error);
  fail(`gcloud firestore import did not complete.\n${stderr.trim() || "(no stderr)"}`);
}

let operation = {};
try {
  operation = JSON.parse(raw);
} catch {
  fail("Could not parse the import response. Verify the data manually before resuming service.");
}

console.log(`Import operation: ${operation?.name ?? "(unnamed)"}`);
console.log("Now complete the verification checklist in RECOVERY.md §Post-restore verification:");
console.log("  1. sample 10 submissions per status and confirm reference numbers match the export log");
console.log("  2. confirm /admin/audit shows the expected number of entries");
console.log("  3. sign in as a test administrator and reload one published page");
console.log("  4. re-run: npm run verify:api against the restored environment");
