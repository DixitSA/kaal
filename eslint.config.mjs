import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:jsx-a11y/recommended"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "kaal/**",
      "kaal-backend/**",
      ".agents/**",
      ".claude/**",
      ".planning/**",
      ".vercel/**",
      ".vscode/**",
      "next-env.d.ts",
      "agency-agents-tmp/**",
      "graphify-out/**",
      "ios/**",
      "thoughts/**",
    ],
  },
];

export default eslintConfig;
