const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { optimize, DefinePlugin, HashedModuleIdsPlugin, NoEmitOnErrorsPlugin } = require('webpack');

const DEV_CONFIGURATION = {
  devtool: 'source-map',
  devServer: {
    contentBase: ['/dev'],
    port: 3000,
    historyApiFallback: true,
  },
  entry: path.join(__dirname, 'src', 'index.jsx'),
  module: {
    rules: [{
      test: /.(js|jsx)$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      exclude: /node_modules/,
      options: {
        emitWarning: true,
        configFile: './.eslintrc.json',
      },
    }, {
      test: /.(js|jsx)$/,
      exclude: ['/node_modules/', '/build/', '/dist/'],
      use: { loader: 'babel-loader' },
      include: path.join(__dirname, '/src'),
    }, {
      test: /.(css|scss)$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    }, {
      test: /.(jpg|jpeg|png|gif|mp3|svg)$/,
      use: [{
        loader: "file-loader",
        options: {
          name: 'react-app/media/[name]-[hash:8].[ext]',
          publicPath: '',
        },
      }],
    }],
  },
  resolve: {
    modules: [ path.resolve(__dirname, 'src'), 'node_modules' ],
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimize: false,
    splitChunks: { chunks: 'all' },
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'react-app/js/[name].js',
    sourceMapFilename: 'react-app/js/[name].js.map',
    publicPath: 'http://localhost:3000/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: path.join(__dirname, 'dev', 'index.tpl'),
      path: path.join(__dirname, 'dev'),
    }),
    new MiniCssExtractPlugin({
      filename: 'react-app/css/[name].css',
    }),
  ],
};

const PRO_CONFIGURATION = {
  entry: path.join(__dirname, 'src/libs', 'index.jsx'),
  externals: {
    jspdf: {
      commonjs: 'jspdf',
      commonjs2: 'jspdf',
      amd: 'jspdf',
      root: 'jspdf',
    },
    html2canvas: {
      commonjs: 'html2canvas',
      commonjs2: 'html2canvas',
      amd: 'html2canvas',
      root: 'html2canvas',
    },
    'i18n-react': {
      commonjs: 'i18n-react',
      commonjs2: 'i18n-react',
      amd: 'i18n-react',
      root: 'i18n-react',
    },
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    }
  },
  // optimization: {
  //   // flagIncludedChunks: true,
  //   // mergeDuplicateChunks: true,
  //   // minimize: false,
  //   // namedChunks: false,
  //   // namedModules: false,
  //   // noEmitOnErrors: true,
  //   // nodeEnv: 'production',
  //   // occurrenceOrder: true,
  //   // concatenateModules: true,
  //   // removeEmptyChunks: true,
  //   // sideEffects: true,
  //   // splitChunks: { chunks: 'all' },
  //   // usedExports: true,
  // },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "css-loader"
      }, {
        loader: "sass-loader"
      }]
    }, {
      test: /\.jsx?$/,
      include: path.resolve(__dirname, 'src/'),
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: { presets: ['@babel/env'] },
    }],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/'),
    // publicPath: '',
    // libraryExport: 'default',
    libraryTarget: 'commonjs2',
  },
  // plugins: [
  //   new MiniCssExtractPlugin({ filename: 'index.css' }),
  //   // new optimize.ModuleConcatenationPlugin(),
  //   // new HashedModuleIdsPlugin({
  //   //   hashFunction: 'sha256',
  //   //   hashDigest: 'hex',
  //   //   hashDigestLength: 4
  //   // }),
  //   // new optimize.OccurrenceOrderPlugin(),
  //   // new NoEmitOnErrorsPlugin(),
  // ],
  resolve: {
    modules: [ path.resolve(__dirname, 'src'), 'node_modules' ],
    extensions: ['.js', '.jsx'],
  },
};

module.exports = (env) => {
  return env && env.dev
    ? DEV_CONFIGURATION
    : PRO_CONFIGURATION;
};
