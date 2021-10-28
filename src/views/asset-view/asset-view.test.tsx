import React from 'react';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { $configuration } from '@mtfh/common/lib/configuration';
import {
    server,
    render,
    mockAssetV1,
    mockAssetLettableNonDwellingV1,
    mockAssetInvalidAssetTypeV1,
} from '@hackney/mtfh-test-utils';

import { locale } from '../../services';
import { AssetView } from '.';

const features = $configuration.getValue();

test('renders the error on Asset failure', async () => {
    server.use(
        rest.get('/api/v1/assets/:id', (req, res, ctx) =>
            res.once(ctx.status(500), ctx.json({ error: 'failed' }))
        )
    );
    render(<AssetView />, {
        url: `/property/${mockAssetV1.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
});

test('renders the property view', async () => {
    const { container } = render(<AssetView />, {
        url: `/property/${mockAssetV1.id}`,
        path: '/property/:assetId',
    });
    expect(container).toMatchSnapshot();

    await waitFor(() =>
        expect(screen.getAllByRole('heading')[0]).toHaveTextContent(
            locale.assetDetails.address(mockAssetV1.assetAddress)
        )
    );
    screen.getByText(locale.assetType(mockAssetV1.assetType));
    screen.getByText(/UPRN/);
    screen.getByText(mockAssetV1.assetId);
    screen.getByText(/Reference/);
});

test('renders the process menu button and contains correct path', async () => {
    $configuration.next({
        MMH: {
            ...features.MMH,
            featureToggles: { ProcessMenuButton: true },
        },
    });
    render(<AssetView />, {
        url: `/property/${mockAssetV1.id}`,
        path: '/property/:assetId',
    });
    await waitFor(() => expect(screen.getByText(locale.static.newProcess)));
    userEvent.click(screen.getByText(locale.static.newProcess));
    expect(window.location.pathname).toContain(
        `/processes/property/21293d9b-e8fd-4bbb-8ef6-93a271edd2d4`
    );
});

test('it shows the back button', async () => {
    render(<AssetView />, {
        url: `/property/${mockAssetV1.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() =>
        expect(screen.getByText('Search results')).toBeInTheDocument()
    );
});

test('it shows add comment button', async () => {
    $configuration.next({
        MMH: {
            ...features.MMH,
            featureToggles: { EnhancedPropertyComments: true },
        },
    });
    render(<AssetView />, {
        url: `/property/${mockAssetV1.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() => screen.getByText(locale.comments.addComment));
});

test('it shows new tenure button', async () => {
    server.use(
        rest.get('/api/v1/assets/:id', (req, res, ctx) =>
            res(
                ctx.status(200),
                ctx.set('ETag', '"1"'),
                ctx.json({ ...mockAssetLettableNonDwellingV1, tenure: {} })
            )
        )
    );
    $configuration.next({
        MMH: { ...features.MMH, featureToggles: { CreateTenure: true } },
    });
    render(<AssetView />, {
        url: `/property/${mockAssetV1.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() => screen.getByText(locale.assetDetails.newTenure));
});

test('renders the asset view for lettable-non-dwelling', async () => {
    server.use(
        rest.get('/api/v1/assets/:id', (req, res, ctx) =>
            res(
                ctx.status(200),
                ctx.set('ETag', '"1"'),
                ctx.json(mockAssetLettableNonDwellingV1)
            )
        )
    );
    render(<AssetView />, {
        url: `/property/${mockAssetLettableNonDwellingV1.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() => screen.getByText(/Lettable non-dwelling/));
});

test('renders the asset view for invalid asset type', async () => {
    server.resetHandlers();
    server.use(
        rest.get('/api/v1/assets/:id', (req, res, ctx) =>
            res(
                ctx.status(200),
                ctx.set('ETag', '"2"'),
                ctx.json(mockAssetInvalidAssetTypeV1)
            )
        )
    );
    render(<AssetView />, {
        url: `/property/${mockAssetInvalidAssetTypeV1.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() => screen.getByText(locale.assetCouldNotBeLoaded));
});
