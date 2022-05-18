import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";

import { AssetTenure } from "@mtfh/common/lib/api/asset/v1";
import { Button, SummaryList, SummaryListItem } from "@mtfh/common/lib/components";
import { formatDate } from "@mtfh/common/lib/utils";

import "./tenure-details.styles.scss";

interface TenureDetailsProps {
  tenure: AssetTenure | null;
}

export const TenureDetails = ({ tenure }: TenureDetailsProps): JSX.Element => {
  if (!tenure) {
    return <h4>{locale.tenureDetails.noTenure}</h4>;
  }

  const { id, type, startOfTenureDate, endOfTenureDate, isActive, paymentReference } =
    tenure;

  return (
    <div className="mtfh-tenure-details">
      <h2>{locale.tenureDetails.tenureLabel}</h2>
      <SummaryList overrides={[2 / 3]}>
        <SummaryListItem title={locale.tenureDetails.type}>{type}</SummaryListItem>
        <SummaryListItem title={locale.tenureDetails.status}>
          {locale.tenureDetails.isActive(isActive)}
        </SummaryListItem>
        <SummaryListItem title={locale.tenureDetails.startDate}>
          {formatDate(startOfTenureDate)}
        </SummaryListItem>
        <SummaryListItem title={locale.tenureDetails.endDate}>
          {formatDate(endOfTenureDate)}
        </SummaryListItem>
        <SummaryListItem title={locale.tenureDetails.paymentRef}>
          {paymentReference}
        </SummaryListItem>
      </SummaryList>
      {id && (
        <Button as={RouterLink} to={`/tenure/${id}`} variant="secondary">
          {locale.tenureDetails.viewTenureButtonLabel}
        </Button>
      )}
    </div>
  );
};
