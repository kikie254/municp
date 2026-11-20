/**
 * Firestore and Storage rules tests — run against the Firebase Emulator Suite:
 *
 *   npm run test:rules
 *
 * firebase-tools starts the emulators, runs this suite through vitest.rules.config.ts and tears the
 * emulators down afterwards. The suite self-skips when the emulator is not reachable, so a plain
 * `vitest run` outside the pipeline never fails spuriously.
 */
import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestContext,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { getBytes, ref, uploadBytes, type FirebaseStorage } from "firebase/storage";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const emulatorReachable = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

let testEnv: RulesTestEnvironment;

// The whole suite is skipped when firebase-tools has not injected the emulator host, so the file
// reports a skip (not a failure) outside `npm run test:rules`.
const suite = (emulatorReachable ? describe : describe.skip) as typeof describe;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-itm",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
    storage: { rules: readFileSync("storage.rules", "utf8") },
  });
});

beforeEach(async () => testEnv.clearFirestore());
afterAll(async () => testEnv.cleanup());

const published = { status: "PUBLISHED", publishedAt: new Date(), archivedAt: null };
const draft = { status: "DRAFT", publishedAt: null, archivedAt: null };

suite("firestore.rules — total client deny (FB-02)", () => {
  // FB-02 fix: the application reads only through the Admin SDK, so no client read is allowed —
  // not even published content. Direct queries previously leaked embargoed items and internal
  // fields and were unbilled-rate-limited.
  it("denies reading even PUBLISHED news", async () => {
    await testEnv.withSecurityRulesDisabled((c: RulesTestContext) => c.firestore().collection("news").doc("n1").set(published));
    await assertFails(testEnv.unauthenticatedContext().firestore().collection("news").doc("n1").get());
  });

  it("denies reading draft news", async () => {
    await testEnv.withSecurityRulesDisabled((c: RulesTestContext) => c.firestore().collection("news").doc("n2").set(draft));
    await assertFails(testEnv.unauthenticatedContext().firestore().collection("news").doc("n2").get());
  });

  it("denies any client write to news", async () => {
    await assertFails(testEnv.unauthenticatedContext().firestore().collection("news").doc("n3").set(published));
  });
});

suite("firestore.rules — confidential collections", () => {
  it.each(["submissions", "submissionNotes", "adminUsers", "auditLogs", "settings", "rateLimits", "emailOutbox", "participationResponses"])(
    "denies unauthenticated read and write of %s",
    async (collection) => {
      const db = testEnv.unauthenticatedContext().firestore();
      await assertFails(db.collection(collection).doc("x").get());
      await assertFails(db.collection(collection).doc("x").set({ any: "value" }));
    },
  );
});

suite("storage.rules", () => {
  /* rules-unit-testing exposes the Firebase JS Storage SDK; objects are reached through the
     modular ref()/uploadBytes()/getBytes() functions exactly as a browser client would. */
  const storageOf = (ctx: { storage(): FirebaseStorage }): FirebaseStorage => ctx.storage();

  it("denies unauthenticated download of a private document", async () => {
    await testEnv.withSecurityRulesDisabled(async (c: RulesTestContext) => {
      await uploadBytes(ref(storageOf(c), "private/documents/x/file.pdf"), Buffer.from("x"));
    });
    await assertFails(getBytes(ref(storageOf(testEnv.unauthenticatedContext()), "private/documents/x/file.pdf")));
  });

  it("denies unauthenticated upload anywhere", async () => {
    await assertFails(uploadBytes(ref(storageOf(testEnv.unauthenticatedContext()), "public/news/x/img.png"), Buffer.from("x")));
  });
});
