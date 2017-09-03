import React from 'react';

export function App(Component) {
    return (props) => <div>
        <Component {...props} />
    </div>;
}