module.exports = {
  root: true,
  extends: ['@oribet/eslint-config'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.js', '*.config.ts'],
}
