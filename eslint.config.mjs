import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// ESLint 9 flat config. `next lint` was removed in Next.js 16, so the project
// lints through the ESLint CLI directly (see the "lint" script in package.json).
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "*.tsbuildinfo",
      "public/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Institutional content contains prose apostrophes and quotation marks.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
