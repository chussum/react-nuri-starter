import request from 'request';
import Promise from 'bluebird';
import dotenv from 'dotenv';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import favicon from 'serve-favicon';
import {injectLoaderFactory, render} from 'nuri/server';
import routes from '../routes';
import assetFilenames from '../assets.json';

dotenv.config();
injectLoaderFactory(serverRequest => {
    serverRequest.loaderCalls = [];
    // TODO: pass cookies/etc.
    return function loader(path, params) {
        return new Promise((resolve, reject) => {
            request({
                baseUrl: 'http://127.0.0.1:9000',
                url: path,
                qs: params,
            }, (err, response, body) => {
                if (!err) {
                    resolve(JSON.parse(body));
                } else {
                    reject(err);
                }
            });
        });
    };
});

const server = express();
const HttpNotFound = {};
const {WEBSITE_DESCRIPTION, WEBSITE_KEYWORDS, WEBSITE_OG_IMAGE} = process.env;

function sendResponse(res, { preloadData, meta, title, errorStatus, redirectURI, element }) {
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
            html: ReactDOMServer.renderToString(element),
            preloadData: JSON.stringify(preloadData),
            stylesheets: [
                assetFilenames.www.css,
            ],
            scripts: [
                // assetFilenames.common.js,
                assetFilenames.www.js,
            ],
            description: meta.description || WEBSITE_DESCRIPTION,
            keywords: meta.keywords || WEBSITE_KEYWORDS,
            ogImage: meta.ogImage || WEBSITE_OG_IMAGE,
        });
    } else {
        throw HttpNotFound;
    }
}

server.locals.pretty= true;
server.use(favicon(path.join(__dirname, '..', '_', 'favicon', 'favicon.ico')));
server.use('/assets', express.static(path.join(__dirname, '..', '..', 'build')));
server.get('/api/posts', (req, res) => {
    const posts = [];
    for (var i = 1; i < 100; i++) {
        posts.push({id: i, title: 'Post #' + i});
    }
    res.send(posts).end();
});

server.get('/api/posts/:id', (req, res) => {
    res.send(
        {id: 2, title: 'This is ReSP'}
    ).end();
});

server.get('*', (req, res, next) => {
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