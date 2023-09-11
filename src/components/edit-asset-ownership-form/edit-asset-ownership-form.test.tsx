import React from "react";

import { render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import { EditAssetOwnershipForm } from "./edit-asset-ownership-form";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import userEvent from "@testing-library/user-event";

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

// Form HTML elements
const submitButton = screen.getByRole("button", { name: /confirm change/i });
const radioOptionYes = screen.getByRole("radio", { name: /yes/i });
const radioOptionNo = screen.getByRole("radio", { name: /no/i });
const radioOptions = screen.getAllByRole("radio");

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

  expect(radioOptionYes).toBeChecked();
});

test("the submit button of the form starts out as disabled, and if the ownership of the asset is changed, the button is enabled", async () => {
  render(
    <EditAssetOwnershipForm
      asset={testAsset}
      setShowSuccess={jest.fn()}
      setRequestError={jest.fn()}
    />,
  );

  // Button is disabled to start with
  expect(submitButton).toBeDisabled();

  // Change ownership 
  userEvent.click(radioOptionNo);

  // Button is now enabled
  expect(submitButton).toBeEnabled();
});

test("once the form has been submitted, both radio options and the submit button are disabled", async () => {
  render(
    <EditAssetOwnershipForm
      asset={testAsset}
      setShowSuccess={jest.fn()}
      setRequestError={jest.fn()}
    />,
  );

  // Change ownership 
  userEvent.click(radioOptionNo);

  await waitFor(async () => {
    // Submit form
    userEvent.click(submitButton)

    // Delay to allow re-render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Submit button and the radio options are disabled
    expect(submitButton).toBeDisabled();
    expect(radioOptionYes).toBeDisabled();
    expect(radioOptionNo).toBeDisabled();
  });
});