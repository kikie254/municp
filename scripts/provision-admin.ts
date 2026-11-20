/**
 * Administrator provisioning script.
 *
 * There is no default account and no password in the source tree. The first super administrator is
 * created from environment variables:
 *
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... npm run admin:provision
 *
 * The password is checked against the same policy the application enforces; it is stored ONLY in
 * Firebase Authentication — never in Firestore. Re-running the script does not overwrite an existing
 * account (it re-syncs the custom claim instead).
 */
import "dotenv/config";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Municipal Administrator";
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) fail("FIREBASE_ADMIN_PROJECT_ID must be set (see .env.example).");
if (!email || !password) fail("ADMIN_EMAIL and ADMIN_PASSWORD must be set. No account was created.");

function passwordPolicyIssues(pw: string): string[] {
  const issues: string[] = [];
  if (pw.length < 12) issues.push("Use at least 12 characters.");
  if (!/[a-z]/.test(pw)) issues.push("Include a lower-case letter.");
  if (!/[A-Z]/.test(pw)) issues.push("Include an upper-case letter.");
  if (!/[0-9]/.test(pw)) issues.push("Include a number.");
  if (!/[^A-Za-z0-9]/.test(pw)) issues.push("Include a symbol.");
  return issues;
}

const issues = passwordPolicyIssues(password!);
if (issues.length) fail(`ADMIN_PASSWORD does not meet the policy: ${issues.join(" ")}`);

const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
initializeApp(
  clientEmail && privateKey
    ? { credential: cert({ projectId, clientEmail, privateKey }), projectId }
    : { projectId },
);

async function main() {
  const auth = getAuth();
  const db = getFirestore();
  let uid: string;
  try {
    uid = (await auth.getUserByEmail(email!)).uid;
    console.log(`An account already exists for ${email}. Re-syncing role claim; nothing else changed.`);
  } catch {
    const created = await auth.createUser({ email, password, emailVerified: true, displayName: name });
    uid = created.uid;
  }
  await auth.setCustomUserClaims(uid, { role: "SUPER_ADMIN" });
  await db.collection("adminUsers").doc(uid).set(
    {
      uid,
      email,
      name,
      role: "SUPER_ADMIN",
      isActive: true,
      emailVerified: true,
      createdBy: "provisioning-script",
      lastLoginAt: null,
      roleChangedBy: "provisioning-script",
      roleChangedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { merge: true },
  );
  console.log(`Super administrator ready: ${email}.`);
  console.log('  Next: enrol a TOTP second factor for this account (Identity Platform, see FIREBASE_SETUP.md §2.5)');
  console.log('  and set MFA_ENFORCEMENT=enforce once every privileged account has enrolled.');
  process.exit(0);
}

main().catch((error) => fail(`Provisioning failed: ${error instanceof Error ? error.message : error}`));
