module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "../.eslintrc.json",
    "eslint:recommended",
    //"plugin:import/errors",
    //"plugin:import/warnings",
    //"plugin:import/typescript",
    // "google",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
  },
};
