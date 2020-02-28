const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { optimize, DefinePlugin, HashedModuleIdsPlugin, NoEmitOnErrorsPlugin } = require('webpack');

const getDevPlugins = (env) => {
  return env && env.dev
    ? [
      new HtmlWebpackPlugin({
        hash: true,
        template: path.join(__dirname, 'dev', 'index.tpl'),
        path: path.join(__dirname, 'dev'),
      }),
      new DefinePlugin({
        'process.env': {
          WEBAPP_API_URL: env && env.dev && '"http://localhost:3000"',
        }
      }),
    ]
    : [ ];
};

const getProdPlugins = (env) => {
  return env && env.dev
    ? [ ]
    : [
      new optimize.ModuleConcatenationPlugin(),
      new HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 4
      }),
      new optimize.OccurrenceOrderPlugin(),
      new NoEmitOnErrorsPlugin(),
    ];
}

const getOptimization = (env) => {
  const general = {
    splitChunks: {
      chunks: 'all',
    },
  };
  return env && env.dev
    ? {
      optimization: {
        ...general,
        minimize: false,
      },
    }
    : {

      optimization: {
        ...general,
        namedModules: false,
        namedChunks: false,
        nodeEnv: 'production',
        flagIncludedChunks: true,
        occurrenceOrder: true,
        sideEffects: true,
        usedExports: true,
        concatenateModules: true,
        noEmitOnErrors: true,
        minimize: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
      },
    };
}

module.exports = (env) => {
  return {
    devtool: env && env.dev && 'source-map',
    devServer: {
      contentBase: ['/dev'],
      port: 3000,
      historyApiFallback: true,
    },
    entry: path.join(__dirname, 'src', 'index.jsx'),
    module: {
      rules: [
        {
          test: /.(js|jsx)$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            emitWarning: true,
            configFile: './.eslintrc.json'
          }
        },
        {
          test: /.(js|jsx)$/,
          exclude: ['/node_modules/', '/build/'],
          use: { loader: 'babel-loader' },
          include: path.join(__dirname, '/src'),
        },
        {
          test: /.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                data: `$env: ${env && env.dev ? '"development"' : '"production"'};`,
              }
            }
          ]
        },
        {
          test: /.(jpg|jpeg|png|gif|mp3|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: 'react-app/media/[name]-[hash:8].[ext]',
                publicPath: env && env.dev
                  ? ''
                  : '/static/',
              }
            }
          ]
        }
      ]
    },
    ...getOptimization(env),
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'react-app/js/[name].js',
      sourceMapFilename: 'react-app/js/[name].js.map',
      publicPath: env && env.dev ? 'http://localhost:3000/' : undefined,
    },
    plugins: [
      ...getDevPlugins(env),
      new MiniCssExtractPlugin({
        filename: 'react-app/css/[name].css',
      }),
      ...getProdPlugins(env),
      new BundleTracker({ path: __dirname, filename: 'webpack-stats.json' }),
      new DefinePlugin({ RELEASE_VERSION: JSON.stringify(process.env.npm_package_version) }),
    ],
    resolve: {
      modules: [ path.resolve(__dirname, 'src'), 'node_modules' ],
      alias: {
        components: path.resolve(__dirname, 'src/components/'),
        containers: path.resolve(__dirname, 'src/containers/'),
        controllers: path.resolve(__dirname, 'src/controllers/'),
        models: path.resolve(__dirname, 'src/models/'),
        modules: path.resolve(__dirname, 'src/modules/'),
      },
      extensions: ['.js', '.jsx']
    },
  };
};
