import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import { featureToggleStore } from '@mtfh/common';
import { PropertyView } from '../property-view';
import { routeRender, get } from '../../test-utils';
import { locale } from '../../services';
import { mockProperty } from '../../mocks/data';

test('renders the error on Property failure', async () => {
    get(`/api/assets/:id`, { message: 'failure' }, 500);
    routeRender(<PropertyView />, { url: `/assets/${mockProperty.id}` });

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
});

test('renders the property view', async () => {
    const [{ container }] = routeRender(<PropertyView />);
    expect(container).toMatchSnapshot();

    await waitFor(() =>
        expect(screen.getAllByRole('heading')[0]).toHaveTextContent(
            locale.propertyDetails.address(mockProperty.assetAddress)
        )
    );
    expect(screen.queryByText(/Property type/)).toBeInTheDocument();
    expect(screen.queryByText(/Dwelling/)).toBeInTheDocument();

    expect(screen.queryByText(/UPRN/)).toBeInTheDocument();
    expect(screen.queryByText(/100021065786/)).toBeInTheDocument();

    expect(screen.queryByText(/Property reference/)).toBeInTheDocument();
});

test('it shows the back button', async () => {
    routeRender(<PropertyView />);

    await waitFor(() =>
        expect(screen.getByText('Search results')).toBeInTheDocument()
    );
});

test('it shows new tenure button', async () => {
    const features = featureToggleStore.getValue();
    featureToggleStore.next({ MMH: { ...features.MMH, CreateTenure: true } });
    routeRender(<PropertyView />);

    await waitFor(() =>
        expect(
            screen.getByText(locale.propertyDetails.newTenure)
        ).toBeInTheDocument()
    );
});
