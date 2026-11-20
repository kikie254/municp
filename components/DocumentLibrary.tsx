"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, FileQuestion } from "lucide-react";
import { documents, documentCategories, documentYears } from "@/lib/data/documents";
import { DocumentCard } from "./DocumentCard";

export function DocumentLibrary() {
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [year, setYear] = useState("All years");
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest");

  useEffect(() => {
    const q = params.get("q");
    const c = params.get("category");
    if (q) setQuery(q);
    if (c && documentCategories.includes(c as never)) setCategory(c);
  }, [params]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = documents.filter((d) => {
      const matchesQuery = q.length === 0 || `${d.title} ${d.summary} ${d.category}`.toLowerCase().includes(q);
      const matchesCategory = category === "All categories" || d.category === category;
      const matchesYear = year === "All years" || String(d.year) === year;
      return matchesQuery && matchesCategory && matchesYear;
    });
    return list.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "oldest") return a.year - b.year;
      return b.year - a.year;
    });
  }, [query, category, year, sort]);

  const active = query.trim() !== "" || category !== "All categories" || year !== "All years";
  const clear = () => {
    setQuery("");
    setCategory("All categories");
    setYear("All years");
  };

  return (
    <div>
      <div className="border border-paper-line bg-paper-warm p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <label htmlFor="doc-search" className="sr-only">Search documents</label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <input
              id="doc-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, subject or keyword…"
              className="field !border-white !pl-10"
            />
          </div>
          <div className="md:col-span-3">
            <label htmlFor="doc-category" className="sr-only">Filter by category</label>
            <select id="doc-category" value={category} onChange={(e) => setCategory(e.target.value)} className="field !border-white">
              <option>All categories</option>
              {documentCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="doc-year" className="sr-only">Filter by year</label>
            <select id="doc-year" value={year} onChange={(e) => setYear(e.target.value)} className="field !border-white">
              <option>All years</option>
              {documentYears.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="doc-sort" className="sr-only">Sort documents</label>
            <select id="doc-sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="field !border-white">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Showing <strong className="text-green-900">{filtered.length}</strong> of {documents.length} documents
          </p>
          {active && (
            <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-green-700 hover:text-gold-700">
              <X className="h-3 w-3" aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {category !== "All categories" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from(new Set(documents.filter((d) => d.category === category).map((d) => d.year)))
            .sort((a, b) => b - a)
            .map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(String(y))}
                className={`border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  year === String(y) ? "border-green-800 bg-green-800 text-white" : "border-paper-line bg-white text-green-800 hover:border-green-600"
                }`}
              >
                {y}
              </button>
            ))}
        </div>
      )}

      <div aria-live="polite" className="sr-only">
        {filtered.length} documents match your filters.
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center border border-dashed border-paper-line bg-white px-6 py-14 text-center">
          <FileQuestion className="h-9 w-9 text-green-300" aria-hidden="true" />
          <h3 className="mt-4 font-display text-[16px] font-bold text-green-900">No documents match your search</h3>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-muted">
            No publication in this library matches “{query || category}”. Try a broader keyword, choose a different
            category, or clear the filters to see all {documents.length} documents.
          </p>
          <button type="button" onClick={clear} className="btn btn-outline mt-5 !py-2.5 !text-[11.5px]">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => <DocumentCard key={doc.id} doc={doc} />)}
        </div>
      )}
    </div>
  );
}
