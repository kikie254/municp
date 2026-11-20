/**
 * Environment validation for CI and deployment.
 *
 *   npm run env:check              # human-readable report
 *   npm run env:check -- --strict  # exit 1 unless every REQUIRED value is present
 *
 * Prints variable NAMES and pass/fail only — never a value, so the output is safe in a CI log.
 * Loads .env.local / .env via dotenv when present (development); in CI/Vercel the platform supplies
 * the variables directly.
 */
import "dotenv/config";

import { validateEnv } from "../lib/config/env";

const strict = process.argv.includes("--strict");
const { ok, production, findings } = validateEnv();

console.log(`Environment validation — ${production ? "PRODUCTION" : "development"} mode\n`);
for (const f of findings) {
  const mark = f.present ? "ok  " : f.severity === "required" ? "MISS" : "warn";
  console.log(`[${mark}] ${f.name}`);
  if (!f.present) console.log(`       ${f.severity === "required" ? "required" : "recommended"} — ${f.note}`);
}

const missingRequired = findings.filter((f) => f.severity === "required" && !f.present);
const missingRecommended = findings.filter((f) => f.severity === "recommended" && !f.present);

console.log(
  `\n${missingRequired.length} required missing, ${missingRecommended.length} recommended missing. ${ok ? "Required configuration complete." : "REQUIRED CONFIGURATION INCOMPLETE."}`,
);

if (strict && !ok) {
  console.error("Refusing to continue: required environment values are missing.");
  process.exit(1);
}
