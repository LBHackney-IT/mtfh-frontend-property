import React from "react";

import { locale } from "../../services";

import { SummaryList, SummaryListItem } from "@mtfh/common/lib/components";

interface AssetCharacteristicsProps {
  numberOfBedrooms: any;
  numberOfSingleBeds: any;
  numberOfDoubleBeds: any;
  numberOfLifts: any;
  numberOfLivingRooms: any;
  numberOfFloors: any;
  totalBlockFloors: any;
  heating: string;
  windowType: string;
  propertyFactor: string;
  yearConstructed: string;
  architecturalType: string;
}

export const PropertySpecification = ({
  numberOfBedrooms,
  numberOfSingleBeds,
  numberOfDoubleBeds,
  numberOfLifts,
  numberOfLivingRooms,
  numberOfFloors,
  totalBlockFloors,
  heating,
  windowType,
  propertyFactor,
  yearConstructed,
  architecturalType,
}: AssetCharacteristicsProps): JSX.Element => {
  return (
    <aside className="mtfh-asset-charateristics">
      <SummaryList overrides={[2 / 3]}>
        <SummaryListItem title={locale.assetCharacteristics.numberOfBedroomsLabel}>
          {numberOfBedrooms}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.numberOfSingleBeds}>
          {numberOfSingleBeds}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.numberOfDoubleBeds}>
          {numberOfDoubleBeds}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.numberOfLiftsLabel}>
          {numberOfLifts}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.numberOfLivingRoomsLabel}>
          {numberOfLivingRooms}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.numberOfFloors}>
          {numberOfFloors}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.totalBlockFloors}>
          {totalBlockFloors}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.heating}>
          {heating}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.windowTypeLabel}>
          {windowType}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.propertyFactor}>
          {propertyFactor}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.yearConstructedLabel}>
          {yearConstructed}
        </SummaryListItem>
        <SummaryListItem title={locale.assetCharacteristics.architecturalType}>
          {architecturalType}
        </SummaryListItem>
      </SummaryList>
    </aside>
  );
};
