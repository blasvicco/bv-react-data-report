const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
  module: {
    rules: [{
      test: /.(css|scss)$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    }, {
      test: /.(js|jsx)$/,
      exclude: ['/node_modules/', '/build/', '/dist/'],
      include: path.resolve(__dirname, 'src/'),
      loader: 'babel-loader',
    }],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'index.css' }),
  ],
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
