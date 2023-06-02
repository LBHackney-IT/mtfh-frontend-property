import React from "react";

import { mockAssetV1, render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

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
    expect(screen.getByText("Number Of Bedrooms")).toBeInTheDocument();
    expect(screen.getByText("Number Of Lifts")).toBeInTheDocument();
    expect(screen.getByText("Number of Living rooms")).toBeInTheDocument();
    expect(screen.getByText("Window Type")).toBeInTheDocument();
    expect(screen.getByText("Year Constructed")).toBeInTheDocument();
  });
});
