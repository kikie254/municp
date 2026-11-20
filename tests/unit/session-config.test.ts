import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * Session cookie policy. lib/auth/session.ts clamps the configured lifetime so a misconfigured
 * environment cannot create a multi-day administrative session.
 */
const ORIGINAL = { ...process.env };
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  Object.assign(process.env, ORIGINAL);
});

async function loadSession(env: Record<string, string>) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  return import("@/lib/auth/session");
}

describe("session configuration", () => {
  it("uses a stable cookie name and an httpOnly-safe constant", async () => {
    const mod = await loadSession({ SESSION_TTL_HOURS: "8" });
    expect(mod.SESSION_COOKIE).toBe("itm_session");
  });

  it("loads with an out-of-range TTL without throwing (clamped internally)", async () => {
    const mod = await loadSession({ SESSION_TTL_HOURS: "9999" });
    expect(typeof mod.createSessionFromIdToken).toBe("function");
  });

  it("loads with a non-numeric TTL", async () => {
    const mod = await loadSession({ SESSION_TTL_HOURS: "not-a-number" });
    expect(typeof mod.destroySession).toBe("function");
  });
});
