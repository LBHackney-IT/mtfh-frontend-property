import React from 'react';
import { rest } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import { featureToggleStore } from '@mtfh/common/lib/configuration';
import {
    server,
    render,
    mockAsset,
    mockAssetLettableNonDwelling,
    mockAssetInvalidAssetType,
} from '@hackney/mtfh-test-utils';

import { locale } from '../../services';
import { AssetView } from '.';

test('renders the error on Asset failure', async () => {
    server.use(
        rest.get('/api/v1/assets/:id', (req, res, ctx) =>
            res.once(ctx.status(500), ctx.json({ error: 'failed' }))
        )
    );
    render(<AssetView />, {
        url: `/property/${mockAsset.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
});

test('renders the property view', async () => {
    const { container } = render(<AssetView />, {
        url: `/property/${mockAsset.id}`,
        path: '/property/:assetId',
    });
    expect(container).toMatchSnapshot();

    await waitFor(() =>
        expect(screen.getAllByRole('heading')[0]).toHaveTextContent(
            locale.assetDetails.address(mockAsset.assetAddress)
        )
    );
    screen.getByText(locale.assetType(mockAsset.assetType));
    screen.getByText(/UPRN/);
    screen.getByText(mockAsset.assetId);
    screen.getByText(/Reference/);
});

test('it shows the back button', async () => {
    render(<AssetView />, {
        url: `/property/${mockAsset.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() =>
        expect(screen.getByText('Search results')).toBeInTheDocument()
    );
});

test('it shows new tenure button', async () => {
    server.use(
        rest.get('/api/v1/assets/:id', (req, res, ctx) =>
            res(
                ctx.status(200),
                ctx.set('ETag', '"1"'),
                ctx.json({ ...mockAssetLettableNonDwelling, tenure: {} })
            )
        )
    );
    const features = featureToggleStore.getValue();
    featureToggleStore.next({ MMH: { ...features.MMH, CreateTenure: true } });
    render(<AssetView />, {
        url: `/property/${mockAsset.id}`,
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
                ctx.json(mockAssetLettableNonDwelling)
            )
        )
    );
    render(<AssetView />, {
        url: `/property/${mockAssetLettableNonDwelling.id}`,
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
                ctx.json(mockAssetInvalidAssetType)
            )
        )
    );
    render(<AssetView />, {
        url: `/property/${mockAssetInvalidAssetType.id}`,
        path: '/property/:assetId',
    });

    await waitFor(() => screen.getByText(locale.assetCouldNotBeLoaded));
});
