var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var isProduction = (process.env.NODE_ENV == 'production');
var config = {
    context: __dirname + '/src',
    entry: {
        www: [
            'babel-polyfill',
            './www.react.js'
        ]
    },
    plugins: [
        new AssetsPlugin({filename: 'src/assets.json'}),
    ],
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            sourceMap: !isProduction
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !isProduction
                        }
                    }, {
                        loader: 'less-loader',
                        options: {
                            sourceMap: !isProduction
                        }
                    }]
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: !isProduction
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !isProduction
                        }
                    }]
                })
            },
            {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'url-loader',
                options: {
                    name: 'assets/[hash].[ext]',
                    limit: 10000
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/assets/',
        filename: '[name].js'
    }
};

module.exports = config;