import React from 'react';
import { screen } from '@testing-library/react';

import { render, mockAsset } from '@hackney/mtfh-test-utils';
import { AssetDetails } from './asset-details';

describe('AssetDetails', () => {
    it('should display asset details', () => {
        render(
            <AssetDetails
                assetAddress={mockAsset.assetAddress}
                assetType={mockAsset.tenure.type}
                assetReference={mockAsset.assetId}
            />
        );
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('UPRN')).toBeInTheDocument();
        expect(screen.getByText('Reference')).toBeInTheDocument();
    });
});
