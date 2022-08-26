module.exports = {
  env: {
    browser: true,
    commonjs: true,
  },
  extends: 'eslint-config-airbnb-base',
  rules: {
    'no-tabs': [
      'error',
      {
        allowIndentationTabs: true,
      },
    ],
  },
  ignorePatterns: ['**/node_modules/**/*', 'less.js'],
};
