import { headers } from "next/headers";

/**
 * Origin check for state-changing route handlers.
 *
 * Server Actions already carry Next.js's own origin validation; this covers the REST handlers
 * (submissions, downloads, search) so a cross-site form post cannot create records.
 */
export async function sameOrigin(): Promise<boolean> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (!origin) return true; // non-browser client (curl, monitoring) — no ambient cookie is at risk
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
