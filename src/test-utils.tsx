import { SWRConfig } from 'swr';
import { Route, Router } from 'react-router-dom';
import React from 'react';
import MatchMediaMock from 'jest-matchmedia-mock';
import { createMemoryHistory } from 'history';
import { RenderResult, render } from '@testing-library/react';
import { queries } from '@mtfh/common';

let matchMedia: MatchMediaMock;

beforeAll(() => {
    matchMedia = new MatchMediaMock();
});

interface RouteRenderConfig {
    url: string;
    path: string;
    query: keyof typeof queries;
}

export const routeRender = (
    component: JSX.Element,
    options?: Partial<RouteRenderConfig>
): RenderResult => {
    const config: RouteRenderConfig = {
        url: '/tenure/68c6896c-16f1-54d2-3504-847cb438a1b1',
        path: '/tenure/:tenureId',
        query: 'lg',
        ...options,
    };
    matchMedia.useMediaQuery(`(min-width: 0px)`);
    const history = createMemoryHistory();
    history.push(config.url);
    matchMedia.useMediaQuery(queries[config.query]);
    history.push(config.url);
    return render(
        <SWRConfig value={{ dedupingInterval: 0, errorRetryInterval: 0 }}>
            <Router history={history}>
                <Route path={config.path}>{component}</Route>
            </Router>
        </SWRConfig>
    );
};
