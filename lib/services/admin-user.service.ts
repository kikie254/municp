import "server-only";

import { firebaseAdminAuth } from "../firebase/admin";

import { COLLECTIONS } from "../firebase/collections";
import { firestore } from "../firebase/admin";
import { col, getDocByField, list, updateDoc } from "../firebase/db";
import { ServiceError } from "../firebase/errors";
import { recordAuditStrict } from "./audit.service";
import type { AdminUserProfile, CollectionRecordMap } from "../firebase/types";

/**
 * Administrator identity and provisioning.
 *
 * Administrator accounts are provisioned ONLY through a controlled, authorised process — either
 * this service (used by the super-administrator User management screens and the provisioning
 * script) or the Firebase console. There is no public registration path: the Firestore rules deny
 * all client access to /adminUsers, and every entry point here requires a caller that has already
 * passed the users:manage permission check on the server.
 *
 * Roles live in TWO places by design:
 *  - the /adminUsers/{uid} profile — the trusted source of truth for authorisation decisions;
 *  - a Firebase custom claim — a cache that survives token verification but is NEVER the only
 *    authorisation source. When a role changes, both are updated and existing sessions are revoked,
 *    so stale claims cannot grant continued access.
 */

export type Role = AdminUserProfile["role"];

export async function getProfile(uid: string): Promise<AdminUserProfile | null> {
  const snap = await firestore().collection(COLLECTIONS.adminUsers).doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data() as Omit<AdminUserProfile, "id">;
  return {
    ...data,
    lastLoginAt: data.lastLoginAt ?? null,
    createdAt: (data.createdAt as unknown as { toDate(): Date })?.toDate?.() ?? (data.createdAt as unknown as Date),
    updatedAt: (data.updatedAt as unknown as { toDate(): Date })?.toDate?.() ?? (data.updatedAt as unknown as Date),
    roleChangedAt: (data.roleChangedAt as unknown as { toDate(): Date })?.toDate?.() ?? data.roleChangedAt ?? null,
  };
}

export async function getProfileByEmail(email: string): Promise<(AdminUserProfile & { id: string }) | null> {
  return getDocByField(COLLECTIONS.adminUsers, "email", email.trim().toLowerCase());
}

export async function listProfiles(): Promise<(AdminUserProfile & { id: string })[]> {
  return list(COLLECTIONS.adminUsers, (c) => c.orderBy("createdAt", "asc"));
}

/**
 * Creates an administrator: Firebase Auth account (no password stored anywhere in Firestore),
 * profile document and SUPER_ADMIN-or-lower custom claim. Used by scripts/provision-admin.ts.
 * `emailVerified` is set here because accounts are created by the institution, not self-registered.
 */
export async function provisionAdmin(params: {
  email: string;
  name: string;
  role: Role;
  password: string;
  createdByUid?: string | null;
  createdByEmail?: string | null;
}): Promise<{ uid: string }> {
  const auth = firebaseAdminAuth();
  const email = params.email.trim().toLowerCase();
  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch {
    user = await auth.createUser({ email, password: params.password, emailVerified: true, displayName: params.name });
  }
  await auth.setCustomUserClaims(user.uid, { role: params.role });
  const profile: CollectionRecordMap["adminUsers"] = {
    uid: user.uid,
    email,
    name: params.name,
    role: params.role,
    isActive: true,
    emailVerified: true,
    createdBy: params.createdByEmail ?? "provisioning-script",
    lastLoginAt: null,
    roleChangedBy: params.createdByEmail ?? "provisioning-script",
    roleChangedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await firestore().collection(COLLECTIONS.adminUsers).doc(user.uid).set(profile as unknown as Record<string, unknown>);
  return { uid: user.uid };
}

/**
 * Role change: updates the trusted profile, the custom claim, and revokes existing sessions so a
 * demoted administrator's current cookie cannot keep the old authority. Strict audit: the change
 * fails loudly if the audit record cannot be written.
 */
export async function changeRole(targetUid: string, newRole: Role, actor: { uid: string; email: string }): Promise<void> {
  const before = await getProfile(targetUid);
  if (!before) throw new ServiceError("Administrator profile not found.", "not-found");
  if (before.role === newRole) return;
  await updateAdminProfileRaw(targetUid, { role: newRole, roleChangedBy: actor.email, roleChangedAt: new Date() });
  await firebaseAdminAuth().setCustomUserClaims(targetUid, { role: newRole });
  await firebaseAdminAuth().revokeRefreshTokens(targetUid);
  await recordAuditStrict({
    actorId: actor.uid,
    actorEmail: actor.email,
    actorRole: "SUPER_ADMIN",
    action: "USER_ROLE_CHANGED",
    entityType: "AdminUser",
    entityId: targetUid,
    summary: `Role of ${before.email}: ${before.role} → ${newRole}. Sessions revoked.`,
  });
}

/**
 * Deactivation: disables the Firebase Auth account, marks the profile inactive, revokes sessions
 * and records the change. Reactivation re-enables the Auth account without touching credentials.
 */
export async function setActive(targetUid: string, isActive: boolean, actor: { uid: string; email: string }): Promise<void> {
  const before = await getProfile(targetUid);
  if (!before) throw new ServiceError("Administrator profile not found.", "not-found");
  await updateAdminProfileRaw(targetUid, { isActive });
  await firebaseAdminAuth().updateUser(targetUid, { disabled: !isActive });
  if (!isActive) await firebaseAdminAuth().revokeRefreshTokens(targetUid);
  await recordAuditStrict({
    actorId: actor.uid,
    actorEmail: actor.email,
    actorRole: "SUPER_ADMIN",
    action: isActive ? "USER_REACTIVATED" : "USER_DEACTIVATED",
    entityType: "AdminUser",
    entityId: targetUid,
    summary: `${isActive ? "Reactivated" : "Deactivated"} ${before.email}. Sessions revoked.`,
  });
}

/** Sets a new password out-of-band (super-administrator assisted reset) and revokes sessions. */
export async function setAdminPassword(targetUid: string, password: string, actor: { uid: string; email: string }): Promise<void> {
  const before = await getProfile(targetUid);
  if (!before) throw new ServiceError("Administrator profile not found.", "not-found");
  await firebaseAdminAuth().updateUser(targetUid, { password });
  await firebaseAdminAuth().revokeRefreshTokens(targetUid);
  await recordAuditStrict({
    actorId: actor.uid,
    actorEmail: actor.email,
    actorRole: "SUPER_ADMIN",
    action: "USER_PASSWORD_SET",
    entityType: "AdminUser",
    entityId: targetUid,
    summary: `Password reset for ${before.email}; all sessions revoked.`,
  });
}

export async function touchLastLogin(uid: string): Promise<void> {
  await col(COLLECTIONS.adminUsers).doc(uid).update({ lastLoginAt: new Date(), updatedAt: new Date() } as unknown as Record<string, unknown>);
}

export async function updateAdminProfileRaw(uid: string, data: Partial<Omit<AdminUserProfile, "id">>): Promise<void> {
  await updateDoc(COLLECTIONS.adminUsers as never, uid, data as never);
}

/** Counts active super administrators — used to protect the last capable account. */
export async function countActiveSuperAdmins(): Promise<number> {
  const snap = await col(COLLECTIONS.adminUsers).where("role", "==", "SUPER_ADMIN").where("isActive", "==", true).count().get();
  return snap.data().count;
}
