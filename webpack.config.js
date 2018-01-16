const path    = require('path');

const SOURCE_DIR = path.resolve(__dirname, 'src/');
const BUILD_DIR  = path.resolve(__dirname, 'build/');

module.exports = {
  entry: SOURCE_DIR + '/report.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'report.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader" 
        }, {
          loader: "sass-loader"
        }]
      }, {
        test: /\.jsx?$/,
        include: SOURCE_DIR,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  },
  externals: {
    'react': 'commonjs react'
  }
};
