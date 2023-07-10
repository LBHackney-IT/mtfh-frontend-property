import React from "react";

import { render, server } from "@hackney/mtfh-test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

// import { BoilerHouseDetails } from "./boiler-house-details";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import * as auth from "@mtfh/common/lib/auth/auth";
import { AddBoilerHouseForm } from "./add-boiler-house-form";
import userEvent from "@testing-library/user-event";
import { config } from "@mtfh/search/src/services";

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

const boilerHouseData: Asset = {
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
    addressLine1: "1234 boiler house",
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

const boilerHouseId = "c01e3146-e630-c2cd-e709-18ef57bf3724";

beforeEach(() => {
  jest.resetAllMocks();

  //   jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get(
      `/api/search/assets?searchText=pitcairn&useCustomSorting=true&assetTypes=BoilerHouse`,
      (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            results: {
              assets: [boilerHouseData],
            },
            total: 1,
          }),
        ),
    ),
    rest.patch(`/api/v1/assets/${boilerHouseId}`, (req, res, ctx) =>
      res(ctx.status(201)),
    ),
  );
});

const setShowSuccessMock = jest.fn();

const setRequestErrorMock = () => {};

test("it renders the component", async () => {
  render(
    <AddBoilerHouseForm
      asset={assetData}
      setShowSuccess={setShowSuccessMock}
      setRequestError={setRequestErrorMock}
    />,
    {
      url: "/property/d12635d2-6d7b-b84a-d053-2fd8c9789f9b/add-boiler-house",
      path: "/property/:assetId/add-boiler-house",
    },
  );
});

test("it shows a validation error when search query is empty", async () => {
  render(
    <AddBoilerHouseForm
      asset={assetData}
      setShowSuccess={setShowSuccessMock}
      setRequestError={setRequestErrorMock}
    />,
    {
      url: "/property/d12635d2-6d7b-b84a-d053-2fd8c9789f9b/add-boiler-house",
      path: "/property/:assetId/add-boiler-house",
    },
  );

  await waitFor(async () => {
    fireEvent.click(screen.getByTestId(/boiler-house-search-submit/i));

    expect(screen.getByTestId(/boiler-house-search-error/i)).toHaveTextContent(
      "Error: Search text must be at least 2 characters",
    );
  });
});

test("it shows search results with valid search query", async () => {
  render(
    <AddBoilerHouseForm
      asset={assetData}
      setShowSuccess={setShowSuccessMock}
      setRequestError={setRequestErrorMock}
    />,
    {
      url: "/property/d12635d2-6d7b-b84a-d053-2fd8c9789f9b/add-boiler-house",
      path: "/property/:assetId/add-boiler-house",
    },
  );

  // type query
  userEvent.type(screen.getByTestId(/boiler-house-search-input/i), "pitcairn");

  // click search button
  fireEvent.click(screen.getByTestId(/boiler-house-search-submit/i));

  await waitFor(async () => {
    expect(screen.getByTestId(/boiler-house-search-results-total/i)).toHaveTextContent(
      "1 result found",
    );
  });
});

test("it shows error message when no boiler house selected", async () => {
  render(
    <AddBoilerHouseForm
      asset={assetData}
      setShowSuccess={setShowSuccessMock}
      setRequestError={setRequestErrorMock}
    />,
    {
      url: "/property/d12635d2-6d7b-b84a-d053-2fd8c9789f9b/add-boiler-house",
      path: "/property/:assetId/add-boiler-house",
    },
  );

  // type query
  userEvent.type(screen.getByTestId(/boiler-house-search-input/i), "pitcairn");

  // click search button
  fireEvent.click(screen.getByTestId(/boiler-house-search-submit/i));

  await waitFor(async () => {
    expect(screen.getByTestId(/boiler-house-search-results-total/i)).toHaveTextContent(
      "1 result found",
    );
  });

  // click submit button
  fireEvent.click(screen.getByTestId(/boiler-house-submit-button/i));

  expect(screen.getByTestId(/boiler-house-submit-error/i)).toHaveTextContent(
    "Error: You must select a boiler house",
  );
});

test("it adds a boiler house to a property", async () => {
  render(
    <AddBoilerHouseForm
      asset={assetData}
      setShowSuccess={setShowSuccessMock}
      setRequestError={setRequestErrorMock}
    />,
    {
      url: "/property/d12635d2-6d7b-b84a-d053-2fd8c9789f9b/add-boiler-house",
      path: "/property/:assetId/add-boiler-house",
    },
  );

  // type query
  userEvent.type(screen.getByTestId(/boiler-house-search-input/i), "pitcairn");

  // click search button
  fireEvent.click(screen.getByTestId(/boiler-house-search-submit/i));

  await waitFor(async () => {
    expect(screen.getByTestId(/boiler-house-search-results-total/i)).toHaveTextContent(
      "1 result found",
    );
  });

  // select first option
  fireEvent.change(screen.getByTestId("select"), { target: { value: 2 } });

  // assert option selected
  expect(screen.getByTestId("select-option")).toBeTruthy();

  // click submit button
  fireEvent.click(screen.getByTestId(/boiler-house-submit-button/i));

  // assert success message displayed

  waitFor(() => {
    expect(setShowSuccessMock).toBeCalledWith(true);
  });
});
