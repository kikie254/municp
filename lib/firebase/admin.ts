import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth, type Auth } from "firebase-admin/auth";

import { assertAdminProjectConfigured, assertServiceAccountConfigured, firebaseEnv } from "./config";

/**
 * Single initialized Firebase Admin application instance.
 *
 * Next.js reloads modules in development, which would otherwise create a new App on every edit, so
 * the instance is cached on `globalThis` outside production. Every privileged operation — database,
 * identity, storage — goes through this module; nothing else initialises Firebase.
 *
 * This file is `server-only`: importing it from a client component is a build error, which prevents
 * the accidental bundling of privileged code into the browser.
 */

const globalForFirebase = globalThis as unknown as { __itmAdminApp?: App };

function app(): App {
  if (globalForFirebase.__itmAdminApp) return globalForFirebase.__itmAdminApp;
  const existing = getApps();
  const instance =
    existing.find((a) => a.name === "iten-tambach-admin") ??
    (() => {
      assertAdminProjectConfigured();
      const hasServiceAccount = Boolean(firebaseEnv.clientEmail && firebaseEnv.privateKey);
      if (hasServiceAccount) assertServiceAccountConfigured();
      const app = initializeApp(
        {
          // When no service account is supplied, the Admin SDK falls back to Google Application
          // Default Credentials (Cloud Run, Vercel workload identity, GOOGLE_APPLICATION_CREDENTIALS).
          ...(hasServiceAccount
            ? {
                credential: cert({
                  projectId: firebaseEnv.projectId!,
                  clientEmail: firebaseEnv.clientEmail!,
                  privateKey: firebaseEnv.privateKey!,
                }),
              }
            : {}),
          projectId: firebaseEnv.projectId,
          ...(firebaseEnv.storageBucket ? { storageBucket: firebaseEnv.storageBucket } : {}),
        },
        "iten-tambach-admin",
      );
      // FB-01: SDK settings are applied exactly once, at initialisation, BEFORE first use. Calling
      // `.settings()` on an already-initialised Firestore instance throws ("You can only call
      // settings() once"), so it must never be done inside the per-call accessor below.
      initializeFirestore(app, { ignoreUndefinedProperties: true } as Parameters<typeof initializeFirestore>[1]);
      return app;
    })();
  globalForFirebase.__itmAdminApp = instance;
  return instance;
}

/** Firebase Authentication — used for session cookies, claims and account provisioning. */
export function firebaseAdminAuth(): Auth {
  return getAuth(app());
}

/** Cloud Firestore — the primary application database. */
export function firestore(): Firestore {
  // FB-01 fix: settings were applied once in app() via initializeFirestore. This accessor only
  // returns the cached instance — it must never re-configure it.
  return getFirestore(app());
}

/** Cloud Storage bucket — private document and media storage. */
export function storageBucket() {
  return getStorage(app()).bucket(firebaseEnv.storageBucket || undefined);
}

export { Timestamp, FieldValue } from "firebase-admin/firestore";
