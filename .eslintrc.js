module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.json',
      },
      alias: {
        map: [['@/*', 'src/*']],
        extensions: ['.ts'],
      },
    },
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/prefer-default-export': 'off',
    'no-promise-executor-return': 'off',
    'no-async-promise-executor': 'off',
    'consistent-return': 'off',
    '@typescript-eslint/require-await': 'off',
    'max-len': ['error', { 'code': 120 }],
    'no-underscore-dangle': ['error', { 'allow': ['_id'] }],
    'no-param-reassign': ['error', { 'props': false }],
  },
};
