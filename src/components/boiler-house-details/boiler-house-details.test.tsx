import React from "react";

import { render, server } from "@hackney/mtfh-test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import { BoilerHouseDetails } from "./boiler-house-details";

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

  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get(`/api/v1/assets/${boilerHouseId}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(boilerHouseData)),
    ),

    rest.patch(`/api/v1/assets/${boilerHouseId}`, (req, res, ctx) =>
      res(ctx.status(201)),
    ),
  );
});

test("it renders the component", async () => {
  render(<BoilerHouseDetails asset={assetData} />, {
    url: "/property/123",
    path: "/property/:assetId",
  });

  await screen.findByText("Boiler house");
});

test("it shows boiler house details", async () => {
  const asset = JSON.parse(JSON.stringify(assetData));
  asset.boilerHouseId = boilerHouseId;

  render(<BoilerHouseDetails asset={asset} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });

  await waitFor(async () => {
    expect(screen.getByRole("button")).toHaveTextContent("Remove boiler house");

    const addressLine1 = "1234 boiler house";
    expect(screen.getByRole("link")).toHaveTextContent(addressLine1);
  });
});

test("it shows add boiler house button", () => {
  render(<BoilerHouseDetails asset={assetData} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });

  screen.getByText("Add boiler house");

  expect(screen.getByRole("link")).toHaveTextContent("Add boiler house");
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    `/property/${assetData.id}/add-boiler-house`,
  );
});

test("it opens the confirmation modal when remove boiler house button clicked", async () => {
  const asset = JSON.parse(JSON.stringify(assetData));
  asset.boilerHouseId = boilerHouseId;

  render(<BoilerHouseDetails asset={asset} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });
});

test("it hides the confirmation modal when the cancel button is clicked", async () => {
  const asset = JSON.parse(JSON.stringify(assetData));
  asset.boilerHouseId = boilerHouseId;

  render(<BoilerHouseDetails asset={asset} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });

  await waitFor(async () => {
    // open modal
    fireEvent.click(screen.getByText(/Remove boiler house/i));

    // confirm modal is open
    await screen.findByText("Remove boiler house from property");

    // close modal
    fireEvent.click(screen.getByText(/Cancel/i));

    // confirm modal is closed
    const modalHeading = screen.queryByText("Remove boiler house from property");
    expect(modalHeading).toBeNull();
  });
});

test("it removes the boiler house when confirmation button clicked", async () => {
  const asset = JSON.parse(JSON.stringify(assetData));
  asset.boilerHouseId = boilerHouseId;

  render(<BoilerHouseDetails asset={asset} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });

  await waitFor(async () => {
    const addressLine1 = "1234 boiler house";
    expect(screen.getByRole("link")).toHaveTextContent(addressLine1);

    fireEvent.click(screen.getByTestId(/remove-boiler-house-button/i));

    // confirm modal is open
    await screen.findByText("Remove boiler house from property");
  });

  // click confirmation button
  fireEvent.click(screen.getByTestId(/confirm-remove-modal-button/i));

  // manually remove boilerHouseId from request object
  asset.boilerHouseId = "";

  setTimeout(async () => {
    // confirm modal is closed
    const modalHeading = screen.queryByText("Remove boiler house from property");
    expect(modalHeading).toBeNull();

    await waitFor(async () => {
      // confirm boiler house removed
      const boilerHouseLink = screen.queryByText("1234 boiler house");
      expect(boilerHouseLink).toBeNull();

      expect(screen.getByRole("link")).toHaveTextContent("Add boiler house");
    });
  }, 2000);
});
