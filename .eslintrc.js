// Config
const config = {
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
  extends: ["airbnb-base", "prettier", "plugin:react/recommended"],
  plugins: ["prettier", "react"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },

  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "no-debugger": "error",
    "react/prop-types": "off",
  },
};
// Export the default config
module.exports = config;
