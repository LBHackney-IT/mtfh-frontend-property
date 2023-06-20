import React from "react";

import { render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import * as auth from "@mtfh/common/lib/auth/auth";

import { AssetSideBar } from ".";
import { Asset } from "@mtfh/common/lib/api/asset/v1";

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

beforeEach(() => {
  jest.resetAllMocks();

  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get(
      `/api/v1/cautionary-alerts/properties-new/${assetData.assetId}`,
      (req, res, ctx) => res(ctx.status(200), ctx.json({ alerts: [] })),
    ),
  );
});

test("it shows the edit address button", () => {
  // Arrange
  const { container } = render(
    <AssetSideBar
      alerts={[]}
      assetDetails={assetData}
      enableEditAddress={true}
      showCautionaryAlerts={false}
      showTenureInformation={false}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  const editAddressButton = screen.getByText("Edit address details");

  expect(editAddressButton).toBeVisible();

  expect(container).toMatchSnapshot();
});

test("it hides the edit address button", () => {
  // Arrange
  const { container } = render(
    <AssetSideBar
      alerts={[]}
      assetDetails={assetData}
      enableEditAddress={false}
      showCautionaryAlerts={false}
      showTenureInformation={false}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  const editAddressButton = screen.queryByText("Edit address details");

  expect(editAddressButton).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

test("it shows cautionary alerts", () => {
  // Arrange
  const { container } = render(
    <AssetSideBar
      alerts={[]}
      assetDetails={assetData}
      enableEditAddress={false}
      showCautionaryAlerts={true}
      showTenureInformation={false}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  const cautionaryAlertsHeading = screen.getByText("Cautionary alerts");

  expect(cautionaryAlertsHeading).toBeVisible();

  expect(container).toMatchSnapshot();
});

test("it hides cautionary alerts", () => {
  // Arrange
  const { container } = render(
    <AssetSideBar
      alerts={[]}
      assetDetails={assetData}
      enableEditAddress={false}
      showCautionaryAlerts={false}
      showTenureInformation={false}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  const cautionaryAlertsHeading = screen.queryByText("Cautionary alerts");

  expect(cautionaryAlertsHeading).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

test("it shows tenure information", () => {
  // Arrange
  const { container } = render(
    <AssetSideBar
      alerts={[]}
      assetDetails={assetData}
      enableEditAddress={false}
      showCautionaryAlerts={false}
      showTenureInformation={true}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  const tenureInformationHeading = screen.getByText("Tenure");

  expect(tenureInformationHeading).toBeVisible();

  expect(container).toMatchSnapshot();
});

test("it hides tenure information", () => {
  // Arrange
  const { container } = render(
    <AssetSideBar
      alerts={[]}
      assetDetails={assetData}
      enableEditAddress={false}
      showCautionaryAlerts={false}
      showTenureInformation={false}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  const tenureInformationHeading = screen.queryByText("Tenure");

  expect(tenureInformationHeading).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});
