#!/usr/bin/env node
/**
 * Crawl the public site and verify internal routes plus external hyperlinks.
 * Usage: SITE_URL=https://example.org npm run check:links
 * No third-party dependencies are required (Node 20+).
 */
const baseInput = process.env.SITE_URL || process.argv[2];
if (!baseInput) {
  console.error("Set SITE_URL or pass the deployed site URL as the first argument.");
  process.exit(2);
}

const base = new URL(baseInput);
if (!/^https?:$/.test(base.protocol)) {
  console.error("SITE_URL must use http or https.");
  process.exit(2);
}

const headers = { "user-agent": "Iten-Tambach-Municipality-Link-Audit/1.0" };
const timeout = 15000;
const maxPages = Number(process.env.MAX_PAGES || 250);
const internalSeen = new Set();
const externalSeen = new Set();
const queue = [new URL("/", base).href];
const broken = [];
const restricted = [];
const unverified = [];

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#0*39;/g, "'")
    .replace(/&#x0*27;/gi, "'")
    .replace(/&quot;/g, '"');
}

function linksFromHtml(html, pageUrl) {
  const found = [];
  const pattern = /<a\b[^>]*?\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi;
  for (const match of html.matchAll(pattern)) {
    const raw = decodeHtml(match[1] ?? match[2] ?? match[3] ?? "").trim();
    if (!raw || /^(#|mailto:|tel:|javascript:|data:|blob:)/i.test(raw)) continue;
    try {
      const url = new URL(raw, pageUrl);
      if (!/^https?:$/.test(url.protocol)) continue;
      url.hash = "";
      found.push(url);
    } catch {
      unverified.push({ url: raw, from: pageUrl, reason: "Invalid URL" });
    }
  }
  return found;
}

async function request(url, method = "GET") {
  return fetch(url, {
    method,
    headers,
    redirect: "follow",
    signal: AbortSignal.timeout(timeout),
  });
}

async function checkExternal(url) {
  try {
    let response = await request(url.href, "HEAD");
    if ([405, 501].includes(response.status)) response = await request(url.href, "GET");
    const finalUrl = response.url || url.href;
    if (response.status >= 400 && [401, 403, 429].includes(response.status)) {
      restricted.push({ url: url.href, status: response.status, finalUrl });
    } else if (response.status >= 400) {
      broken.push({ url: url.href, status: response.status, finalUrl });
    }
  } catch (error) {
    unverified.push({ url: url.href, reason: error.message });
  }
}

async function main() {
  // Seed the crawl from the XML sitemap so routes not linked in the homepage are included.
  try {
    const sitemapUrl = new URL("/sitemap.xml", base).href;
    const response = await request(sitemapUrl);
    if (response.ok) {
      const xml = await response.text();
      for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
        try {
          const url = new URL(decodeHtml(match[1].trim()), base);
          if (url.origin === base.origin) queue.push(url.href);
        } catch {
          unverified.push({ url: match[1], from: sitemapUrl, reason: "Invalid sitemap URL" });
        }
      }
    } else {
      unverified.push({ url: sitemapUrl, status: response.status, reason: "Sitemap could not be read" });
    }
  } catch (error) {
    unverified.push({ url: new URL("/sitemap.xml", base).href, reason: error.message });
  }

  while (queue.length && internalSeen.size < maxPages) {
    const href = queue.shift();
    if (!href || internalSeen.has(href)) continue;
    internalSeen.add(href);
    try {
      const response = await request(href);
      const finalUrl = new URL(response.url || href);
      if (response.status >= 400) {
        broken.push({ url: href, status: response.status, finalUrl: response.url });
        continue;
      }
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) continue;
      const html = await response.text();
      for (const link of linksFromHtml(html, finalUrl.href)) {
        if (link.origin === base.origin) {
          if (!internalSeen.has(link.href)) queue.push(link.href);
        } else {
          externalSeen.add(link.href);
        }
      }
    } catch (error) {
      unverified.push({ url: href, reason: error.message });
    }
  }

  const externalUrls = [...externalSeen];
  let cursor = 0;
  const workers = Array.from({ length: 8 }, async () => {
    while (cursor < externalUrls.length) {
      const index = cursor++;
      await checkExternal(new URL(externalUrls[index]));
    }
  });
  await Promise.all(workers);

  console.log(`Internal pages checked: ${internalSeen.size}`);
  console.log(`Unique external links checked: ${externalSeen.size}`);
  console.log(`Broken links: ${broken.length}`);
  console.log(`Restricted / bot-blocked links (manual review): ${restricted.length}`);
  console.log(`Unverified due to network or parsing limits: ${unverified.length}`);
  for (const item of broken) console.error("BROKEN", item);
  for (const item of restricted) console.warn("RESTRICTED", item);
  for (const item of unverified) console.warn("UNVERIFIED", item);
  if (queue.length) console.warn(`Crawl cap reached; ${queue.length} internal URLs remain.`);
  if (broken.length || queue.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
