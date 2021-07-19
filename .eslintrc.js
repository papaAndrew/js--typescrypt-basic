module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    //  "airbnb-typescript",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.eslint.json",
  },
  plugins: ["@typescript-eslint", "jest"],
  rules: {
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "@typescript-eslint/dot-notation": "off",
    "@typescript-eslint/no-var-requires": "off",
  },
};
