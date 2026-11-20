"use client";

import { useMemo, useState } from "react";
import { news, newsCategories } from "@/lib/data/news";
import { NewsCard } from "./NewsCard";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function NewsList() {
  const params = useSearchParams();
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const f = params.get("filter");
    if (f) setFilter(f);
  }, [params]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return news.filter((n) => {
      const matchesFilter = filter === "All" || n.category === filter;
      const matchesQuery = q.length === 0 || `${n.title} ${n.summary}`.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-paper-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter news">
          {["All", ...newsCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`border px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] transition-colors ${
                filter === c
                  ? "border-green-800 bg-green-800 text-white"
                  : "border-paper-line bg-white text-ink-soft hover:border-green-600 hover:text-green-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <label htmlFor="news-search" className="sr-only">Search news</label>
          <input
            id="news-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search updates…"
            className="field !py-2.5 !text-[12.5px]"
          />
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-[11.5px] text-ink-muted">
        {filtered.length} {filtered.length === 1 ? "item" : "items"} · all articles are sample content
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 border border-dashed border-paper-line bg-white px-6 py-12 text-center text-[13px] text-ink-muted">
          No articles match this filter or search.
        </p>
      ) : (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n) => <NewsCard key={n.slug} item={n} />)}
        </div>
      )}
    </div>
  );
}
