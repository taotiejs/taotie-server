module.exports = {
  extends: 'airbnb-base',
  env: {
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    'no-loop-func': 0,
    'no-multi-assign': 0,
    'no-new-func': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'max-len': 0,
    'guard-for-in': 0,
    'import/prefer-default-export': 0,
  },
};
