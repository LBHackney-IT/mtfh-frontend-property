import React from 'react';
import { screen } from '@testing-library/react';

import { TenureDetails } from './tenure-details';
import { routeRender } from '../../test-utils';
import { mockProperty, mockPropertyWithInactiveTenure } from '../../mocks/data';

describe('TenurelDetails', () => {
    it('should display tenure details with active status', () => {
        routeRender(<TenureDetails tenure={mockProperty.tenure} />);
        expect(screen.getByText('Tenure type')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Start date')).toBeInTheDocument();
        expect(screen.getByText('16/09/2004')).toBeInTheDocument();
        expect(screen.getByText('View tenure')).toBeInTheDocument();
    });

    it('should display tenure details with inactive status', () => {
        routeRender(
            <TenureDetails tenure={mockPropertyWithInactiveTenure.tenure} />
        );
        expect(screen.getByText('Tenure type')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
        expect(screen.getByText('Start date')).toBeInTheDocument();
        expect(screen.getByText('16/09/2004')).toBeInTheDocument();
        expect(screen.getByText('View tenure')).toBeInTheDocument();
    });

    it('should display tenure details', () => {
        routeRender(<TenureDetails tenure={mockProperty.tenure} />);
        expect(screen.getByText('Tenure type')).toBeInTheDocument();
        expect(screen.getByText('Start date')).toBeInTheDocument();
        expect(screen.getByText('16/09/2004')).toBeInTheDocument();
        expect(screen.getByText('View tenure')).toBeInTheDocument();
    });

    it('should display No tenure message when no tenure is available', () => {
        routeRender(<TenureDetails tenure={null} />);
        expect(screen.getByText('No tenure')).toBeInTheDocument();
    });
});
