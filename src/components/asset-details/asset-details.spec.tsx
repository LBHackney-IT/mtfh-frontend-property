import React from 'react';
import { screen } from '@testing-library/react';

import { render, mockAssetV1 } from '@hackney/mtfh-test-utils';
import { AssetDetails } from './asset-details';

describe('AssetDetails', () => {
    it('should display asset details', () => {
        if (!mockAssetV1.tenure)
            throw new Error('Add a tenure to the asset for tests!');

        render(
            <AssetDetails
                assetAddress={mockAssetV1.assetAddress}
                assetType={mockAssetV1.tenure.type}
                assetReference={mockAssetV1.assetId}
            />
        );
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('UPRN')).toBeInTheDocument();
        expect(screen.getByText('Reference')).toBeInTheDocument();
    });
});
