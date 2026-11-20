import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEYLEN = 64;
const SALT_BYTES = 16;
const PARAMS = { N: 16384, r: 8, p: 1 } as const;

/**
 * Password hashing — scrypt (RFC 7914) from the Node standard library.
 *
 * scrypt is memory-hard and ships with Node, so no native module or third-party hashing package is
 * required. The encoded string is `scrypt$N$r$p$salt$hash`, which keeps the parameters with the
 * hash so they can be raised later without invalidating existing credentials.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length < 12) {
    throw new Error("Password must be at least 12 characters.");
  }
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(password.normalize("NFKC"), salt, KEYLEN);
  return ["scrypt", PARAMS.N, PARAMS.r, PARAMS.p, salt.toString("base64"), derived.toString("base64")].join("$");
}

/** Constant-time verification. Returns false for malformed input rather than throwing. */
export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  try {
    const parts = encoded.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const salt = Buffer.from(parts[4], "base64");
    const expected = Buffer.from(parts[5], "base64");
    const derived = await scrypt(password.normalize("NFKC"), salt, expected.length);
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Rejects the passwords an administrator should never be able to set. */
export function passwordPolicyIssues(password: string): string[] {
  const issues: string[] = [];
  if (password.length < 12) issues.push("Use at least 12 characters.");
  if (!/[a-z]/.test(password)) issues.push("Include a lower-case letter.");
  if (!/[A-Z]/.test(password)) issues.push("Include an upper-case letter.");
  if (!/[0-9]/.test(password)) issues.push("Include a number.");
  if (!/[^A-Za-z0-9]/.test(password)) issues.push("Include a symbol.");
  return issues;
}
