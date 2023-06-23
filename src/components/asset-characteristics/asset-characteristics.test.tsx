import React from "react";

import { mockAssetV1, render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { PropertySpecification } from "./asset-characteristics";

describe("AssetCharacteristics", () => {
  beforeEach(() => {
    mockAssetV1.assetCharacteristics.totalBlockFloors =
      mockAssetV1.assetLocation.totalBlockFloors;
    render(
      <PropertySpecification assetCharacteristics={mockAssetV1.assetCharacteristics} />,
    );
  });

  it("should display the correct characteristic headers", () => {
    for (const characteristic in mockAssetV1.assetCharacteristics) {
      const summaryRow = screen.getByTestId(characteristic);

      const expectedHeader =
        locale.assetCharacteristics[
          characteristic as keyof typeof locale.assetCharacteristics
        ];
      const expectedHeaderString = expectedHeader?.toString() || "";

      expect(summaryRow?.textContent).toContain(expectedHeaderString);
    }
  });

  it("should display the correct characteristic values", () => {
    for (const characteristic in mockAssetV1.assetCharacteristics) {
      const summaryRow = screen.getByTestId(characteristic);

      const expectedValue = mockAssetV1[characteristic as keyof typeof mockAssetV1];
      const expectedValueString = expectedValue?.toString() ?? "";

      expect(summaryRow?.textContent).toContain(expectedValueString);
    }
  });
});
