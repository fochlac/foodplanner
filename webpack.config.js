/*
    ./webpack.config.js
*/
const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
  // , PreloadWebpackPlugin = require('preload-webpack-plugin'),
  // HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')

module.exports = {
  entry: ['./client/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/static/',
  },
  module: {
    rules: [
      {
        test: /.*(deep-equals|shallow-equals|pikaday).*\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        }),
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'less-loader',
            },
          ],
        }),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        exclude: /static/,
      },
      {
        test: /\.(json|png|ico|xml|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', 'less'],
    alias: {
      COMPONENTS: path.resolve('./client/components'),
      UI: path.resolve('./client/components/ui'),
      PAGES: path.resolve('./client/components/views'),
      UTILS: path.resolve('./client/utils'),
      STORE: path.resolve('./client/store'),
      SW: path.resolve('./node_modules/serviceworker-webpack-plugin/lib'),
    },
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production'),
    // }),
    // new webpack.optimize.UglifyJsPlugin(),
    new webpack.IgnorePlugin(/.*moment.*/),
    new ExtractTextPlugin({
      filename: 'styles.css',
    }),
    new ServiceWorkerWebpackPlugin({
      entry: './client/sw.js',
      filename: 'sw.js',
    }),
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: 'index.html',
      // excludeAssets: [/\.css/],
      inject: 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    // new HtmlWebpackExcludeAssetsPlugin(),
    // new PreloadWebpackPlugin({
    //   rel: 'preload',
    //   include: 'allAssets',
    //   fileWhitelist: [/\.css/],
    // }),
  ],
}
