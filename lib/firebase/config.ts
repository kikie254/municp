/**
 * Server-side Firebase environment configuration.
 *
 * DISTINCTION BETWEEN THE TWO CONFIGURATIONS
 * ------------------------------------------
 *  - The PUBLIC web configuration (NEXT_PUBLIC_FIREBASE_*) identifies the Firebase project and is
 *    safe to expose — it is the equivalent of a project identifier, not a credential.
 *  - The ADMIN configuration (FIREBASE_ADMIN_*) is a privileged service-account credential. It is
 *    read ONLY here, in server-only modules, and must never be prefixed with NEXT_PUBLIC_.
 *
 * In production on Google infrastructure the service account may be omitted entirely: the Admin SDK
 * then authenticates with Application Default Credentials, which is the preferred arrangement.
 */

export class FirebaseConfigError extends Error {
  constructor(missing: string) {
    super(`Firebase configuration is incomplete: ${missing}. See .env.example and FIREBASE_SETUP.md.`);
    this.name = "FirebaseConfigError";
  }
}

function clean(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

function privateKey(value: string | undefined): string | undefined {
  if (!value) return undefined;
  // Supports both single-line (literal \n) and multi-line env values.
  return value.includes("\\n") ? value.replace(/\\n/g, "\n") : value;
}

export const firebaseEnv = {
  projectId:
    clean(process.env.FIREBASE_ADMIN_PROJECT_ID) ??
    clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) ??
    clean(process.env.GCLOUD_PROJECT),
  clientEmail: clean(process.env.FIREBASE_ADMIN_CLIENT_EMAIL),
  privateKey: privateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
  storageBucket: clean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  /**
   * Web API key. Used SERVER-SIDE ONLY for the Identity Toolkit password-verification and reset
   * endpoints. A web API key is an identifier (it appears in every browser request anyway), but it
   * is deliberately NOT exposed through NEXT_PUBLIC_* because this application performs
   * authentication exclusively on the server.
   */
  webApiKey: clean(process.env.FIREBASE_WEB_API_KEY),
} as const;

export function adminProjectConfigured(): boolean {
  return Boolean(firebaseEnv.projectId);
}

export function assertAdminProjectConfigured(): void {
  if (!firebaseEnv.projectId) throw new FirebaseConfigError("FIREBASE_ADMIN_PROJECT_ID");
}

export function assertServiceAccountConfigured(): void {
  if (!firebaseEnv.projectId) throw new FirebaseConfigError("FIREBASE_ADMIN_PROJECT_ID");
  if (!firebaseEnv.clientEmail || !firebaseEnv.privateKey) {
    throw new FirebaseConfigError(
      "FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY (or Google Application Default Credentials)",
    );
  }
}

export function assertWebApiKeyConfigured(): void {
  if (!firebaseEnv.webApiKey) throw new FirebaseConfigError("FIREBASE_WEB_API_KEY");
}

/** Public (browser-safe) configuration for lib/firebase/client.ts. */
export const firebaseClientConfig = {
  apiKey: clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: clean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: clean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
} as const;
