"use client";

/**
 * Root error boundary — the last resort when the root layout itself throws.
 *
 * It must render its own <html>/<body>. It shows no diagnostic detail in production: only a stable
 * message and, when available, the digest that an operator can look up in the server logs.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-KE">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f7f5ef", color: "#1b2a1f" }}>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "96px 24px" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "#14532d" }}>
            Iten–Tambach Municipality
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "12px 0 0" }}>The site is temporarily unavailable</h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4b5a50", marginTop: 12 }}>
            We could not load this page. Please try again in a moment. If you were submitting information,
            nothing was sent — please resubmit once the site is available again.
          </p>
          {error.digest ? (
            <p style={{ fontSize: 12, marginTop: 16, fontFamily: "ui-monospace, monospace" }}>Reference: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 28,
              padding: "10px 20px",
              background: "#14532d",
              color: "#fff",
              border: "1px solid #14532d",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
