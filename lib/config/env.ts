/**
 * Production environment validation.
 *
 * Reports which configuration values are present — never their contents. Called by the health probe,
 * by `npm run env:check` in CI/deployment and by the deployment guide's verification step, so a
 * missing production value fails loudly instead of surfacing as a confusing runtime error.
 */

export type EnvSeverity = "required" | "recommended";

/** Formal publication approval is an explicit institutional release gate. */
export function municipalPublicationApproved(): boolean {
  return process.env.MUNICIPAL_PUBLICATION_APPROVED === "true";
}

/** Public intake requires both formal publication approval and an explicit intake switch. */
export function publicIntakeEnabled(): boolean {
  return municipalPublicationApproved() && process.env.PUBLIC_SUBMISSIONS_ENABLED === "true";
}

export type EnvFinding = {
  /** The variable name only. Values are never read into the report. */
  name: string;
  severity: EnvSeverity;
  present: boolean;
  note: string;
};

function has(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

/**
 * Returns the checklist for the current process. `ok` means every REQUIRED value is present;
 * `recommended` gaps are reported but do not block a deployment.
 */
export function validateEnv(): { ok: boolean; production: boolean; findings: EnvFinding[] } {
  const production = isProduction();
  const serviceAccount = has("FIREBASE_ADMIN_CLIENT_EMAIL") && has("FIREBASE_ADMIN_PRIVATE_KEY");
  const adc = has("GOOGLE_APPLICATION_CREDENTIALS");

  const findings: EnvFinding[] = [
    {
      name: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      severity: "required",
      present: has("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
      note: "Identifies the Firebase project for the browser and for server defaults.",
    },
    {
      name: "FIREBASE_ADMIN_PROJECT_ID",
      severity: "required",
      present: has("FIREBASE_ADMIN_PROJECT_ID"),
      note: "Project the Admin SDK writes to. Must match the public project id.",
    },
    {
      name: "FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY (or GOOGLE_APPLICATION_CREDENTIALS)",
      severity: "required",
      present: serviceAccount || adc,
      note: "Privileged credential. On Google infrastructure, Application Default Credentials are preferred.",
    },
    {
      name: "FIREBASE_WEB_API_KEY",
      severity: "required",
      present: has("FIREBASE_WEB_API_KEY"),
      note: "Server-side Identity Toolkit key for password sign-in and reset.",
    },
    {
      name: "NEXT_PUBLIC_SITE_URL",
      severity: "required",
      present: has("NEXT_PUBLIC_SITE_URL"),
      note: "Canonical origin used in reset links, metadata and origin checks.",
    },
    {
      name: "PRIVACY_HASH_SECRET",
      severity: "required",
      present: (process.env.PRIVACY_HASH_SECRET ?? "").trim().length >= 32,
      note: "Salt for hashed IP addresses. At least 32 characters; the development fallback is refused in production.",
    },
    {
      name: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      severity: "recommended",
      present: has("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
      note: "Required for document upload and download.",
    },
    {
      name: "MFA_ENFORCEMENT=enforce",
      severity: "recommended",
      present: (process.env.MFA_ENFORCEMENT ?? "").toLowerCase() === "enforce",
      note: "Once every privileged account has enrolled a second factor, switch from report to enforce.",
    },
    {
      name: "MUNICIPAL_NOTIFICATIONS_EMAIL",
      severity: "recommended",
      present: Boolean(process.env.MUNICIPAL_NOTIFICATIONS_EMAIL?.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(process.env.MUNICIPAL_NOTIFICATIONS_EMAIL.trim())),
      note: "Approved institutional recipient for internal submission notifications; no placeholder fallback is used.",
    },
    {
      name: "EMAIL_PROVIDER + EMAIL_API_KEY",
      severity: "recommended",
      present: has("EMAIL_PROVIDER") && has("EMAIL_API_KEY"),
      note: "Without it, notifications are recorded as NOT_CONFIGURED in the outbox and the UI says so.",
    },
    {
      name: "BACKUP_GCS_BUCKET",
      severity: "recommended",
      present: has("BACKUP_GCS_BUCKET"),
      note: "Destination for scheduled Firestore exports (recovery procedure).",
    },
  ];

  if (production) {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
    if (siteUrl && !siteUrl.startsWith("https://")) {
      findings.push({
        name: "NEXT_PUBLIC_SITE_URL (https)",
        severity: "required",
        present: false,
        note: "A production origin must be https; session cookies and reset links depend on it.",
      });
    }
  }

  const ok = findings.filter((f) => f.severity === "required").every((f) => f.present);
  return { ok, production, findings };
}

/** Names of the missing REQUIRED variables only — safe to log and to return over the wire. */
export function missingRequired(): string[] {
  return validateEnv()
    .findings.filter((f) => f.severity === "required" && !f.present)
    .map((f) => f.name);
}
