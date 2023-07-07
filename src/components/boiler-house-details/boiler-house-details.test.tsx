import React from "react";

import { render, server } from "@hackney/mtfh-test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

// import { AssetSideBar } from ".";

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
    // rest.get(
    //   `/api/v1/cautionary-alerts/properties-new/${assetData.assetId}`,
    //   (req, res, ctx) => res(ctx.status(200), ctx.json({ alerts: [] })),
    // ),

    rest.get(`/api/v1/assets/${boilerHouseId}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(boilerHouseData)),
    ),

    rest.patch(`/api/v1/assets/${boilerHouseId}`, (req, res, ctx) =>
      res(ctx.status(201), ctx.json(boilerHouseData)),
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
  // Arrange
  const asset = JSON.parse(JSON.stringify(assetData));
  asset.boilerHouseId = boilerHouseId;

  const { container } = render(<BoilerHouseDetails asset={asset} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });

  // Act

  // Assert
  await waitFor(async () => {
    expect(screen.getByRole("button")).toHaveTextContent("Remove boiler house");

    const addressLine1 = "1234 boiler house";
    expect(screen.getByRole("link")).toHaveTextContent(addressLine1);
  });
});

test("it shows add boiler house button", async () => {
  // Arrange
  const { container } = render(<BoilerHouseDetails asset={assetData} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });

  // Act

  // Assert

  await screen.getByText("Add boiler house");

  expect(screen.getByRole("link")).toHaveTextContent("Add boiler house");
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    `/property/${assetData.id}/add-boiler-house`,
  );
});

test("it opens the confirmation modal when remove boiler house button clicked", async () => {
  // Arrange
  const asset = JSON.parse(JSON.stringify(assetData));
  asset.boilerHouseId = boilerHouseId;

  const { container } = render(<BoilerHouseDetails asset={asset} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });

  // Act
});

test("it hides the confirmation modal when the cancel button is clicked", async () => {
  const asset = JSON.parse(JSON.stringify(assetData));
  asset.boilerHouseId = boilerHouseId;

  const { container } = render(<BoilerHouseDetails asset={asset} />, {
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

  const { container } = render(<BoilerHouseDetails asset={asset} />, {
    url: `/property/${assetData.id}`,
    path: "/property/:assetId",
  });

  // 1. Open modal
  // 2. Click confirmation button
  // 3. Assert request made

  // open modal
  // const removeButton = container.querySelector('[data-test="remove-boiler-house-button"]')
  // fireEvent.click(
  //   removeButton
  // )

  // fireEvent.click(screen.getByText(/Remove boiler house/i));

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
  asset.boilerHouseId = ""

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
  }, 2000)

  

  
  // // close modal
  // fireEvent.click(screen.getByText(/Cancel/i));

  // // confirm modal is closed
  // const modalHeading = screen.queryByText("Remove boiler house from property")
  // expect(modalHeading).toBeNull()
});

// test("it shows cautionary alerts", () => {
//   // Arrange
//   const { container } = render(
//     <AssetSideBar
//       alerts={[]}
//       assetDetails={assetData}
//       showCautionaryAlerts
//       showTenureInformation={false}
//     />,
//     {
//       url: `/property/${assetData.id}`,
//       path: "/property/:assetId",
//     },
//   );

//   // Assert
//   const cautionaryAlertsHeading = screen.getByText("Cautionary alerts");

//   expect(cautionaryAlertsHeading).toBeVisible();

//   expect(container).toMatchSnapshot();
// });

// test("it hides cautionary alerts", () => {
//   // Arrange
//   const { container } = render(
//     <AssetSideBar
//       alerts={[]}
//       assetDetails={assetData}
//       showCautionaryAlerts={false}
//       showTenureInformation={false}
//     />,
//     {
//       url: `/property/${assetData.id}`,
//       path: "/property/:assetId",
//     },
//   );

//   // Assert
//   const cautionaryAlertsHeading = screen.queryByText("Cautionary alerts");

//   expect(cautionaryAlertsHeading).not.toBeInTheDocument();

//   expect(container).toMatchSnapshot();
// });

// test("it shows tenure information", () => {
//   // Arrange
//   const { container } = render(
//     <AssetSideBar
//       alerts={[]}
//       assetDetails={assetData}
//       showCautionaryAlerts={false}
//       showTenureInformation
//     />,
//     {
//       url: `/property/${assetData.id}`,
//       path: "/property/:assetId",
//     },
//   );

//   // Assert
//   const tenureInformationHeading = screen.getByText("Tenure");

//   expect(tenureInformationHeading).toBeVisible();

//   expect(container).toMatchSnapshot();
// });

// test("it hides tenure information", () => {
//   // Arrange
//   const { container } = render(
//     <AssetSideBar
//       alerts={[]}
//       assetDetails={assetData}
//       showCautionaryAlerts={false}
//       showTenureInformation={false}
//     />,
//     {
//       url: `/property/${assetData.id}`,
//       path: "/property/:assetId",
//     },
//   );

//   // Assert
//   const tenureInformationHeading = screen.queryByText("Tenure");

//   expect(tenureInformationHeading).not.toBeInTheDocument();

//   expect(container).toMatchSnapshot();
// });
