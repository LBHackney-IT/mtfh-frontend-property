import { Link as RouterLink } from 'react-router-dom';
import React from 'react';

import { Button, SummaryList, SummaryListItem } from '@mtfh/common';
import { formattedDate } from '../../utils';
import { locale, Tenure } from '../../services';
import './tenure-details.styles.scss';
interface TenureDetailsProps {
    tenure: Tenure | null;
}

export const TenureDetails = ({ tenure }: TenureDetailsProps): JSX.Element => {
    if (!tenure) {
        return <h4>{locale.tenureDetails.noTenure}</h4>;
    }

    const { id, type, startOfTenureDate, endOfTenureDate, isActive } = tenure;

    return (
        <div className="mtfh-tenure-details">
            <h2>{locale.tenureDetails.tenureLabel}</h2>
            <SummaryList overrides={[2 / 3]}>
                <SummaryListItem title={locale.tenureDetails.type}>
                    {type}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.status}>
                    {locale.tenureDetails.isActive(isActive)}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.startDate}>
                    {formattedDate(startOfTenureDate)}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.endDate}>
                    {formattedDate(endOfTenureDate)}
                </SummaryListItem>
            </SummaryList>
            <Button as={RouterLink} to={`/tenure/${id}`} variant="secondary">
                {locale.tenureDetails.viewTenureButtonLabel}
            </Button>
        </div>
    );
};
