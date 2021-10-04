import React from 'react';
import { ConfirmationRouter } from '@mtfh/common/lib/components';

import App from './app';

import './root.styles.scss';

export default function Root(): JSX.Element {
    return (
        <ConfirmationRouter>
            <App />
        </ConfirmationRouter>
    );
}
