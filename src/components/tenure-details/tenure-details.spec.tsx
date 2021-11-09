import React from 'react';
import { screen } from '@testing-library/react';

import { formatDate } from '@mtfh/common/lib/utils';
import { render, generateMockAssetTenureV1 } from '@hackney/mtfh-test-utils';
import { TenureDetails } from './tenure-details';

const mockActiveAssetTenure = generateMockAssetTenureV1({ isActive: true });
const mockInactiveAssetTenure = generateMockAssetTenureV1({ isActive: false });

describe('TenureDetails', () => {
    it('should display tenure details with active status', () => {
        render(<TenureDetails tenure={mockActiveAssetTenure} />);
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Start date')).toBeInTheDocument();
        expect(
            screen.getByText(
                formatDate(mockActiveAssetTenure.startOfTenureDate)
            )
        ).toBeInTheDocument();
        expect(screen.getByText('View tenure')).toBeInTheDocument();
    });

    it('should display tenure details with inactive status', () => {
        render(<TenureDetails tenure={mockInactiveAssetTenure} />);
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
        expect(screen.getByText('Start date')).toBeInTheDocument();
        expect(
            screen.getByText(
                formatDate(mockInactiveAssetTenure.startOfTenureDate)
            )
        ).toBeInTheDocument();
        expect(screen.getByText('View tenure')).toBeInTheDocument();
    });

    it('should display No tenure message when no tenure is available', () => {
        render(<TenureDetails tenure={null} />);
        expect(screen.getByText('No tenure')).toBeInTheDocument();
    });
});
