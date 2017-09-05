var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = {
    context: __dirname + '/src',
    entry: {
        www: [
            'console-polyfill',
            'es6-promise',
            'fetch-ie8',
            'babel-polyfill',
            './www.react.js'
        ]
    },
    plugins: [
        new AssetsPlugin({filename: 'src/assets.json'}),
    ],
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?localIdentName=[name]_[local]_[hash:base64:5]!postcss-loader!less-loader')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
            },
            {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'url-loader',
                query: {
                    name: 'assets/[hash].[ext]',
                    limit: 10000
                }
            }
        ],
        preLoaders: [],
        postLoaders: [
            {
                test: /\.js[x]?$/,
                loaders: ['es3ify-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/assets/',
        filename: '[name].js'
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};

if (process.env.NODE_ENV == 'production') {
    console.log('* Production Build');

    var definePlugin = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    });

    var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: false, // React doesn't support IE8
            warnings: false
        },
        mangle: false,
        output: {
            comments: false,
            screw_ie8: false
        }
    });
    config.plugins = [
        definePlugin,
        uglifyPlugin,
        new ExtractTextPlugin('[name]-[contenthash].css')
    ].concat(config.plugins);

    config.devtool = 'source-map';
    config.output.filename = '[name]-[hash].js';
} else {
    console.log('* Development Build');

    config.plugins = [
        new ExtractTextPlugin('[name].css')
    ].concat(config.plugins);
    config.devtool = 'cheap-source-map';
    config.module.preLoaders.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
    });
}

module.exports = config;