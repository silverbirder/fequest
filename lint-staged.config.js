const runTypeCheck = (files) => (files.length ? 'pnpm check-types' : []);

module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.{md,json}': [
    'prettier --write'
  ],
  '**/*.{ts,tsx}': runTypeCheck
};
