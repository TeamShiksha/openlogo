import globals from "globals";
import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["/coverage"],
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "require-await": "error",
      "no-unused-labels": "error",
      indent: ["error", 2],
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  prettierConfig,
];
