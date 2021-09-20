import React from 'react';
import { screen } from '@testing-library/react';

import { PropertyDetails } from './property-details';
import { routeRender } from '../../test-utils';
import { mockProperty } from '../../mocks/data';

describe('PropertyDetails', () => {
    it('should display tenure details with a property reference', () => {
        routeRender(
            <PropertyDetails
                assetAddress={mockProperty.assetAddress}
                assetType={mockProperty.tenure.type}
                propertyReference="PaymentRef123"
            />
        );
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('UPRN')).toBeInTheDocument();
        expect(screen.getByText('Reference')).toBeInTheDocument();
    });

    it('should display tenure details without a property reference', () => {
        routeRender(
            <PropertyDetails
                assetAddress={mockProperty.assetAddress}
                assetType={mockProperty.tenure.type}
                propertyReference={null}
            />
        );
        expect(screen.getByText('SECURE')).toBeInTheDocument();
        expect(screen.getByText('100021065786')).toBeInTheDocument();
        expect(screen.queryByText('Reference')).not.toBeInTheDocument();
    });
});
