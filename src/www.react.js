import 'isomorphic-fetch';
import {injectLoader, render} from 'nuri/client';
import app from './routes';

function loader(path) {
    return fetch(path).then(r => r.json());
}

injectLoader(loader);

window.startApp = (preloadData, routes) => {
    const controller = render(routes || app, document.getElementById('app'), preloadData);
    controller.subscribe({
        willLoad() {
            // eslint-disable-next-line
            console.log('willLoad');
        },
        didLoad() {
            // eslint-disable-next-line
            console.log('didLoad');
        },
        didAbortLoad() {
            // eslint-disable-next-line
            console.log('abort');
        },
        didCommitState() {
        },
    });
};

if (module.hot) {
    // eslint-disable-next-line
    let _log = console.log;

    // eslint-disable-next-line
    console.log = function (message) {
        if (~message.indexOf('App is up to date.')) {
            const links = document.getElementsByTagName("link");
            for (let link of links) {
                if (~link.getAttribute('rel').indexOf('stylesheet')) {
                    // eslint-disable-next-line
                    console.log('[HMR] Reloading CSS.');

                    let linkHref = link.href;
                    link.href = 'about:blank';
                    link.href = linkHref;
                }
            }
        }
        return _log.apply(console, arguments);
    };

    module.hot.accept('./routes', () => {
        const newRoutes = require('./routes').default;
        window.startApp(window.preloadData, newRoutes);
    });
}
