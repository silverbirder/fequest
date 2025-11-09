module.exports = {
  "*.{ts,tsx}": [() => "pnpm check-types", "eslint --fix", "prettier --write"],
  "*.{md,json}": ["prettier --write"],
};
