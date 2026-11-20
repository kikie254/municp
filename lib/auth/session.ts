import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { firebaseAdminAuth } from "@/lib/firebase/admin";

import { firestore } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { can, type Permission, type Role } from "./rbac";
import type { AdminUserProfile } from "@/lib/firebase/types";

/**
 * Server-side session management on Firebase Authentication.
 *
 * The browser signs in once through the Identity Toolkit REST endpoint (server action, never the
 * SDK) and the returned ID token is exchanged for a Firebase session cookie — an HTTP-only, Secure
 * (in production), SameSite cookie verified on the server for every request. No password, token or
 * credential is ever stored in Firestore; the cookie contains only a signed Firebase token whose
 * revocation is controlled server-side.
 */

export const SESSION_COOKIE = "itm_session";

/**
 * Session lifetime, clamped. A misconfigured value must not create a 30-day administrative session
 * or a session that expires the moment it is issued; the policy range is 1–24 hours.
 */
function sessionHours(): number {
  const raw = Number(process.env.SESSION_TTL_HOURS || 8);
  if (!Number.isFinite(raw) || raw <= 0) return 8;
  return Math.min(24, Math.max(1, Math.floor(raw)));
}
const SESSION_HOURS = sessionHours();

/**
 * `Secure` is required in production and when the deployment is served over https in a preview
 * environment, where NODE_ENV is already production but this keeps the intent explicit.
 */
const COOKIE_SECURE =
  process.env.NODE_ENV === "production" || (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
};

/** Verifies the session cookie and resolves the trusted Firestore profile. Returns null for any invalid state. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    // checkRevoked=true rejects cookies issued before a revocation event (deactivation, role change,
    // password reset) — stale claims cannot grant continued access.
    const decoded = await firebaseAdminAuth().verifySessionCookie(token, true);
    const profileSnap = await firestore().collection(COLLECTIONS.adminUsers).doc(decoded.uid).get();
    if (!profileSnap.exists) return null;
    // The Firestore profile — not the token claim — is the source of truth for the role.
    const profile = profileSnap.data() as Omit<AdminUserProfile, "id">;
    if (!profile.isActive) return null;
    return {
      id: decoded.uid,
      email: profile.email,
      name: profile.name,
      role: profile.role as Role,
      isActive: profile.isActive,
    };
  } catch {
    return null;
  }
}

/** Exchanges a verified ID token for a long-lived session cookie and sets the application cookie. */
export async function createSessionFromIdToken(idToken: string): Promise<void> {
    const sessionCookie = await firebaseAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_HOURS * 3600 * 1000,
  });
  (await cookies()).set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_SECURE,
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

/** Destroys the application session and revokes the Firebase refresh token so the cookie cannot be reissued. */
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  let uid: string | null = null;
  if (token) {
    try {
      const decoded = await firebaseAdminAuth().verifySessionCookie(token, false);
      uid = decoded.uid;
    } catch {
      uid = null;
    }
  }
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: COOKIE_SECURE,
  });
  if (uid) {
    try {
      await firebaseAdminAuth().revokeRefreshTokens(uid);
    } catch {
      // Revocation failure must not block sign-out; the cookie is already cleared.
    }
  }
}

/** Page guard: redirects to the login screen when there is no valid session. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * Permission guard for pages and server actions. This is the enforcement point — the interface may
 * hide a control, but this function is what actually decides. Authorisation is checked against the
 * trusted Firestore profile on every request, never against a client-supplied value or a hidden UI
 * element.
 */
export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await requireUser();
  if (!can(user.role, permission)) {
    redirect("/admin/denied");
  }
  return user;
}

/** Non-redirecting variant for server actions, which must return a result rather than navigate. */
export async function assertPermission(permission: Permission): Promise<{ user: SessionUser } | { error: string }> {
  const user = await getSessionUser();
  if (!user) return { error: "Your session has expired. Sign in again." };
  if (!can(user.role, permission)) return { error: "Your role does not permit this action." };
  return { user };
}
