/*
    ./webpack.config.js
*/
const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      ExtractTextPlugin = require("extract-text-webpack-plugin"),
      ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin"),
      GoogleFontsPlugin = require("google-fonts-webpack-plugin");

module.exports = {
    entry: [
        './client/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/static/'
    },
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
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            }
                        }, {
                            loader: 'postcss-loader'
                        }
                    ]
                })
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }, {
                        loader: 'postcss-loader'
                    }]
                })
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
            SW:         path.resolve('./node_modules/serviceworker-webpack-plugin/lib'),
            ACTIONS$:   path.resolve('./client/components/actions.js')
        }
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "styles.css"
        }),
        new ServiceWorkerWebpackPlugin({
            entry: './client/sw.js',
            filename: 'sw.js'
        }),
        new HtmlWebpackPlugin({
            template: './client/index.html',
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new GoogleFontsPlugin({
            fonts: [
                { family: "Raleway", variants: [ "400", "600"] }
            ]
        })
    ]
}
