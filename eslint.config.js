import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "dist/",
      ".vercel/",
      "node_modules/",
      "public/",
      "**/node_modules/",
      ".claude/skills/*/node_modules/",
    ],
  },
  js.configs.recommended,
  {
    // Browser-facing application and client-side JS.
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // Node tooling: build scripts, config, and skill drivers.
    files: [
      "scripts/*.mjs",
      "vite.config.js",
      "eslint.config.js",
      ".claude/skills/**/*.mjs",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Skill drivers run Node but inject snippets into the browser context
    // (e.g. Playwright page.evaluate), so browser globals are valid here too.
    files: [".claude/skills/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // Disable rules that conflict with Prettier. Must remain last.
  prettier,
];
