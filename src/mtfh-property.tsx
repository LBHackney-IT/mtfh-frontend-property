import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import React from 'react';
import Root from './root.component';

const lifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Root,
    errorBoundary(error, info, properties) {
        // TODO: Log this error.
        console.error(error);
        console.error(info);
        console.error(properties);

        return (
            <h1>Something has gone wrong loading the property application.</h1>
        );
    },
});

export const { bootstrap, mount, unmount } = lifecycles;
