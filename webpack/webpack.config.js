const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Autoprefixer = require('autoprefixer');

module.exports = function (env, argv) {
  const isProduction = argv.mode === 'production';
  const isDevelopment = argv.mode === 'development';

  const entry = [
    './src/ts/main.ts',
    './src/scss/common.scss',
    './src/scss/tracks.scss',
    './src/scss/import.scss',
  ];

  return {
    mode: argv.mode,
    devtool: isProduction ? 'source-map' : 'eval',
    entry,
    watch: isDevelopment,
    watchOptions: {
      aggregateTimeout: 500,
      ignored: path.resolve(__dirname, 'node_modules'),
    },
    output: {
      path: path.resolve(__dirname, '../assets/'),
      filename: 'js/main.js',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          extractComments: false,
          terserOptions: {
            compress: isProduction,
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].css',
                context: './src/css',
                outputPath: './css',
              },
            },
            'extract-loader',
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env', {}]],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
              },
            },
          ],
        },
        {
          test: /\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      ],
    },
    plugins: [
      Autoprefixer,
    ],
    resolve: {
      alias: {
        // '@shared': path.resolve(__dirname, '../shared/'),
        '@': path.resolve(__dirname, 'src/ts/'),
      },
      extensions: ['.ts', '.tsx', '.js', '.scss'],
    },
  };
};