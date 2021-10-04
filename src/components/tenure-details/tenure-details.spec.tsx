import React from 'react';
import { screen } from '@testing-library/react';

import { formatDate } from '@mtfh/common/lib/utils';
import {
    render,
    mockAssetV1,
    mockAssetWithInactiveTenureV1,
} from '@hackney/mtfh-test-utils';
import { TenureDetails } from './tenure-details';

describe('TenureDetails', () => {
    it('should display tenure details with active status', () => {
        render(<TenureDetails tenure={mockAssetV1.tenure} />);
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Start date')).toBeInTheDocument();
        expect(
            screen.getByText(formatDate(mockAssetV1.tenure.startOfTenureDate))
        ).toBeInTheDocument();
        expect(screen.getByText('View tenure')).toBeInTheDocument();
    });

    it('should display tenure details with inactive status', () => {
        render(<TenureDetails tenure={mockAssetWithInactiveTenureV1.tenure} />);
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
        expect(screen.getByText('Start date')).toBeInTheDocument();
        expect(
            screen.getByText(
                formatDate(
                    mockAssetWithInactiveTenureV1.tenure.startOfTenureDate
                )
            )
        ).toBeInTheDocument();
        expect(screen.getByText('View tenure')).toBeInTheDocument();
    });

    it('should display tenure details', () => {
        render(<TenureDetails tenure={mockAssetV1.tenure} />);
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Start date')).toBeInTheDocument();
        expect(
            screen.getByText(formatDate(mockAssetV1.tenure.startOfTenureDate))
        ).toBeInTheDocument();
        expect(screen.getByText('View tenure')).toBeInTheDocument();
    });

    it('should display No tenure message when no tenure is available', () => {
        render(<TenureDetails tenure={null} />);
        expect(screen.getByText('No tenure')).toBeInTheDocument();
    });
});
