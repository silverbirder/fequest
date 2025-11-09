const runCiFix = (files) => (files.length ? 'pnpm ci:fix' : []);

module.exports = {
  '*': runCiFix
};
