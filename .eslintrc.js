module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { args: 'all', argsIgnorePattern: '^_', },
    ],
    'class-methods-use-this': 'off',
    'no-console': 'error',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    curly: ['error', 'multi'],
    'no-confusing-arrow': ['error', { allowParens: false}],
    'no-restricted-syntax': ['error', 'SequenceExpression'],
  },
};