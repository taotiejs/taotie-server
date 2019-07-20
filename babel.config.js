const exclude = [
  '@babel/plugin-transform-async-to-generator',
  '@babel/plugin-transform-regenerator',
  '@babel/plugin-transform-typeof-symbol',
];

const plugins = ['@babel/plugin-syntax-dynamic-import'];

module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        loose: true,
        modules: false,
        exclude,
      },
    ],
  ],
  plugins,
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env', {
            loose: true,
            exclude,
          },
        ],
      ],
      plugins,
    },
  },
};
