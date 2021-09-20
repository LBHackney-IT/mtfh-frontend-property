import React from 'react';

import { SummaryList, SummaryListItem } from '@mtfh/common';
import { locale } from '../../services';
import './property-details.styles.scss';
interface PropertyDetailsProps {
    assetAddress: any;
    assetType: string;
    propertyReference: string | null;
}

export const PropertyDetails = ({
    assetAddress,
    assetType,
    propertyReference,
}: PropertyDetailsProps): JSX.Element => {
    return (
        <div className="mtfh-tenure-details">
            <SummaryList overrides={[2 / 3]}>
                <SummaryListItem title={locale.tenureDetails.propertyTypeLabel}>
                    {locale.propertyType(assetType)}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.uprnLabel}>
                    {assetAddress.uprn}
                </SummaryListItem>
                {propertyReference ? (
                    <SummaryListItem
                        title={locale.tenureDetails.propertyReferenceLabel}
                    >
                        {propertyReference}
                    </SummaryListItem>
                ) : null}
            </SummaryList>
        </div>
    );
};
