import { Link as RouterLink } from 'react-router-dom';
import React from 'react';

import { Button, SummaryList, SummaryListItem } from '@mtfh/common';
import { formatISO } from '../../utils';
import { locale, Tenure } from '../../services';
import './tenure-details.styles.scss';
interface TenureDetailsProps {
    tenure: Tenure;
}

export const TenureDetails = ({ tenure }: TenureDetailsProps): JSX.Element => {
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
                    {formatISO(startOfTenureDate)}
                </SummaryListItem>
                <SummaryListItem title={locale.tenureDetails.endDate}>
                    {formatISO(endOfTenureDate)}
                </SummaryListItem>
            </SummaryList>
            <Button as={RouterLink} to={`/tenure/${id}`} variant="secondary">
                {locale.tenureDetails.viewTenureButtonLabel}
            </Button>
        </div>
    );
};
