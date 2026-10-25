export default {
  'assets/js/{main,catalog-utils,catalog-store,link-target,check-link,case-source,case,mourn,theme}.js':
    'eslint --fix',
  'scripts/**/*.{js,mjs}': 'eslint --fix',
  'tests/**/*.js': 'eslint --fix',
  '{eslint.config.js,playwright.config.js,vite.config.js,commitlint.config.mjs,lint-staged.config.mjs}':
    'eslint --fix',
};
