var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
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

if (isProduction) {
    console.log('* Production Build');

    var definePlugin = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    });

    var uglifyPlugin = new webpack.optimize.UglifyJsPlugin();
    var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common-[hash].js' });
    var loaderPlugin = new webpack.LoaderOptionsPlugin({
        minimize: true,
    });
    config.plugins = [
        definePlugin,
        uglifyPlugin,
        commonsPlugin,
        loaderPlugin,
        new ExtractTextPlugin('[name]-[contenthash].css'),
    ].concat(config.plugins);

    config.devtool = 'cheap-module-source-map';
    config.output.filename = '[name]-[hash].js';
} else {
    console.log('* Development Build');

    var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common.js' });

    config.plugins = [
        commonsPlugin,
        new ExtractTextPlugin('[name].css'),
        new WebpackCleanupPlugin()
    ].concat(config.plugins);
    config.devtool = 'source-map';
    config.module.rules.push({
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader'
    });
}

module.exports = config;