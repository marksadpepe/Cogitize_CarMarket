// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'prettier/prettier': 'error',
      'linebreak-style': ['error', 'unix'],
      'eol-last': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'no-redeclare': 'error',
      'no-console': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'spaced-comment': ['error', 'always'],
      'space-before-blocks': 'error',
      'space-infix-ops': 'error',
      'newline-before-return': 'error',
      'lines-between-class-members': 'off',
      'consistent-return': 'off',
      'object-curly-newline': 'off',
      'no-return-await': 'off',
      'no-restricted-imports': ['error', { patterns: ['../*', './*'] }],
      'sort-imports': ['error', { allowSeparatedGroups: true, ignoreDeclarationSort: true }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: 'block-like' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'never', prev: 'case', next: '*' },
        { blankLine: 'always', prev: '*', next: 'export' },
      ],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/typedef': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/array-type': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['error'],
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'angle-bracket' }],
    },
  },
  {
    files: ['src/main.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
);
