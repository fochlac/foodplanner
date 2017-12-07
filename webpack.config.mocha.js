/*
    ./webpack.config.js
*/
const path = require('path'),
      nodeExternals = require('webpack-node-externals'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        './client/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'test_dist'),
        filename: 'index_bundle.js',
        publicPath: '/static/'
    },
    target: 'node',
    externals: [nodeExternals({
        whitelist: [
            /.*(shallow-equals).*/,
            /.*(deep-equals).*/
        ]
    })],
    module: {
        loaders: [
            {
                test: /.*(deep-equals|shallow-equals).*\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'null-loader'
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: 'null-loader'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
                exclude: /static/
            },
            {
                test: /\.(json|png|ico|xml|svg)$/,
                loader: "file-loader",
                options: {
                    name: '[name].[ext]'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', 'less'],
        alias: {
            COMPONENTS: path.resolve('./client/components'),
            UI:         path.resolve('./client/components/ui'),
            SCRIPTS:    path.resolve('./client/components/scripts'),
            PAGES:      path.resolve('./client/components/pages'),
            ROOT:       path.resolve('./client/components/root'),
            ACTIONS$:   path.resolve('./client/components/actions.js')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html',
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        })
    ]
}
