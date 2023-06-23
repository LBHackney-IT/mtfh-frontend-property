import React, { useState } from "react";

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
  const [isPropertySpecExpanded, setIsPropertySpecExpanded] = useState(false);
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
    <details className="govuk-details" data-module="govuk-details">
      <summary
        className="govuk-details__summary"
        onClick={() => setIsPropertySpecExpanded(!isPropertySpecExpanded)}
        data-testid="property-spec-toggle"
      >
        <span className="govuk-details__summary-text">Property Specification</span>
      </summary>
      {isPropertySpecExpanded && (
        <div className="govuk-details__text">
          <aside
            className="mtfh-asset-charateristics"
            data-testid="asset-characteristics-info"
          >
            <SummaryList overrides={[0.5, 0.5]} variant="base">
              {Object.keys(propSpecProps).map((item) => (
                <SummaryListItem
                  key={propSpecProps[item]?.label}
                  title={propSpecProps[item]?.label}
                  fallback={" "}
                  data-testid={item?.toString()}
                >
                  {propSpecProps[item as keyof AssetCharacteristics]?.value?.toString()}
                </SummaryListItem>
              ))}
            </SummaryList>
          </aside>
        </div>
      )}
    </details>
  );
};
