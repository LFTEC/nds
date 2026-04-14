import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, ...compat.config({
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': "off"
  }
}), {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;
