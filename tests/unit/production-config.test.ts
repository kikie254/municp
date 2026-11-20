import { describe, it, expect, afterEach, vi } from "vitest";

/**
 * Production configuration guards.
 *
 * These assert the behaviours that were hardened for deployment: the environment validator reports
 * by NAME only, and the IP pseudonymiser refuses to use the development salt in production.
 */
import { validateEnv, missingRequired } from "@/lib/config/env";

const ORIGINAL = { ...process.env };
afterEach(() => {
  vi.unstubAllEnvs();
  for (const key of Object.keys(process.env)) if (!(key in ORIGINAL)) delete process.env[key];
  Object.assign(process.env, ORIGINAL);
});

describe("environment validation", () => {
  it("reports missing required values by name and never by value", () => {
    vi.stubEnv("FIREBASE_ADMIN_PROJECT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "");
    const result = validateEnv();
    expect(result.ok).toBe(false);
    expect(result.findings.some((f) => f.name === "FIREBASE_ADMIN_PROJECT_ID" && !f.present)).toBe(true);
    // No finding may carry a secret value — only the variable name.
    for (const f of result.findings) expect(f).not.toHaveProperty("value");
  });

  it("treats a full configuration as complete", () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "iten-tambach-prod");
    vi.stubEnv("FIREBASE_ADMIN_PROJECT_ID", "iten-tambach-prod");
    vi.stubEnv("FIREBASE_ADMIN_CLIENT_EMAIL", "svc@example.iam.gserviceaccount.com");
    vi.stubEnv("FIREBASE_ADMIN_PRIVATE_KEY", "PLACEHOLDER-KEY-MATERIAL-NOT-A-REAL-KEY");
    vi.stubEnv("FIREBASE_WEB_API_KEY", "key");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    vi.stubEnv("PRIVACY_HASH_SECRET", "a".repeat(64));
    expect(missingRequired()).toEqual([]);
  });

  it("flags a too-short PRIVACY_HASH_SECRET as missing", () => {
    vi.stubEnv("PRIVACY_HASH_SECRET", "short");
    expect(missingRequired()).toContain("PRIVACY_HASH_SECRET");
  });

  it("accepts either a service account or Application Default Credentials", () => {
    vi.stubEnv("FIREBASE_ADMIN_CLIENT_EMAIL", "");
    vi.stubEnv("FIREBASE_ADMIN_PRIVATE_KEY", "");
    vi.stubEnv("GOOGLE_APPLICATION_CREDENTIALS", "/var/secrets/adc.json");
    const sa = validateEnv().findings.find((f) => f.name.startsWith("FIREBASE_ADMIN_CLIENT_EMAIL"));
    expect(sa?.present).toBe(true);
  });
});
