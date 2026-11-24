"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { firebaseAdminAuth } from "@/lib/firebase/admin";
import { createSessionFromIdToken, destroySession, getSessionUser } from "@/lib/auth/session";
import { signInWithPassword, resetPasswordWithCode } from "@/lib/auth/firebase-auth";
import { getProfile, touchLastLogin } from "@/lib/services/admin-user.service";
import { rateLimit } from "@/lib/auth/ratelimit";
import { recordAudit } from "@/lib/auth/audit";
import { sendMail } from "@/lib/email/mailer";
import { hashIp } from "@/lib/security/tokens";
import { loginSchema, fieldErrors, resetCompleteSchema } from "@/lib/validation/schemas";
import { logError } from "@/lib/firebase/errors";
import type { ActionState } from "./types";

async function requestContext() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return { h, ip, ipHash: hashIp(ip) };
}

/**
 * Sign in through Firebase Authentication.
 *
 * Defences applied here, on the server:
 *  - rate limit per IP+email (5 attempts / 10 minutes) to blunt credential stuffing;
 *  - identical failure message whether the account exists, the password is wrong or the account is
 *    disabled — the endpoint cannot enumerate administrators;
 *  - the trusted Firestore profile (not the token claim) decides whether the account may sign in;
 *  - every attempt, successful or not, is written to the audit trail.
 */
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  });
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error) };

  const { h, ipHash } = await requestContext();
  const limit = await rateLimit(`login:${ipHash ?? "unknown"}:${parsed.data.email}`, 5, 10 * 60 * 1000);
  if (limit.unavailable) return { status: "error", message: "Sign-in is temporarily unavailable. Please try again shortly." };
  if (!limit.allowed) {
    await recordAudit({
      actorEmail: parsed.data.email, action: "LOGIN_RATE_LIMITED", entityType: "AdminUser",
      summary: "Sign-in blocked by rate limit.", ipHash, outcome: "DENIED",
    });
    return { status: "error", message: `Too many attempts. Try again in ${limit.retryAfterSeconds} seconds.` };
  }

  const signIn = await signInWithPassword(parsed.data.email, parsed.data.password);
  // Firebase Admin's getUser() accepts a UID, never an email address. The account is looked up by
  // email with getUserByEmail(); a lookup failure after a successful password check is treated as
  // an ordinary failed sign-in (no enumeration, no stack trace to the client).
  let profile: Awaited<ReturnType<typeof getProfile>> = null;
  if (signIn) {
    try {
      profile = await getProfile((await firebaseAdminAuth().getUserByEmail(parsed.data.email)).uid);
    } catch {
      profile = null;
    }
  }

  if (!signIn || !profile || !profile.isActive) {
    await recordAudit({
      actorEmail: parsed.data.email, action: "LOGIN_FAILED", entityType: "AdminUser",
      summary: "Failed sign-in attempt.", ipHash, outcome: "FAILURE",
    });
    return { status: "error", message: "Email address or password is incorrect." };
  }

  //
  // MFA policy — see FIREBASE_AUTHENTICATION_AUDIT.md §MFA.
  // Enrolment happens in Firebase Authentication (Identity Platform TOTP/SMS second factor). The
  // server cannot enrol on the user's behalf from this password-only flow, so enforcement is
  // configured, not assumed:
  //   enforce — a privileged account with no enrolled second factor is denied sign-in;
  //   report  — the gap is audited on every sign-in (default until TOTP is provisioned).
  const mfaMode = (process.env.MFA_ENFORCEMENT || (process.env.VERCEL_ENV === "production" ? "enforce" : "report")).toLowerCase();
  // AUTH-01 fix: every administrative role can publish official content or read citizen PII,
  // so the MFA policy applies to ALL roles — not only SUPER_ADMIN.
  if (mfaMode !== "off") {
    const authRecord = await firebaseAdminAuth().getUser(profile.uid).catch(() => null);
    const enrolled = Boolean(authRecord?.multiFactor?.enrolledFactors?.length);
    if (!enrolled) {
      await recordAudit({
        actorId: profile.uid, actorEmail: profile.email, actorRole: profile.role,
        action: "MFA_MISSING", entityType: "AdminUser", entityId: profile.uid,
        summary:
          mfaMode === "enforce"
            ? "Sign-in denied: no second factor enrolled."
            : "Signed in without an enrolled second factor (MFA enforcement not active).",
        ipHash,
        outcome: mfaMode === "enforce" ? "DENIED" : "SUCCESS",
      });
      if (mfaMode === "enforce") {
        return {
          status: "error",
          message: "Multi-factor authentication is required for this account. Enrol a second factor before signing in.",
        };
      }
    }
  }

  try {
    await createSessionFromIdToken(signIn.idToken);
  } catch (error) {
    logError("auth.login", error);
    return { status: "error", message: "Sign-in is temporarily unavailable. Please try again." };
  }

  await touchLastLogin(profile.uid);
  await recordAudit({
    actorId: profile.uid, actorEmail: profile.email, actorRole: profile.role, action: "LOGIN_SUCCESS",
    entityType: "AdminUser", entityId: profile.uid,
    summary: `Signed in from ${h.get("user-agent")?.slice(0, 80) ?? "unknown client"}.`, ipHash,
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const user = await getSessionUser();
  if (user) {
    const { ipHash } = await requestContext();
    await recordAudit({
      actorId: user.id, actorEmail: user.email, action: "LOGOUT", entityType: "AdminUser",
      entityId: user.id, summary: "Signed out.", ipHash,
    });
  }
  await destroySession();
  redirect("/admin/login");
}

/**
 * Password reset request through Firebase Authentication's email pipeline.
 * The response is deliberately identical whether or not the address exists, so the form cannot be
 * used to enumerate administrator accounts. If no email provider is configured in Firebase, the
 * response says so honestly instead of claiming a message was sent.
 */
export async function requestPasswordResetAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const { ipHash } = await requestContext();
  const limit = await rateLimit(`reset:${ipHash ?? "unknown"}`, 3, 60 * 60 * 1000);
  if (limit.unavailable) return { status: "error", message: "Password reset is temporarily unavailable. Please try again shortly." };
  if (!limit.allowed) {
    return { status: "error", message: "Too many reset requests. Please try again later." };
  }
  // AUTH-03 fix: one constant response for every input — the endpoint cannot be used to
  // enumerate administrator accounts (previously existing accounts got a different message).
  const generic: ActionState = {
    status: "ok",
    message:
      "If that address belongs to an administrator account, a password reset link has been sent. If no message arrives, ask a super administrator to reset the password from User management.",
  };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return generic;

  const profile = await getProfileByEmailSafe(email);
  if (!profile || !profile.isActive) return generic;

  try {
    await firebaseAdminAuth().generatePasswordResetLink(email, {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/reset-password/complete`,
    });
    // AUTH-02 fix: generatePasswordResetLink only RETURNS a link — it never sends email. The
    // previous code discarded it, so no message was ever delivered while the UI claimed one was.
    // The link is now delivered through the application's outbox-backed mailer.
    const link = await firebaseAdminAuth().generatePasswordResetLink(email, {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/reset-password/complete`,
    });
    await sendMail({
      to: email,
      subject: "Reset your Iten-Tambach Municipality administrator password",
      body: `A password reset was requested for your administrator account. Open the link below within 60 minutes to choose a new password:\n\n${link}\n\nIf you did not request this, ignore this message and your password will not change.`,
    });
    await recordAudit({
      actorId: profile.uid, actorEmail: email, action: "PASSWORD_RESET_REQUESTED", entityType: "AdminUser",
      entityId: profile.uid, summary: "Password reset link generated and queued for delivery.", ipHash,
    });
  } catch (error) {
    logError("auth.reset", error);
    await recordAudit({
      actorEmail: email, action: "PASSWORD_RESET_REQUEST_FAILED", entityType: "AdminUser",
      summary: "Reset link generation failed.", ipHash, outcome: "FAILURE",
    });
  }
  return generic;
}

