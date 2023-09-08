import React from "react";

import { render, server } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import { rest } from "msw";

import { EditAssetOwnershipForm } from "./edit-asset-ownership-form";

import { Asset } from "@mtfh/common/lib/api/asset/v1";

const testAsset: Asset = {
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

  server.use(
    rest.patch(`/api/v1/assets/${testAsset.id}`, (req, res, ctx) => res(ctx.status(204))),
  );
});

// const setShowSuccessMock = jest.fn();

// const setRequestErrorMock = () => {};

test("it renders the component", async () => {
  const { container } = render(
    <EditAssetOwnershipForm
      asset={testAsset}
      setShowSuccess={jest.fn()}
      setRequestError={jest.fn()}
    />,
  );

  expect(container).toMatchSnapshot();
});

test("it displays two radio buttons to set isCouncilProperty true or false", async () => {
  render(
    <EditAssetOwnershipForm
      asset={testAsset}
      setShowSuccess={jest.fn()}
      setRequestError={jest.fn()}
    />,
  );

  const radioOptions = screen.getAllByRole("radio");
  const radioOptionYes = screen.getByRole("radio", { name: /yes/i });
  const radioOptionNo = screen.getByRole("radio", { name: /no/i });

  expect(radioOptions).toHaveLength(2);
  expect(radioOptionYes).toBeVisible();
  expect(radioOptionNo).toBeVisible();
});

test("the radio option is already checked on page load if isCouncilProperty has a value", async () => {
  testAsset.assetManagement.isCouncilProperty = true;

  render(
    <EditAssetOwnershipForm
      asset={testAsset}
      setShowSuccess={jest.fn()}
      setRequestError={jest.fn()}
    />,
  );

  const radioOptionYes = screen.getByRole("radio", { name: /yes/i });

  expect(radioOptionYes).toBeChecked();
});
