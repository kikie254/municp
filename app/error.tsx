"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary (production-safe error handling).
 *
 * In production Next.js deliberately sends a generic server error message and only a `digest` to the
 * client, so no stack trace, file path, query or credential can reach a visitor from here. This
 * boundary additionally:
 *  - never renders `error.message` in production (a server message could embed a Firestore path or
 *    an email address);
 *  - shows the digest, which an operator can match against the server logs to find the real cause;
 *  - offers a recovery action instead of a dead end.
 */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    // Client logs carry no personal data: only the digest and the error type.
    console.error("[route-error]", error.digest ?? "no-digest", error.name);
  }, [error]);

  return (
    <main className="shell py-24">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-800">Service message</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">This page could not be loaded</h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-muted">
        The municipal website encountered a problem while preparing this page. Nothing you submitted was
        lost. Please try again; if the problem continues, contact the municipal offices and quote the
        reference below.
      </p>
      {error.digest ? (
        <p className="mt-4 border border-paper-line bg-paper-warm px-4 py-3 text-[12px] text-ink">
          Reference: <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="border border-green-900 bg-green-900 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
        >
          Try again
        </button>
        <Link href="/" className="border border-paper-line bg-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
          Return to the home page
        </Link>
        <Link href="/contact" className="border border-paper-line bg-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
          Contact the municipality
        </Link>
      </div>
      {isDev ? (
        <pre className="mt-8 overflow-x-auto border border-paper-line bg-white p-4 text-[11px] text-ink-muted">
          {error.message}
        </pre>
      ) : null}
    </main>
  );
}