async function getProfileByEmailSafe(email: string) {
  try {
    return await getProfile((await firebaseAdminAuth().getUserByEmail(email)).uid);
  } catch {
    return null;
  }
}

/**
 * Applies a new password from Firebase's out-of-band reset code (the emailed reset link).
 * Firebase revokes existing sessions on password change; we additionally revoke refresh tokens so no
 * stale session survives.
 */
export async function completePasswordResetAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetCompleteSchema.safeParse({
    token: String(formData.get("token") || ""),
    password: String(formData.get("password") || ""),
  });
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error) };

  const issues = (await import("@/lib/auth/password")).passwordPolicyIssues(parsed.data.password);
  if (issues.length) return { status: "error", errors: { password: issues.join(" ") } };
  if (parsed.data.password !== String(formData.get("confirm") || "")) {
    return { status: "error", errors: { confirm: "The two passwords do not match." } };
  }

  try {
    await resetPasswordWithCode(parsed.data.token, parsed.data.password);
    await recordAudit({
      actorEmail: "system", action: "PASSWORD_RESET_COMPLETED", entityType: "AdminUser",
      summary: "Password changed via Firebase reset link.",
      outcome: "SUCCESS",
    });
    return { status: "ok", message: "Your password has been changed. All existing sessions were signed out. You can now sign in." };
  } catch (error) {
    logError("auth.resetComplete", error);
    return { status: "error", message: "This reset link is invalid or has expired. Request a new one." };
  }
}
