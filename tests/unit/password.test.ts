import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, passwordPolicyIssues } from "@/lib/auth/password";

describe("password hashing (scrypt)", () => {
  it("never stores the plaintext", async () => {
    const hash = await hashPassword("Municipal#Admin2026");
    expect(hash).not.toContain("Municipal");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(hash.split("$")).toHaveLength(6);
  });

  it("verifies a correct password", async () => {
    const hash = await hashPassword("Municipal#Admin2026");
    expect(await verifyPassword("Municipal#Admin2026", hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("Municipal#Admin2026");
    expect(await verifyPassword("Municipal#Admin2027", hash)).toBe(false);
  });

  it("rejects malformed stored hashes without throwing", async () => {
    expect(await verifyPassword("anything", "not-a-hash")).toBe(false);
    expect(await verifyPassword("anything", "")).toBe(false);
  });

  it("produces a different hash each time (unique salt)", async () => {
    const a = await hashPassword("Municipal#Admin2026");
    const b = await hashPassword("Municipal#Admin2026");
    expect(a).not.toBe(b);
  });

  it("refuses passwords shorter than 12 characters", async () => {
    await expect(hashPassword("short")).rejects.toThrow(/at least 12/);
  });

  it("reports policy problems", () => {
    expect(passwordPolicyIssues("short")).not.toHaveLength(0);
    expect(passwordPolicyIssues("alllowercase123!")).toContain("Include an upper-case letter.");
    expect(passwordPolicyIssues("Municipal#Admin2026")).toHaveLength(0);
  });
});
