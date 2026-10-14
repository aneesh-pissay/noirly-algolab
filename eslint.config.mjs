import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The visualization engine is out of scope for app changes (its step
    // contract is shared by every lesson); keep its legacy style as warnings.
    files: ["src/core/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
    },
  },
  {
    // Standalone Visual Lab demos predate the shared engine renderers. They
    // render code samples as JSX text and drive local playback from effects;
    // these stay warnings until each demo moves onto UniversalVisualizer.
    files: ["app/(app)/visual-lab/**", "app/(app)/algorithms/**", "app/(app)/data-structures/**"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // End-to-end build output and reports.
    ".next-e2e/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
