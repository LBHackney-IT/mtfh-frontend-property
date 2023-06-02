import React from "react";

import { locale } from "../../services";

import { SummaryList, SummaryListItem } from "@mtfh/common/lib/components";

interface AssetCharacteristicsProps {
  numberOfBedrooms: any;
  numberOfLifts: any;
  numberOfLivingRooms: any;
  windowType: string;
  yearConstructed: string;
}

export const PropertySpecification = ({
  numberOfBedrooms,
  numberOfLifts,
  numberOfLivingRooms,
  windowType,
  yearConstructed,
}: AssetCharacteristicsProps): JSX.Element => {
  return (
    <aside className="mtfh-asset-charateristics">
      <SummaryList overrides={[2 / 3]}>
        <SummaryListItem title={locale.assetCharacteristics.numberOfBedroomsLabel}>
          {numberOfBedrooms}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.numberOfLiftsLabel}>
          {numberOfLifts}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.numberOfLivingRoomsLabel}>
          {numberOfLivingRooms}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.windowTypeLabel}>
          {windowType}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.yearConstructedLabel}>
          {yearConstructed}
        </SummaryListItem>
      </SummaryList>
    </aside>
  );
};
