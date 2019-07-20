module.exports = {
  extends: [
    '../.eslintrc.js'
  ],
  plugins: ['svelte3'],
  overrides: [
    {
      files: '*.svelte',
      processor: 'svelte3/svelte3',
    },
  ],
  env: {
    browser: true,
    node: false,
  },
  globals: {
    process: false,
  },
  rules: {
    'array-callback-return': 0,
    'object-shorthand': [2, 'always', { ignoreConstructors: false }],
    'no-return-assign': 0,
    'no-shadow': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'import/no-mutable-exports': 0,
  },
  settings: {
    'svelte3/ignore-styles': attributes => /^styl(us)?$/.test(attributes.lang),
  },
};
