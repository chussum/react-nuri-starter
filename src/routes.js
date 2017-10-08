import IndexRoute from './routes/Index';
import DramaRoute from './routes/Drama';
import {createApp} from 'nuri/index';

const app = createApp();
const defaultTitle = process.env.WEBSITE_TITLE;

app.title = (routeTitle) => routeTitle + (routeTitle ? ' - ' : '') + defaultTitle;
app.route('/', IndexRoute);
app.route('/drama/:id', DramaRoute);
app.route('/:id', {
    load: ({params, redirect}) => redirect(`/drama/${params.id}`)
});

export default app;
