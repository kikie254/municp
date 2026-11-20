import { createHash, randomBytes } from "node:crypto";

/** SHA-256 hex digest. Used for session tokens, reset tokens and IP pseudonymisation. */
export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** 32 bytes of CSPRNG entropy, base64url encoded. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/**
 * Pseudonymises a client IP address before it is stored. The raw address is never persisted;
 * the hash is salted with a server secret so it cannot be reversed by enumeration.
 */
export function hashIp(ip: string | null | undefined): string | undefined {
  if (!ip) return undefined;
  const configured = process.env.PRIVACY_HASH_SECRET?.trim();
  if (!configured) {
    // A hard-coded fallback salt in production would make every stored IP hash reversible by
    // dictionary attack, so production refuses rather than silently degrading. Development keeps a
    // fixed salt so local runs stay reproducible.
    if (process.env.NODE_ENV === "production") {
      throw new Error("PRIVACY_HASH_SECRET is not configured. Refusing to pseudonymise with a public fallback salt.");
    }
    return sha256(`development-only-not-a-secret:${ip}`).slice(0, 32);
  }
  return sha256(`${configured}:${ip}`).slice(0, 32);
}

const REF_ALPHABET = "ACDEFGHJKLMNPQRTUVWXY34679";

/**
 * Human-readable public reference, e.g. ITM-ENQ-7K4P-Q9XD.
 * Uses an unambiguous alphabet (no O/0, I/1, S/5, B/8) so it can be read aloud over a telephone.
 */
export function publicReference(type: string): string {
  const prefix =
    type === "COMPLAINT" ? "CMP" :
    type === "FEEDBACK" ? "FBK" :
    type === "SUGGESTION" ? "SUG" :
    type === "PARTICIPATION" ? "PAR" : "ENQ";
  const block = (n: number) =>
    Array.from(randomBytes(n)).map((b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
  return `ITM-${prefix}-${block(4)}-${block(4)}`;
}

/** URL-safe slug from a title. Deterministic so it can be de-duplicated. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "item";
}
