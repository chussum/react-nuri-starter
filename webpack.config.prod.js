console.log('* Production Build');

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.config.base.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = webpackMerge(webpackBaseConfig, {
    devtool: 'cheap-module-source-map',
    output: {
        filename: '[name]-[hash].js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common-[hash].js'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new ExtractTextPlugin('[name]-[contenthash].css'),
    ]
});

module.exports = config;