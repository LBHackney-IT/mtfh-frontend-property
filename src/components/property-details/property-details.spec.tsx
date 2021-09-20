import React from 'react';
import { screen } from '@testing-library/react';

import { PropertyDetails } from './property-details';
import { routeRender } from '../../test-utils';
import { mockProperty } from '../../mocks/data';

describe('PropertyDetails', () => {
    it('should display property details', () => {
        routeRender(
            <PropertyDetails
                assetAddress={mockProperty.assetAddress}
                assetType={mockProperty.tenure.type}
                propertyReference={mockProperty.assetId}
            />
        );
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('UPRN')).toBeInTheDocument();
        expect(screen.getByText('Reference')).toBeInTheDocument();
    });
});
