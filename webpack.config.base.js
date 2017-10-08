var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DotEnv = require('dotenv-webpack');
var isProduction = (process.env.NODE_ENV == 'production');
var config = {
    context: __dirname + '/src',
    entry: {
        www: [
            './www.react.js',
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/assets/',
    },
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
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    regExp: '\\b_/(.+)',
                    name: '[1]?v=[hash]',
                    limit: 10000
                }
            },
        ]
    },
    plugins: [
        new AssetsPlugin({filename: 'src/assets.json'}),
        new DotEnv(),
    ],
};

module.exports = config;