import $ from 'jquery';
import React from 'react';
import {Link} from 'nuri';
import greatPath from '_/img/great.jpg';
import '_/less/index.less';

class Index extends React.Component {
    componentDidMount() {
        // Show less posts initially in mobile
        if ($(window).width() <= 480) {
            this.props.writeData(data => {
                data.posts = data.posts.slice(0, 3);
            });
        }
    }

    render() {
        return <div>
            <img src={greatPath} />
            <ul>
                {this.props.data.posts.map(post =>
                    <li key={post.id}>
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </li>
                )}
            </ul>
            <button onClick={this._addItem.bind(this)}>Add Item</button>
        </div>;
    }

    _addItem() {
        this.props.writeData(data => {
            data.posts.push({
                id: Date.now(),
                title: `Post #${data.posts.length + 1}`
            });
        });
    }
}

export default {
    component: Index,
    load({ loader }) {
        return loader.call('/api/posts').then(posts => ({ posts }));
    }
};
