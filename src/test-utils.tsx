import { SWRConfig } from 'swr';
import { Route, Router } from 'react-router-dom';
import React from 'react';
import { rest } from 'msw';
import MatchMediaMock from 'jest-matchmedia-mock';
import { createMemoryHistory, MemoryHistory } from 'history';
import { cleanup, RenderResult, render, waitFor } from '@testing-library/react';
import { cache, queries } from '@mtfh/common';

import { server } from './mocks';

let matchMedia: MatchMediaMock;

beforeAll(() => {
    server.listen();
    matchMedia = new MatchMediaMock();
});

afterEach(async () => {
    cleanup();
    server.resetHandlers();
    matchMedia.clear();
    await waitFor(() => cache.clear());
});

afterAll(() => {
    server.close();
});

interface RouteRenderConfig {
    url: string;
    path: string;
    query: keyof typeof queries;
}

export const routeRender = (
    component: JSX.Element,
    options?: Partial<RouteRenderConfig>
): [RenderResult, MemoryHistory] => {
    const config: RouteRenderConfig = {
        url: '/assets/68c6896c-16f1-54d2-3504-847cb438a1b1',
        path: '/assets/:propertyId',
        query: 'lg',
        ...options,
    };
    matchMedia.useMediaQuery(`(min-width: 0px)`);
    const history = createMemoryHistory();
    history.push(config.url);
    matchMedia.useMediaQuery(queries[config.query]);
    history.push(config.url);
    return [
        render(
            <SWRConfig value={{ dedupingInterval: 0, errorRetryInterval: 0 }}>
                <Router history={history}>
                    <Route path={config.path}>{component}</Route>
                </Router>
            </SWRConfig>
        ),
        history,
    ];
};

export const get = (path: string, data: unknown, code = 200): void => {
    server.use(
        rest.get(path, (req, res, ctx) => {
            return res(ctx.status(code), ctx.json(data));
        })
    );
};

window.HTMLElement.prototype.scrollIntoView = jest.fn();
