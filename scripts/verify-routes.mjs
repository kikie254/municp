import fs from "node:fs";

// Results are written inside the project so the script runs from a clean checkout.
fs.mkdirSync("logs", { recursive: true });

const BASE = process.env.BASE || "http://127.0.0.1:3123";
// Canonical origin the build was compiled with (set via NEXT_PUBLIC_SITE_URL).
const ORIGIN = process.env.SITE_ORIGIN || "http://localhost:3000";
const out = [];
const log = (s) => { out.push(s); console.log(s); };

// Route inventory derived from the data files (source of truth), not from memory.
const services = [...fs.readFileSync("lib/data/services.ts", "utf8").matchAll(/^\s{4}slug: "([^"]+)"/gm)].map((m) => `/services/${m[1]}`);
const projects = [...fs.readFileSync("lib/data/projects.ts", "utf8").matchAll(/^\s{4}slug: "([^"]+)"/gm)].map((m) => `/projects/${m[1]}`);
const news = [...fs.readFileSync("lib/data/news.ts", "utf8").matchAll(/^\s{4}slug: "([^"]+)"/gm)].map((m) => `/news/${m[1]}`);
// /admin-preview is deliberately NOT in this list: it is withdrawn by default and is expected to
// return 404. It is checked separately at the end of this script.
const statics = ["/", "/about", "/governance", "/services", "/projects", "/public-participation", "/investment",
  "/resources", "/news", "/feedback", "/contact", "/privacy", "/accessibility", "/terms", "/sitemap-page"];

const routes = [...statics, ...services, ...projects, ...news];
log(`ROUTE INVENTORY: ${statics.length} static + ${services.length} services + ${projects.length} projects + ${news.length} news = ${routes.length} content pages`);

const rows = [];
for (const r of routes) {
  const res = await fetch(BASE + r, { redirect: "manual" });
  const html = await res.text();
  const title = (html.match(/<title>([^<]*)<\/title>/) || [, "(none)"])[1];
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [, "(none)"])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, "(none)"])[1];
  const h1 = (html.match(/<h1[^>]*>/g) || []).length;
  const robotsMeta = (html.match(/<meta name="robots" content="([^"]+)"/) || [, "-"])[1];
  rows.push({ r, code: res.status, title, canonical, descLen: desc === "(none)" ? 0 : desc.length, h1, robotsMeta });
}
const bad = rows.filter((x) => x.code !== 200);
log(`\n=== ALL ROUTES (${rows.length}) ===`);
log(`HTTP 200: ${rows.filter((x) => x.code === 200).length}/${rows.length}`);
if (bad.length) bad.forEach((b) => log(`  FAIL ${b.code} ${b.r}`)); else log("  every route returned 200");
log(`\n=== METADATA PER ROUTE ===`);
log("route | title | canonical | descLen | h1count | robots");
for (const x of rows) log(`${x.r} | ${x.title} | ${x.canonical} | ${x.descLen} | ${x.h1} | ${x.robotsMeta}`);

const noCanonical = rows.filter((x) => x.canonical === "(none)");
const badCanonical = rows.filter((x) => x.canonical !== "(none)" && !x.canonical.startsWith(ORIGIN));
const wrongH1 = rows.filter((x) => x.h1 !== 1);
const shortDesc = rows.filter((x) => x.descLen > 0 && x.descLen < 70);
log(`\ncanonical missing: ${noCanonical.length ? noCanonical.map((x) => x.r).join(", ") : "none"}`);
log(`canonical not using configured origin: ${badCanonical.length ? badCanonical.map((x) => x.r + "=>" + x.canonical).join(", ") : "none"}`);
log(`h1 count != 1: ${wrongH1.length ? wrongH1.map((x) => x.r + "(" + x.h1 + ")").join(", ") : "none"}`);
log(`meta description < 70 chars: ${shortDesc.length ? shortDesc.map((x) => x.r + "(" + x.descLen + ")").join(", ") : "none"}`);

// Public assets actually served
const assets = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + "/" + e.name;
    if (e.isDirectory()) walk(p);
    else assets.push(p.replace("public", ""));
  }
};
walk("public");
// Administration demonstration must be withdrawn, not merely hidden.
const adminRes = await fetch(BASE + "/admin-preview", { redirect: "manual" });
log(`\n=== ADMINISTRATION PREVIEW ===`);
log(`/admin-preview -> HTTP ${adminRes.status} (expected 404 when NEXT_PUBLIC_ADMIN_PREVIEW is not "enabled")`);
const adminHtml = await adminRes.text();
log(`admin dashboard markup present in body: ${/Municipal Administration Preview/.test(adminHtml) ? "YES (FAIL)" : "no"}`);

