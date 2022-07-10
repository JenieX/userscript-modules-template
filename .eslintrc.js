module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    //
    'airbnb-base',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    GM_xmlhttpRequest: 'readonly',
  },
  rules: {
    'no-console': 'off',
    'no-alert': 'off',
    'import/extensions': 'off',
    // camelcase: ['error', { allow: ['GM_getValue', 'GM_setValue'] }],
  },
};
