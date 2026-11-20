import { describe, it, expect, vi, afterEach } from "vitest";
import { hashIp } from "@/lib/security/tokens";

const ORIGINAL = { ...process.env };
afterEach(() => {
  vi.unstubAllEnvs();
  Object.assign(process.env, ORIGINAL);
});

describe("ip pseudonymisation", () => {
  it("is deterministic for the same secret and address", () => {
    vi.stubEnv("PRIVACY_HASH_SECRET", "x".repeat(64));
    expect(hashIp("203.0.113.9")).toBe(hashIp("203.0.113.9"));
    expect(hashIp("203.0.113.9")).toHaveLength(32);
  });

  it("differs between addresses and between secrets", () => {
    vi.stubEnv("PRIVACY_HASH_SECRET", "x".repeat(64));
    const a = hashIp("203.0.113.9");
    const b = hashIp("203.0.113.10");
    expect(a).not.toBe(b);
    vi.stubEnv("PRIVACY_HASH_SECRET", "y".repeat(64));
    expect(hashIp("203.0.113.9")).not.toBe(a);
  });

  it("returns undefined for a missing address", () => {
    expect(hashIp(null)).toBeUndefined();
  });

  it("refuses the development fallback salt in production", () => {
    vi.stubEnv("PRIVACY_HASH_SECRET", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => hashIp("203.0.113.9")).toThrow(/PRIVACY_HASH_SECRET/);
  });

  it("keeps a development fallback outside production", () => {
    vi.stubEnv("PRIVACY_HASH_SECRET", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(hashIp("203.0.113.9")).toHaveLength(32);
  });
});
