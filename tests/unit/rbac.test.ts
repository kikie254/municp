import { describe, it, expect } from "vitest";
import { can, permissionsFor, canApproveOwnWork, ROLES, ROLE_LABELS } from "@/lib/auth/rbac";

describe("role-based access control", () => {
  it("gives the super administrator every permission", () => {
    const p = permissionsFor("SUPER_ADMIN");
    expect(p).toContain("users:manage");
    expect(p).toContain("audit:read");
    expect(p).toContain("news:write");
    expect(p).toContain("news:review");
  });

  it("keeps content administration away from user management", () => {
    expect(can("CONTENT_ADMIN", "news:write")).toBe(true);
    expect(can("CONTENT_ADMIN", "users:manage")).toBe(false);
  });

  it("does not let a project administrator publish news", () => {
    expect(can("PROJECT_ADMIN", "projects:write")).toBe(true);
    expect(can("PROJECT_ADMIN", "news:write")).toBe(false);
    expect(can("PROJECT_ADMIN", "news:review")).toBe(false);
  });

  it("lets a reviewer approve but not author", () => {
    expect(can("REVIEWER", "news:review")).toBe(true);
    expect(can("REVIEWER", "news:write")).toBe(false);
  });

  it("enforces the four-eyes rule regardless of role", () => {
    expect(ROLES.length).toBe(4);
    expect(canApproveOwnWork()).toBe(false);
  });

  it("has a label for every role", () => {
    for (const role of ROLES) expect(ROLE_LABELS[role]).toBeTruthy();
  });
});