log(`\n=== PUBLIC ASSETS SERVED (${assets.length}) ===`);
let aFail = 0;
for (const a of assets) {
  const res = await fetch(BASE + a);
  if (res.status !== 200) { aFail++; log(`  FAIL ${res.status} ${a}`); }
}
log(aFail === 0 ? `  all ${assets.length} assets returned 200` : `  ${aFail} asset failures`);

// 404 behaviour
const nf = await fetch(BASE + "/this-route-does-not-exist-abc123", { redirect: "manual" });
const nfHtml = await nf.text();
log(`\n=== 404 HANDLING ===`);
log(`unknown route status: ${nf.status}`);
log(`renders custom not-found (has h1): ${/<h1/.test(nfHtml)}`);
log(`not-found title: ${(nfHtml.match(/<title>([^<]*)<\/title>/) || [, "(none)"])[1]}`);

// sitemap + robots
const sm = await fetch(BASE + "/sitemap.xml");
const smText = await sm.text();
const locs = [...smText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
log(`\n=== SITEMAP / ROBOTS ===`);
log(`sitemap status: ${sm.status}, url count: ${locs.length}`);
log(`sitemap sample: ${locs.slice(0, 2).join(" , ")}`);
const missingFromSitemap = routes.filter((r) => !locs.some((l) => l.endsWith(r)) && r !== "/admin-preview");
log(`routes absent from sitemap (excluding admin-preview by design): ${missingFromSitemap.length ? missingFromSitemap.join(", ") : "none"}`);
const smBad = locs.filter((l) => !l.startsWith(ORIGIN));
log(`sitemap entries not on configured origin: ${smBad.length}`);
const rb = await fetch(BASE + "/robots.txt");
const rbText = await rb.text();
log(`robots status: ${rb.status}\n${rbText.trim()}`);

// Security headers
log(`\n=== SECURITY HEADERS ===`);
for (const h of ["x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy", "x-powered-by"]) {
  const v = (await fetch(BASE + "/")).headers.get(h);
  log(`  ${h}: ${v === null ? "(absent)" : v}`);
}
const adminHdr = (await fetch(BASE + "/admin-preview")).headers.get("x-robots-tag");
log(`  x-robots-tag on /admin-preview: ${adminHdr === null ? "(absent)" : adminHdr}`);

// Link crawl over rendered HTML: every internal href must resolve.
log(`\n=== INTERNAL LINK CRAWL ===`);
const htmls = new Map();
for (const r of routes) htmls.set(r, await (await fetch(BASE + r)).text());
const hrefs = new Set();
for (const [, html] of htmls) for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) hrefs.add(m[1]);
log(`unique internal href targets discovered in rendered HTML: ${hrefs.size}`);
const linkFail = [];
for (const h of hrefs) {
  const res = await fetch(BASE + h, { redirect: "manual" });
  if (res.status >= 400) linkFail.push(`${res.status} ${h}`);
}
log(linkFail.length ? `BROKEN: ${linkFail.join(" ; ")}` : "every internal href returned < 400");

// Forbidden strings in delivered HTML
const forbidden = ["localhost:3000", "vercel.app", "127.0.0.1", "your-deployed-domain"];
log(`\n=== DEV/PREVIEW URL LEAKAGE IN SERVED HTML ===`);
for (const f of forbidden) {
  const hits = [...htmls.entries()].filter(([, h]) => h.includes(f)).map(([r]) => r);
  log(`  "${f}": ${hits.length ? hits.join(", ") : "none"}`);
}
log(`  NEXT_PUBLIC_SITE_URL in canonical: ${rows[0].canonical}`);

fs.writeFileSync("logs/route-matrix.csv",
  "route,status,title,canonical,description_length,h1_count,robots\n" +
  rows.map((x) => [x.r, x.code, `"${x.title.replace(/"/g, "'")}"`, x.canonical, x.descLen, x.h1, x.robotsMeta].join(",")).join("\n") + "\n");
fs.writeFileSync("logs/13-functional-verify.log", out.join("\n") + "\n");
