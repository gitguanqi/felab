import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: [
      'assets/js/main.js',
      'assets/js/catalog-utils.js',
      'assets/js/catalog-store.js',
      'assets/js/link-target.js',
      'assets/js/check-link.js',
      'assets/js/case-source.js',
      'assets/js/case.js',
      'assets/js/mourn.js',
      'assets/js/theme.js',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.js', '*.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
  prettier,
];
