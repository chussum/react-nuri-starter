import React from 'react';

class Post extends React.Component {
    render() {
        return <div>
            <h1>{this.props.data.title}</h1>
        </div>;
    }
}

export default {
    component: Post,
    renderTitle: (data) => data.title,
    load({ params, loader }) {
        return loader.call(`/api/posts/${params.id}`);
    }
};
