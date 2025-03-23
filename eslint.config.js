import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import autoImports from "./.wxt/eslint-auto-imports.mjs";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
	autoImports,
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{ rules: { "react/react-in-jsx-scope": "off" } },
	eslintConfigPrettier,
]);
