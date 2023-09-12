import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { LbhOwnershipInformation } from "./lbh-ownership-information";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import * as auth from "@mtfh/common/lib/auth/auth";

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
    numberOfSingleBeds: null,
    numberOfDoubleBeds: null,
    numberOfFloors: null,
    totalBlockFloors: null,
    heating: null,
    propertyFactor: null,
    architecturalType: null,
  },
  versionNumber: 0,
  tenure: {
    id: "c01e3146-e630-c2cd-e709-18ef57bf3724",
    paymentReference: "",
    type: "",
    startOfTenureDate: "",
    endOfTenureDate: "",
    isActive: false,
  },
  rootAsset: "",
  parentAssetIds: "",
  rentGroup: null,
  boilerHouseId: "",
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);
});

test("it renders the component", async () => {
  const { container } = render(<LbhOwnershipInformation asset={assetData} />);

  await screen.findByText(locale.lbhOwnershipInformation.sideBarHeading);

  expect(container).toMatchSnapshot();
});

test("it says the asset is owned by Hackney Council when 'isCouncilProperty' is true", async () => {
  render(<LbhOwnershipInformation asset={assetData} />);

  const assetOwnership = screen.getByText(locale.lbhOwnershipInformation.ownedByLbh);

  expect(assetOwnership).toBeVisible();
});

test("it says the asset is NOT owned by Hackney Council when 'isCouncilProperty' is false", async () => {
  // Set ownership to false
  assetData.assetManagement.isCouncilProperty = false;

  render(<LbhOwnershipInformation asset={assetData} />);

  const assetOwnership = screen.getByText(locale.lbhOwnershipInformation.notOwnedByLbh);

  expect(assetOwnership).toBeVisible();
});

test("it shows the 'Edit Ownership' button when the user is authorized", async () => {
  render(<LbhOwnershipInformation asset={assetData} />);

  // The button is actually a 'link' element and not a 'button'
  const editOwnershipButton = screen.getByRole("link", {
    name: locale.lbhOwnershipInformation.editOwnershipButton,
  });

  expect(editOwnershipButton).toBeVisible();
});

test("it does NOT the 'Edit Ownership' button when the user is not authorized", async () => {
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(false);

  render(<LbhOwnershipInformation asset={assetData} />);

  // The button is actually a 'link' element and not a 'button'
  const editOwnershipButton = screen.queryByRole("link", {
    name: locale.lbhOwnershipInformation.editOwnershipButton,
  });

  expect(editOwnershipButton).toBeNull();
});
