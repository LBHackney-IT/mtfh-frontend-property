import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { AssetLayout } from "./layout";

const assetData: Asset = {
  id: "769894bd-b0bc-47eb-a780-322372c2448f",
  assetId: "0019062023",
  assetType: "Block",
  assetLocation: {
    parentAssets: [],
    floorNo: "0",
    totalBlockFloors: 3,
  },
  assetAddress: {
    uprn: "10008355547",
    addressLine1: "123 Test Block(CAN BE DELETED)",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
    postPreamble: "",
    postCode: "FK8 1FH",
  },
  assetManagement: {
    isCouncilProperty: true,
    managingOrganisation: "London Borough of Hackney",
    managingOrganisationId: "c01e3146-e630-c2cd-e709-18ef57bf3724",
    isTMOManaged: false,
    agent: "Agent Smith",
    areaOfficeName: "Test",
    owner: "Test",
  },
  assetCharacteristics: {
    numberOfBedrooms: 0,
    numberOfLifts: 0,
    numberOfLivingRooms: 0,
    windowType: "Wood",
    yearConstructed: "1991",
  },
  versionNumber: 0,
  tenure: {
    id: "c01e3146-e630-c2cd-e709-18ef57bf3724",
  },
  rootAsset: "",
  parentAssetIds: "",
};

test("it shows the new cautionary alerts icon", () => {
  // Arrange
  const { container } = render(
    <AssetLayout
      assetDetails={assetData}
      assetChildren={[]}
      showTenureInformation={false}
      showCautionaryAlerts={true}
      enableNewProcesses={false}
      enableEditAddress={false}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  const cautionaryAlertsIcon = container.querySelector(".mtfh-icon");

  expect(cautionaryAlertsIcon).toBeVisible();

  expect(container).toMatchSnapshot();
});

test("it hides the cautionary alerts icon", () => {
  // Arrange
  const { container } = render(
    <AssetLayout
      assetDetails={assetData}
      assetChildren={[]}
      showTenureInformation={false}
      showCautionaryAlerts={false}
      enableNewProcesses={false}
      enableEditAddress={false}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  const newProcessButton = screen.queryByText("New Process");

  expect(newProcessButton).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});
