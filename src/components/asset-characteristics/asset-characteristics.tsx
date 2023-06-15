import React from "react";

import { locale } from "../../services";

import { AssetCharacteristics } from "@mtfh/common/lib/api/asset/v1";
import { SummaryList, SummaryListItem } from "@mtfh/common/lib/components";

interface IPropSpecProps {
  assetCharacteristics: AssetCharacteristics;
}

type PropSpecProp = {
  label: string;
  value: string | number | null;
};

export const PropertySpecification = ({
  assetCharacteristics,
}: IPropSpecProps): JSX.Element => {
  // Create an object of keys, labels, and values to loop through
  const propSpecProps: {
    [key: string]: PropSpecProp;
  } = {
    numberOfBedrooms: {
      label: locale.assetCharacteristics.numberOfBedroomsLabel,
      value: assetCharacteristics.numberOfBedrooms,
    },
    numberOfLifts: {
      label: locale.assetCharacteristics.numberOfLiftsLabel,
      value: assetCharacteristics.numberOfLifts,
    },
    numberOfSingleBeds: {
      label: locale.assetCharacteristics.numberOfSingleBedsLabel,
      value: assetCharacteristics.numberOfSingleBeds,
    },
    numberOfDoubleBeds: {
      label: locale.assetCharacteristics.numberOfDoubleBedsLabel,
      value: assetCharacteristics.numberOfDoubleBeds,
    },
    numberOfLivingRooms: {
      label: locale.assetCharacteristics.numberOfLivingRoomsLabel,
      value: assetCharacteristics.numberOfLivingRooms,
    },
    numberOfFloors: {
      label: locale.assetCharacteristics.numberOfFloorsLabel,
      value: assetCharacteristics.numberOfFloors,
    },
    totalBlockFloors: {
      label: locale.assetCharacteristics.totalBlockFloorsLabel,
      value: assetCharacteristics.totalBlockFloors,
    },
    heating: {
      label: locale.assetCharacteristics.heatingLabel,
      value: assetCharacteristics.heating,
    },
    windowType: {
      label: locale.assetCharacteristics.windowTypeLabel,
      value: assetCharacteristics.windowType,
    },
    propertyFactor: {
      label: locale.assetCharacteristics.propertyFactorLabel,
      value: assetCharacteristics.propertyFactor,
    },
    yearConstructed: {
      label: locale.assetCharacteristics.yearConstructedLabel,
      value: assetCharacteristics.yearConstructed,
    },
    architecturalType: {
      label: locale.assetCharacteristics.architecturalTypeLabel,
      value: assetCharacteristics.architecturalType,
    },
  };

  // Loop through props as SummaryListItems
  return (
    <aside className="mtfh-asset-charateristics">
      <SummaryList overrides={[0.5, 0.5]} variant="base">
        {Object.keys(propSpecProps)
          // Sort the labels not null on top
          .sort((label) => {
            if (propSpecProps[label].value == null) return 1;
            return -1;
          })
          .map((item, index) => (
            <SummaryListItem
              key={index}
              title={propSpecProps[item] && propSpecProps[item].label}
              fallback={" "}
              data-testid={item?.toString()}
            >
              {propSpecProps[item as keyof AssetCharacteristics]?.value?.toString()}
            </SummaryListItem>
          ))}
      </SummaryList>
    </aside>
  );
};
