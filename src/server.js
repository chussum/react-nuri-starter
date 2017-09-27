if (!global._babelPolyfill) {
    require('babel-polyfill');
}

require('dotenv').config();
require('asset-require-hook')({
    extensions: ['ico', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'eot', 'woff', 'woff2'],
    regExp: '\\b_/(.+)',
    name: '[1]?v=[hash]',
    limit: 10000
});
require('css-modules-require-hook')({
    extensions: '.less',
    generateScopedName: '[name]_[local]_[hash:base64:5]',
    mode: 'global',
    rootDir: __dirname,
    processorOpts: {
        parser: require('postcss-less').parse
    }
});

const app = require('./server/app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    // eslint-disable-next-line
    console.log('Server running at port', port);
});
