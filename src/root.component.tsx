import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

import App from './app';

import './root.styles.scss';

export default function Root(): JSX.Element {
    return (
        <Router>
            <App />
        </Router>
    );
}
