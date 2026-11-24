import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/auth/ratelimit";
import { searchPublishedNews } from "@/lib/services/news.service";
import { searchPublishedProjects } from "@/lib/services/project.service";
import { searchPublishedDocuments } from "@/lib/services/document.service";
import { searchPublishedNotices } from "@/lib/services/notice.service";
import { logError } from "@/lib/firebase/errors";

export const dynamic = "force-dynamic";

/**
 * Site search over PUBLISHED content only.
 *
 * Every query is filtered on publication state inside the service, so an unpublished draft cannot be
 * surfaced by crafting a search term. Results are capped and each hit carries only the fields the UI
 * needs; nothing from the administrative collections is exposed. Search term matching runs against
 * lower-cased fields in a bounded window of published documents — it is a containment match, not a
 * full-text index, and returns at most 8 hits per section.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ query: q, results: [], message: "Enter at least two characters." }, { headers: { "Cache-Control": "no-store" } });
  }
  if (q.length > 120) {
    return NextResponse.json({ query: q.slice(0, 120), results: [], message: "Search term is too long." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await rateLimit(`search:${ip}`, 40, 60 * 1000);
  if (limit.unavailable) return NextResponse.json({ query: q, results: [], error: "Search is temporarily unavailable." }, { status: 503, headers: { "Retry-After": String(limit.retryAfterSeconds), "Cache-Control": "no-store" } });
  if (!limit.allowed) {
    return NextResponse.json({ query: q, results: [], message: "Too many searches. Please wait a moment." }, { status: 429 });
  }

  try {
    const [news, projects, documents, notices] = await Promise.all([
      searchPublishedNews(q),
      searchPublishedProjects(q),
      searchPublishedDocuments(q),
      searchPublishedNotices(q),
    ]);

    const results = [
      ...news.map((n) => ({ id: `news-${n.slug}`, type: "News", title: n.title, excerpt: n.summary, href: `/news/${n.slug}`, meta: n.category })),
      ...notices.map((n) => ({ id: `notice-${n.slug}`, type: "Notice", title: n.title, excerpt: "", href: `/news?filter=Public+Notices`, meta: n.category })),
      ...projects.map((p) => ({ id: `project-${p.slug}`, type: "Project", title: p.title, excerpt: p.summary, href: `/projects/${p.slug}`, meta: p.location })),
      ...documents.map((d) => ({ id: `doc-${d.id}`, type: "Document", title: d.title, excerpt: d.description, href: `/api/documents/${d.id}/download`, meta: d.category })),
    ];

    return NextResponse.json(
      { query: q, count: results.length, results },
      { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
    );
  } catch (error) {
    logError("search", error);
    // A search outage must not look like "no results" — say the search is unavailable.
    return NextResponse.json(
      { query: q, results: [], error: "Search is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
}
