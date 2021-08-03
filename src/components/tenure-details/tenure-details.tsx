import { Link as RouterLink } from 'react-router-dom';
import React from 'react';

import { Button, SummaryList, SummaryListItem } from '@mtfh/common';
import { formatISO } from '../../utils';
import { locale } from '../../services';
import './tenure-details.styles.scss';
interface TenureDetailsProps {
    tenure?: any;
    isAdditionalTenures?: boolean;
}

export const TenureDetails = ({
    tenure,
    isAdditionalTenures,
}: TenureDetailsProps): JSX.Element => {
    return (
        <div className="mtfh-tenure-details">
            {isAdditionalTenures ? (
                <SummaryList overrides={[2 / 3]}>
                    <SummaryListItem
                        title={locale.tenureDetails.propertyTypeLabel}
                    >
                        {tenure.assetFullAddress}
                    </SummaryListItem>
                </SummaryList>
            ) : (
                <h2 className="lbh-heading-h2">{tenure.assetFullAddress}</h2>
            )}
            <h2>{locale.tenureDetails.tenureLabel}</h2>
            <SummaryList overrides={[2 / 3]}>
                <SummaryListItem title={locale.tenureDetails.type}>
                    {tenure.type}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.status}>
                    {locale.tenureDetails.isActive(tenure.isActive)}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.startDate}>
                    {formatISO(tenure.startDate)}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.endDate}>
                    {formatISO(tenure.endDate)}
                </SummaryListItem>
            </SummaryList>
            <Button
                as={RouterLink}
                to={`/tenure/${tenure.id}`}
                variant="secondary"
            >
                {locale.tenureDetails.viewTenureButtonLabel}
            </Button>
        </div>
    );
};
