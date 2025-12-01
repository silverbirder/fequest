import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import onlyWarn from "eslint-plugin-only-warn";
import perfectionist from "eslint-plugin-perfectionist";
import pluginReact from "eslint-plugin-react";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  perfectionist.configs["recommended-natural"],
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.tsx"],
    plugins: { react: pluginReact },
    rules: {
      "react/forbid-dom-props": ["error", { forbid: ["className"] }],
      "react/forbid-component-props": ["error", { forbid: ["className"] }],
    },
  },
  {
    files: [
      "**/*.spec.tsx",
      "**/*.stories.tsx",
      "**/src/components/common/**",
      "**/src/app/layout.tsx",
    ],
    rules: {
      "react/forbid-dom-props": "off",
      "react/forbid-component-props": "off",
    },
  },
];
