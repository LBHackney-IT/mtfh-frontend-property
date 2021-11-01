import React from "react";

import { locale } from "../../services";

import { SummaryList, SummaryListItem } from "@mtfh/common/lib/components";
import "./asset-details.styles.scss";
interface AssetDetailsProps {
  assetAddress: any;
  assetType: string;
  assetReference: string;
}

export const AssetDetails = ({
  assetAddress,
  assetType,
  assetReference,
}: AssetDetailsProps): JSX.Element => {
  return (
    <div className="mtfh-asset-details">
      <SummaryList overrides={[2 / 3]}>
        <SummaryListItem title={locale.tenureDetails.assetTypeLabel}>
          {locale.assetType(assetType)}
        </SummaryListItem>
        <SummaryListItem title={locale.tenureDetails.uprnLabel}>
          {assetAddress.uprn}
        </SummaryListItem>
        <SummaryListItem title={locale.tenureDetails.assetReferenceLabel}>
          {assetReference}
        </SummaryListItem>
      </SummaryList>
    </div>
  );
};
