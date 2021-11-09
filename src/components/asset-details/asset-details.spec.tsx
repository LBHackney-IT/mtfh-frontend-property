import React from 'react';
import { screen } from '@testing-library/react';

import {
    render,
    mockAssetV1,
    generateMockAssetTenureV1,
} from '@hackney/mtfh-test-utils';
import { AssetDetails } from './asset-details';

const mockActiveAssetTenure = generateMockAssetTenureV1({ isActive: true });

describe('AssetDetails', () => {
    it('should display asset details', () => {
        render(
            <AssetDetails
                assetAddress={mockAssetV1.assetAddress}
                assetType={mockActiveAssetTenure.type}
                assetReference={mockAssetV1.assetId}
            />
        );
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('UPRN')).toBeInTheDocument();
        expect(screen.getByText('Reference')).toBeInTheDocument();
    });
});
