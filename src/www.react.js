import {injectLoader, render} from 'nuri/client';
import $ from 'jquery';
import app from './routes';
import NProgress from 'nprogress';
import './_/less/nprogress.less';

injectLoader({
    call(path, params) {
        return $.get(path, params);
    }
});

window.startApp = (preloadData, routes) => {
    NProgress.configure({
        trickleRate: 0.4,
        trickleSpeed: 600,
        easing: 'ease',
    });

    const controller = render(routes || app, document.getElementById('app'), preloadData);
    controller.subscribe({
        willLoad() {
            NProgress.start();
        },
        didLoad() {
            NProgress.done();
        },
        didAbortLoad() {
            NProgress.done();
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
        if (typeof message === 'string' && ~message.indexOf('App is up to date.')) {
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
