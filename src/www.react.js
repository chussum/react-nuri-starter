import 'isomorphic-fetch';
import {injectLoader, render} from 'nuri/client';
import app from './routes';

function loader(path) {
    return fetch(path).then(r => r.json());
}

injectLoader(loader);

const controller = render(app, document.getElementById('app'), window.preloadData);
controller.subscribe({
    willLoad() {
        // console.log('willLoad');
    },
    didLoad() {
        // console.log('didLoad');
    },
    didAbortLoad() {
        // console.log('abort');
    },
    didCommitState() {
    },
});
