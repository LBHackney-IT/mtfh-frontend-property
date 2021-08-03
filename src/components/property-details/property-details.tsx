import React from 'react';

import { SummaryList, SummaryListItem } from '@mtfh/common';
import { locale } from '../../services';
import './property-details.styles.scss';
interface PropertyDetailsProps {
    propertyDetails?: any;
}

export const PropertyDetails = ({
    propertyDetails,
}: PropertyDetailsProps): JSX.Element => {
    const { assetAddress, assetType } = propertyDetails;
    return (
        <div className="mtfh-tenure-details">
            <SummaryList overrides={[2 / 3]}>
                <SummaryListItem title={locale.tenureDetails.propertyTypeLabel}>
                    {assetType}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.uprnLabel}>
                    {assetAddress.uprn}
                </SummaryListItem>
                <SummaryListItem
                    title={locale.tenureDetails.propertyReferenceLabel}
                >
                    {propertyDetails.propertyReference}
                </SummaryListItem>
            </SummaryList>
        </div>
    );
};
