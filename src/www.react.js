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
    module.hot.accept('./routes', () => {
        const newRoutes = require('./routes').default;
        window.startApp(window.preloadData, newRoutes);
    });
}
