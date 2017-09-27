import dotenv from 'dotenv';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import favicon from 'serve-favicon';
import {injectLoaderFactory, render} from 'nuri/server';
import request from 'request';
import Promise from 'bluebird';
import routes from '../routes';
import forEach from 'lodash/forEach'

dotenv.config();
injectLoaderFactory(serverRequest => {
    serverRequest.loaderCalls = [];

    return {
        call(path, params) {
            return new Promise((resolve, reject) => {
                request({
                    baseUrl: 'http://127.0.0.1:9000',
                    url: path,
                    forever: true,
                    qs: params,
                }, (err, response, body) => {
                    if (!err) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(err);
                    }
                });
            });
        }
    };
});

const isDev = (process.env.NODE_ENV !== 'production');
const server = express();
const HttpNotFound = {};
const {WEBSITE_DESCRIPTION, WEBSITE_KEYWORDS, WEBSITE_OG_IMAGE} = process.env;

if (isDev) {
    const config = require('../../webpack.config.dev');
    const compiler = require('webpack')(config);
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');

    server.use(devMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
    server.use(hotMiddleware(compiler, {
        // eslint-disable-next-line
        log: console.log,
    }));
}

let assetFilenames;
let stylesheets = [];
let scripts = [];
let sendResponse = (res, { preloadData, meta, title, errorStatus, redirectURI, element }) => {
    if (errorStatus === 404) {
        throw HttpNotFound;
    }
    if (redirectURI) {
        res.redirect(redirectURI);
    }
    if (errorStatus) {
        res.status(errorStatus);
    }
    if (element) {
        res.render(path.resolve(__dirname, '..', 'index.pug'), {
            title: title,
            html: !isDev && ReactDOMServer.renderToString(element),
            preloadData: JSON.stringify(preloadData),
            stylesheets: stylesheets,
            scripts: scripts,
            description: meta.description || WEBSITE_DESCRIPTION,
            keywords: meta.keywords || WEBSITE_KEYWORDS,
            ogImage: meta.ogImage || WEBSITE_OG_IMAGE,
        });
    } else {
        throw HttpNotFound;
    }
};

server.locals.pretty= true;
server.use(favicon(path.join(__dirname, '..', '_', 'favicon', 'favicon.ico')));
server.use('/img', express.static(path.join(__dirname, '..', '_', 'img')));
server.use('/fonts', express.static(path.join(__dirname, '..', '_', 'fonts')));
server.use('/assets', express.static(path.join(__dirname, '..', '..', 'build')));

server.get('/api/posts', (req, res) => {
    const posts = [];
    for (var i = 1; i < 100; i++) {
        posts.push({
            id: i,
            title: 'Post #' + i,
        });
    }
    res.send(posts).end();
});
server.get('/api/posts/:id', (req, res) => {
    res.send(
        {id: 2, title: 'This is ReSP'}
    ).end();
});

server.get('*', (req, res, next) => {
    if (!assetFilenames) {
        assetFilenames = require('../assets.json');
        forEach(assetFilenames, (entry) => {
            entry['css'] && stylesheets.splice(0, 0, entry['css']);
            entry['js'] && scripts.splice(0, 0, entry['js']);
        });
        stylesheets.splice(0, 0, '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    }
    render(routes, req)
        .then(result => {
            sendResponse(res, result);
        })
        .catch(err => {
            if (err === HttpNotFound) {
                next();
                return;
            }
            if (!(err instanceof Error)) {
                err = new Error(err);
            }
            next(err)
        });
});

module.exports = server;
