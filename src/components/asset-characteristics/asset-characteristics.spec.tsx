import React from "react";

import { mockAssetV1, render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { PropertySpecification } from "./asset-characteristics";

describe("AssetCharacteristics", () => {
  it("should display Property Specification", () => {
    render(
      <PropertySpecification
        numberOfBedrooms={mockAssetV1.assetCharacteristics.numberOfBedrooms}
        numberOfLifts={mockAssetV1.assetCharacteristics.numberOfLifts}
        numberOfLivingRooms={mockAssetV1.assetCharacteristics.windowType}
        windowType={mockAssetV1.assetCharacteristics.windowType}
        yearConstructed={mockAssetV1.assetCharacteristics.yearConstructed}
      />,
    );
    expect(
      screen.getByText(locale.assetCharacteristics.numberOfBedroomsLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(locale.assetCharacteristics.numberOfLiftsLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(locale.assetCharacteristics.numberOfBedroomsLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(locale.assetCharacteristics.windowTypeLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(locale.assetCharacteristics.yearConstructedLabel),
    ).toBeInTheDocument();
  });
});
