import IndexRoute from './routes/Index';
import PostRoute from './routes/Post';
import {createApp} from 'nuri/index';

let app = createApp();

app.title = (routeTitle) => routeTitle + (routeTitle ? ' - ' : '') + 'HELLO';
app.route('/', IndexRoute);
app.route('/posts/:id', PostRoute);
app.route('/:id', {
    load: ({params, redirect}) => redirect(`/posts/${params.id}`)
});

export default app;
