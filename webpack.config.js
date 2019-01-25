const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: {
    main: './src/index.js',
    example: './example/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].js?[hash]',
  },
  resolve: {
    extensions: [
      '.css',
      '.js',
      '.vue',
      '.ts',
    ],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
        ],
        options: {
          presets: [
            ["@babel/preset-env"]
          ]
        }
      },

      {
        test: /\.css$/,
        use: [
          {loader: 'vue-style-loader'},
          {loader: 'css-loader'},
        ],
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: 'example/index.html',
      chunks: ['example'],
      filename: 'example.html'
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/'),
    disableHostCheck: true,
    historyApiFallback: true,
  },
};

module.exports = config;
