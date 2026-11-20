"use client";

import { useMemo, useState } from "react";
import { projects, projectFilters } from "@/lib/data/projects";
import { ProjectCard } from "./ProjectCard";
import { LayoutGrid } from "lucide-react";

export function ProjectGallery({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<string>("All projects");

  const filtered = useMemo(() => {
    const list =
      filter === "All projects"
        ? projects
        : projects.filter((p) => p.status === filter || p.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [filter, limit]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
        {projectFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
              filter === f
                ? "border-green-800 bg-green-800 text-white"
                : "border-paper-line bg-white text-ink-soft hover:border-green-600 hover:text-green-800"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-4 flex items-center gap-1.5 text-[11.5px] text-ink-muted">
        <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
        {filtered.length} project {filtered.length === 1 ? "record" : "records"} shown · demonstration content
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 border border-dashed border-paper-line bg-white px-6 py-12 text-center text-[13px] text-ink-muted">
          No demonstration records match this filter.
        </p>
      ) : (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      )}
    </div>
  );
}
