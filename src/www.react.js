import {injectLoader, render} from 'nuri/client';
import app from './routes';
import $ from 'jquery';

function loader(path) {
    return $.get('http://127.0.0.1:9000' + path);
}

injectLoader(loader);

const controller = render(app, document.getElementById('app'), window.preloadData);
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
