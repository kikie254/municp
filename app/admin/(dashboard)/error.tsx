"use client";

import Link from "next/link";

/**
 * Administration error boundary.
 *
 * Administrator-facing, so it may be slightly more explicit than the public boundary — but it still
 * shows no message, path or identifier from the server in production, only the digest. The visible
 * text is deliberately operational: it tells the officer the action may not have completed, which is
 * the safe assumption when a mutation fails mid-flight.
 */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="border border-red-200 bg-white p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-700">Administration</p>
      <h2 className="mt-2 font-display text-2xl font-extrabold text-ink">This screen could not be completed</h2>
      <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-ink-muted">
        The operation did not finish. Treat the change as <strong className="font-semibold text-ink">not saved</strong> and
        check the record before retrying, so a duplicate entry is not created. If it keeps failing, send the
        reference below to the system administrator.
      </p>
      {error.digest ? (
        <p className="mt-4 border border-paper-line bg-paper-warm px-4 py-3 text-[12px] text-ink">
          Reference: <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="border border-green-900 bg-green-900 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
        >
          Retry
        </button>
        <Link href="/admin" className="border border-paper-line bg-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
          Back to the overview
        </Link>
      </div>
      {isDev ? (
        <pre className="mt-6 overflow-x-auto border border-paper-line bg-paper-warm p-4 text-[11px] text-ink-muted">
          {error.message}
        </pre>
      ) : null}
    </div>
  );
}
