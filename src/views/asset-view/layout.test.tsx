import * as crypto from "crypto";

import React from "react";

import { render, server } from "@hackney/mtfh-test-utils";
import { waitFor } from "@testing-library/react";
import { rest } from "msw";

import { AssetLayout } from "./layout";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";
import * as auth from "@mtfh/common/lib/auth/auth";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";

const assetData: Asset = {
  id: "769894bd-b0bc-47eb-a780-322372c2448f",
  patchId: crypto.randomBytes(20).toString("hex"),
  areaId: crypto.randomBytes(20).toString("hex"),
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

const alert: Alert = {
  alertId: "1234",
  alertCode: "VA",
  assureReference: "",
  dateModified: "",
  description: "Verbal Abuse",
  endDate: null,
  modifiedBy: "",
  personName: "Joan Fisher",
  personId: "1",
  reason: "",
  startDate: "",
  isActive: true,
};

const mockPatch: Patch = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "HN1",
  patchType: "patch",
  parentId: crypto.randomBytes(20).toString("hex"),
  domain: "Hackney",
  responsibleEntities: [
    {
      id: crypto.randomBytes(20).toString("hex"),
      name: "Housing Officer 1",
      responsibleType: "HousingOfficer",
      contactDetails: {
        emailAddress: "test.test@hackney.gov.uk",
      },
    },
  ],
};

beforeEach(() => {
  jest.resetAllMocks();

  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get(
      `/api/v1/cautionary-alerts/properties-new/${assetData.assetId}`,
      (req, res, ctx) => res(ctx.status(200), ctx.json({ alerts: [alert] })),
    ),
  );

  server.use(
      rest.get("/api/v1/patch/all", (req, res, ctx) => {
        return res(ctx.json([mockPatch]));
      }),
  );
  
});

test("it shows the new cautionary alerts icon", async () => {
  // Arrange
  const { container } = render(
    <AssetLayout
      assetDetails={assetData}
      assetChildren={[]}
      showTenureInformation={false}
      showCautionaryAlerts
      enableNewProcesses={false}
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  await waitFor(async () => {
    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    const cautionaryAlertsIcon = container.querySelector(
      "[data-test='cautionary-alerts-icon']",
    );

    expect(cautionaryAlertsIcon).toBeVisible();
  });

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
    />,
    {
      url: `/property/${assetData.id}`,
      path: "/property/:assetId",
    },
  );

  // Assert
  // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
  const newProcessButton = container.querySelector(
    "[data-test='cautionary-alerts-icon']",
  );

  expect(newProcessButton).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});
