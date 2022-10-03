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
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ignorePackages: true,
        pattern: {
          js: 'always',
        },
      },
    ],
  },
  ignorePatterns: ['**/node_modules/**/*', 'less.js'],
};
