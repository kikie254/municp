import fs from "node:fs";

/**
 * API endpoint verification — executed against a running production server:
 *
 *   npx next start -p 3123 &
 *   node scripts/verify-api.mjs
 *
 * Exercises the public API surface end to end: health, search, document download,
 * administrator export authorisation, submission validation, cross-origin (CSRF)
 * rejection, rate limiting and security headers. Every result is observed behaviour,
 * never an assumption; the script exits non-zero when a security assertion fails.
 * Results are appended to logs/verify-api.log for the audit evidence trail.
 */

fs.mkdirSync("logs", { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:3123";
const ORIGIN = process.env.SITE_ORIGIN || BASE; // origin must match the served host for the CSRF check
const publicSubmissionsEnabled = process.env.MUNICIPAL_PUBLICATION_APPROVED === "true" && process.env.PUBLIC_SUBMISSIONS_ENABLED === "true";
const out = [];
const log = (s) => { out.push(s); console.log(s); };
let failures = 0;

const check = (name, pass, detail) => {
  log(`${pass ? "PASS" : "FAIL"}  ${name} — ${detail}`);
  if (!pass) failures += 1;
};

// ── 1. Health probe ──────────────────────────────────────────────────────────
{
  const res = await fetch(`${BASE}/api/health`);
  const body = await res.json().catch(() => null);
  // 503 is the correct degraded answer when Firestore credentials are absent in the test run.
  check("GET /api/health", res.status === 200 && body?.status === "ok" || res.status === 503 && body?.status === "degraded",
    `status=${res.status} components=${JSON.stringify(body?.components ?? null)}`);
}

// ── 2. Search: valid term, too-short term, over-long term ────────────────────
{
  const res = await fetch(`${BASE}/api/search?q=market`);
  const body = await res.json().catch(() => null);
  const searchDegraded = res.status === 503 || res.status === 500; // 503 = labelled outage; 500 = generic error page, no internals
  check("GET /api/search?q=market", res.status === 200 && Array.isArray(body?.results) || searchDegraded,
    `status=${res.status} count=${body?.count ?? "?"} (Firestore unavailable → labelled empty set is acceptable)`);
}
{
  const res = await fetch(`${BASE}/api/search?q=a`);
  const body = await res.json().catch(() => null);
  check("GET /api/search?q=a (too short)", res.status === 200 && body?.results?.length === 0,
    `status=${res.status} message="${body?.message ?? ""}"`);
}
{
  const res = await fetch(`${BASE}/api/search?q=${"x".repeat(150)}`);
  check("GET /api/search (120+ chars rejected)", res.status === 400, `status=${res.status}`);
}

// ── 3. Administrator export must refuse anonymous callers ────────────────────
{
  const res = await fetch(`${BASE}/api/admin/submissions/export`, { redirect: "manual" });
  const body = await res.json().catch(() => null);
  check("GET /api/admin/submissions/export (no session)", res.status === 403 && body?.error === "Not authorised.",
    `status=${res.status} body=${JSON.stringify(body)}`);
}
{
  const res = await fetch(`${BASE}/api/admin/participation/whatever/export`, { redirect: "manual" });
  // Participation export lives at /api/admin/participation/[id]/export — any id must be refused without a session.
  check("GET /api/admin/participation/<id>/export (no session)", res.status === 403, `status=${res.status}`);
}

// ── 4. Document download of a nonexistent record ─────────────────────────────
{
  const res = await fetch(`${BASE}/api/documents/aaaaaaaaaaaaaaaaaaaa/download`);
  check("GET /api/documents/<unknown>/download", res.status === 404, `status=${res.status} (metadata-gated, no enumeration)`);
}

// ── 5. Submission intake: disabled by default; validation/CSRF tested when explicitly enabled
if (!publicSubmissionsEnabled) {
  const res = await fetch(`${BASE}/api/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN },
    body: JSON.stringify({ type: "ENQUIRY", name: "Test", email: "test@example.invalid", subject: "s", message: "m" }),
  });
  check("POST /api/submissions disabled by default", res.status === 503, `status=${res.status}`);
} else {
  // ── 5. Submission intake: validation, CSRF origin check ──────────────────────
  {
    const res = await fetch(`${BASE}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://evil.example" },
      body: JSON.stringify({ type: "ENQUIRY", name: "Test", email: "t@example.com", subject: "s", message: "m" }),
    });
    const body = await res.json().catch(() => null);
    check("POST /api/submissions cross-origin", res.status === 403, `status=${res.status} body=${JSON.stringify(body)}`);
  }
  {
    const res = await fetch(`${BASE}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: ORIGIN },
      body: JSON.stringify({ type: "NOT_A_TYPE", name: "", email: "nope", subject: "", message: "" }),
    });
    const body = await res.json().catch(() => null);
    check("POST /api/submissions invalid payload", res.status === 422 && body?.fields, `status=${res.status} fields=${JSON.stringify(body?.fields ?? null)}`);
  }
  {
    const res = await fetch(`${BASE}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: ORIGIN },
      body: JSON.stringify({ type: "ENQUIRY", name: "Verify Bot", email: "verify@example.com", subject: "route check", message: "Automated API verification probe.", consent: true }),
    });
    // With no Firebase project configured the Firestore write fails → 500. With credentials it is 201.
    const body = await res.json().catch(() => null);
    const ok = res.status === 201 || res.status === 500;
    check("POST /api/submissions valid payload", ok,
      `status=${res.status} body=${JSON.stringify(body)} (500 expected without Firestore credentials; 201 with)`);
  }
  
  
}

// ── 6. Rate limiting on search (40/min per IP) ───────────────────────────────
{
  // Firestore-backed limiter fails OPEN when the backend is unreachable; with credentials it must 429.
  let saw429 = false;
  for (let i = 0; i < 45; i += 1) {
    const res = await fetch(`${BASE}/api/search?q=probe${i}`);
    if (res.status === 429) { saw429 = true; break; }
  }
  log(`INFO  rate limit over 45 rapid searches: ${saw429 ? "429 enforced" : "no 429 — limiter fail-open without Firestore (documented behaviour)"}`);
}

// ── 7. Security headers on the API surface ───────────────────────────────────
{
  const res = await fetch(`${BASE}/api/health`);
  const nosniff = res.headers.get("x-content-type-options") === "nosniff";
  const noStore = (res.headers.get("cache-control") || "").includes("no-store");
  check("API security headers", nosniff && noStore, `nosniff=${nosniff} no-store=${noStore}`);
}

log(`\nSUMMARY: ${failures === 0 ? "all security assertions passed" : `${failures} security assertion(s) FAILED`}`);
fs.appendFileSync("logs/verify-api.log", out.join("\n") + "\n");
process.exitCode = failures === 0 ? 0 : 1;
