module.exports = {
  plugins: ['es6-promise'],
  presets: [
    [
      '@babel/env',
      {
        corejs: 3,
        targets: {
          browsers: ['last 2 versions', 'safari >= 7']
        },
        useBuiltIns: 'usage'
      },
    ],
    '@babel/preset-react',
  ],
};
