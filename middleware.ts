import { NextResponse, type NextRequest } from "next/server";

/**
 * Withdrawal of the Phase-1 static "admin preview" layout demonstration.
 *
 * HISTORY
 * -------
 * /admin-preview showed a non-functional mock of an administration interface. The real system is
 * /admin (server sessions, RBAC, audit). The old middleware allowed the mock to be re-enabled with
 * NEXT_PUBLIC_ADMIN_PREVIEW=enabled — a build-time flag that shipped a confusing, unauthenticated
 * "admin" screen to any deployment that set it.
 *
 * PRODUCTION BEHAVIOUR (hardened)
 * -------------------------------
 * The route is now withdrawn unconditionally. The escape hatch is gone: no environment variable can
 * expose it. Requests are rewritten to a path that does not exist, so the visitor receives the
 * site's own 404 with a genuine 404 status and no hint the route exists. The route file is kept only
 * so existing build output and links resolve to a clean 404 rather than a 500.
 */
export function middleware(request: NextRequest) {
  const hidden = request.nextUrl.clone();
  hidden.pathname = "/__admin-preview-withdrawn";
  hidden.search = "";
  return NextResponse.rewrite(hidden);
}

export const config = {
  matcher: ["/admin-preview"],
};
