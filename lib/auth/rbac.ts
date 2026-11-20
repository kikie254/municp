/**
 * Role-based access control.
 *
 * The matrix below is the single source of truth. It is enforced in server actions and route
 * handlers — never in the browser. Hiding a button is a usability decision, not an authorisation
 * control; every mutation re-checks the permission on the server.
 */
export const ROLES = ["SUPER_ADMIN", "CONTENT_ADMIN", "PROJECT_ADMIN", "REVIEWER"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Administrator",
  CONTENT_ADMIN: "Content Administrator",
  PROJECT_ADMIN: "Project Administrator",
  REVIEWER: "Reviewer",
};

export type Permission =
  | "news:write"
  | "news:review"
  | "projects:write"
  | "projects:review"
  | "notices:write"
  | "documents:write"
  | "submissions:read"
  | "submissions:manage"
  | "participation:manage"
  | "users:manage"
  | "audit:read"
  | "settings:read";

const MATRIX: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "news:write", "news:review", "projects:write", "projects:review", "notices:write",
    "documents:write", "submissions:read", "submissions:manage", "participation:manage",
    "users:manage", "audit:read", "settings:read",
  ],
  CONTENT_ADMIN: ["news:write", "notices:write", "documents:write", "submissions:read", "participation:manage", "settings:read"],
  PROJECT_ADMIN: ["projects:write", "submissions:read", "settings:read"],
  REVIEWER: ["news:review", "projects:review", "submissions:read", "audit:read", "settings:read"],
};

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function can(role: string, permission: Permission): boolean {
  if (!isRole(role)) return false;
  return MATRIX[role].includes(permission);
}

export function permissionsFor(role: string): Permission[] {
  return isRole(role) ? MATRIX[role] : [];
}

/**
 * A reviewer may not approve their own work: the four-eyes rule is enforced on the server in the
 * publish action, not merely hidden in the interface.
 */
export function canApproveOwnWork(): false {
  return false;
}
