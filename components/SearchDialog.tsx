"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, FileText, Newspaper, FolderKanban, Loader2, AlertCircle } from "lucide-react";

type Hit = { id: string; type: "News" | "Notice" | "Project" | "Document"; title: string; excerpt: string; href: string; meta?: string };

const TYPE_ICON = { News: Newspaper, Notice: Newspaper, Project: FolderKanban, Document: FileText } as const;

/**
 * Site search.
 *
 * Phase 3 replaced the client-side index over sample data with a call to /api/search, which queries
 * only PUBLISHED records. The dialog therefore cannot show unpublished content even if a visitor
 * guesses a title: the filter lives in the database query.
 *
 * Accessibility: focus is moved into the dialog on open, Escape closes it and returns focus to the
 * trigger, results are announced through a live region, and the list is fully keyboard operable.
 */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
      lastFocus.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHits([]);
      setState("idle");
      setMessage(null);
    }
  }, [open]);

  /**
   * Document-level Escape handler.
   *
   * The panel also handles Escape for keyboard users inside the dialog, but a browser can deliver the
   * key to <body> before focus has settled inside the panel (for example immediately after the
   * trigger is activated). Listening on the document guarantees the dialog closes on Escape in every
   * case, which is what WCAG 2.2 expects of a modal dialog.
   */
  useEffect(() => {
    if (!open) return;
    const onDocumentKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onDocumentKey);
    return () => document.removeEventListener("keydown", onDocumentKey);
  }, [open, onClose]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setHits([]);
      setState("idle");
      setMessage(null);
      return;
    }
    const controller = new AbortController();
    setState("loading");
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        const data = await res.json();
        if (!res.ok) {
          setState("error");
          setMessage(data.error ?? "Search is temporarily unavailable.");
          setHits([]);
          return;
        }
        setHits(data.results ?? []);
        setMessage(data.results?.length ? null : "No published content matches that search.");
        setState("done");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setState("error");
        setMessage("Search is temporarily unavailable. Check your connection and try again.");
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <div className="absolute inset-0 bg-green-950/70 backdrop-blur-[3px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        onKeyDown={onKeyDown}
        className="absolute left-1/2 top-[8vh] w-[min(94vw,720px)] -translate-x-1/2 border border-white/15 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-paper-line bg-green-950 px-5 py-3.5">
          <h2 id="search-title" className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-white">
            Search this website
          </h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center border border-white/20 text-white" aria-label="Close search">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative border-b border-paper-line">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            id="site-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Services, projects, documents, notices…"
            className="w-full border-0 py-4 pl-11 pr-4 text-[14px] text-ink outline-none placeholder:text-ink-muted/70 focus:ring-0"
            autoComplete="off"
            aria-describedby="search-help"
          />
        </div>
        <p id="search-help" className="sr-only">
          Results update as you type. Only published municipal content is searched. Press Escape to close.
        </p>

        <div className="max-h-[58vh] overflow-y-auto">
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {state === "loading" ? "Searching" : state === "done" ? `${hits.length} results found` : state === "error" ? message : ""}
          </div>

          {state === "loading" && (
            <p className="flex items-center gap-2 px-5 py-6 text-[12.5px] text-ink-muted">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Searching published content…
            </p>
          )}

          {state === "error" && (
            <p className="flex items-start gap-2 px-5 py-6 text-[12.5px] text-flag-red">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {message}
            </p>
          )}

          {state === "done" && hits.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-[13px] font-semibold text-green-900">{message}</p>
              <p className="mt-1.5 text-[12px] text-ink-muted">
                Try a shorter phrase. Only confirmed municipal content is indexed — a draft will not appear here.
              </p>
            </div>
          )}

          {hits.length > 0 && (
            <ul className="divide-y divide-paper-line">
              {hits.map((hit) => {
                const Icon = TYPE_ICON[hit.type];
                return (
                  <li key={hit.id}>
                    <Link href={hit.href} onClick={onClose} className="flex gap-3 px-5 py-3.5 transition-colors hover:bg-green-50">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-[13px] font-semibold text-green-900">{hit.title}</span>
                          <span className="border border-paper-line px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                            {hit.type}
                          </span>
                        </span>
                        {hit.excerpt && <span className="mt-1 block line-clamp-2 text-[11.5px] leading-relaxed text-ink-muted">{hit.excerpt}</span>}
                        {hit.meta && <span className="mt-1 block text-[10px] uppercase tracking-[0.1em] text-gold-700">{hit.meta}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {state === "idle" && (
            <div className="px-5 py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Suggested</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {["Waste management", "Public participation", "Municipal Charter", "Projects", "Documents"].map((s) => (
                  <button key={s} type="button" onClick={() => setQuery(s)}
                    className="border border-paper-line px-3 py-1.5 text-[11.5px] font-medium text-ink-soft transition-colors hover:border-green-600 hover:text-green-800">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
