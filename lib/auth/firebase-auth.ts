import "server-only";

/**
 * Server-side authentication helpers on Firebase Admin SDK.
 *
 * Passwords are verified by Firebase Authentication — never against a database hash. The web API
 * key is an identifier (it appears in every public Firebase request anyway), but it is consumed
 * only here, server-side, because authentication happens exclusively on the server.
 */

import { firebaseAdminAuth } from "@/lib/firebase/admin";
import { assertWebApiKeyConfigured, firebaseEnv } from "@/lib/firebase/config";

type IdentityToolkitError = { error?: { message?: string } };

async function identityToolkit(endpoint: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  assertWebApiKeyConfigured();
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${firebaseEnv.webApiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await response.json().catch(() => ({}))) as IdentityToolkitError & Record<string, unknown>;
  if (!response.ok) {
    const message = json.error?.message ?? "OPERATION_FAILED";
    throw new IdentityToolkitFailure(message);
  }
  return json;
}

/** Error carrying only the Identity Toolkit code — never provider internals. */
export class IdentityToolkitFailure extends Error {
  constructor(public readonly code: string) {
    super("Identity Toolkit request failed");
    this.name = "IdentityToolkitFailure";
  }
}

/** Verifies an email/password pair. Returns the ID token, or null for any invalid credential. */
export async function signInWithPassword(email: string, password: string): Promise<{ idToken: string } | null> {
  try {
    const json = await identityToolkit("accounts:signInWithPassword", { email, password, returnSecureToken: true });
    return { idToken: String(json.idToken) };
  } catch (error) {
    if (error instanceof IdentityToolkitFailure) {
      // EMAIL_NOT_FOUND, INVALID_PASSWORD and INVALID_LOGIN_CREDENTIALS all mean "no" — the caller
      // returns one identical failure message so the endpoint cannot enumerate accounts.
      if (error.code === "USER_DISABLED" || error.code === "OPERATION_NOT_ALLOWED") return null;
      return null;
    }
    throw error;
  }
}

/** Issues a password-reset link via Firebase's email pipeline. Returns the link for audit logging. */
export async function createPasswordResetLink(email: string): Promise<string> {
  return firebaseAdminAuth().generatePasswordResetLink(email, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/reset-password/complete`,
  });
}

/** Applies a password change from a Firebase out-of-band code (the emailed reset link). */
export async function resetPasswordWithCode(oobCode: string, newPassword: string): Promise<void> {
  await identityToolkit("accounts:resetPassword", { oobCode, newPassword });
}
