console.log('* Development Build');

require('dotenv').config();

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.config.base.js');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = webpackMerge({
    devtool: 'source-map',
    entry: {
        www: [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client',
        ],
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'eslint-loader',
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js'
        }),
        new ExtractTextPlugin('[name].css'),
        new WebpackCleanupPlugin(),
    ],
}, webpackBaseConfig);

module.exports = config;