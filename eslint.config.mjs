import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["test/**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    ignores: [".next/**", "out/**", ".test-build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
