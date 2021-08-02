import React from 'react';
import { screen } from '@testing-library/react';
import { routeRender } from './test-utils';
import App from './app';

test('it shows invalid if no id in url', () => {
    routeRender(<App />, { url: '/', path: '/' });
    expect(screen.getByText('404')).toBeInTheDocument();
});

test('it renders property view', async () => {
    routeRender(<App />, {
        url: '/property/123',
        path: '/property/:propertyId',
    });

    expect(screen.getByTestId('property')).toBeInTheDocument();
    expect(screen.getByText('Property view placeholder')).toBeInTheDocument();
});
