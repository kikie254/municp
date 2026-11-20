import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Separate Vitest config for the Firebase Emulator rules tests (`npm run test:rules`).
 *
 * The default config (vitest.config.ts) covers unit tests only; these tests need the Firestore and
 * Storage emulators, which are started around the run by firebase-tools emulators:exec. Keeping the
 * two configs apart means `npm run test` never depends on Java or the emulator being present.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["tests/rules/**/*.test.ts"],
    testTimeout: 30000,
    hookTimeout: 60000,
  },
});
