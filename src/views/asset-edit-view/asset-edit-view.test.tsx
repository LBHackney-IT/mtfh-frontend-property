import React from "react";

import { getAssetV1, mockAssetV1, render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import locale from "../../services/locale";

import { AssetEditView } from ".";

import * as auth from "@mtfh/common/lib/auth/auth";

const tenureData = {
  id: "387ddd25-5b10-452d-ba44-1cfac0583075",
  startOfTenureDate: "2005-07-11T00:00:00",
  endOfTenureDate: null,
  paymentReference: "7647050047",
  tenureType: {
    code: "SEC",
    description: "Secure",
  },
  tenureSource: null,
  terminated: {
    isTerminated: false,
    reasonForTermination: "",
  },
  fundingSource: null,
  numberOfAdultsInProperty: 0,
  numberOfChildrenInProperty: 0,
  hasOffsiteStorage: null,
  furtherAccountInformation: null,
  legacyReferences: [
    {
      name: "uh_tag_ref",
      value: "051956/01",
    },
    {
      name: "u_saff_tenancy",
      value: "01831970",
    },
  ],
  tenuredAsset: {
    id: "15adc44b-6fde-46e8-af9c-e18b1495c9ab",
    fullAddress: "51 GREENWOOD ROAD - FLAT B",
    uprn: "100021045676",
    propertyReference: "100021045676",
    isTemporaryAccomodation: false,
  },
};

const assetData = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ab",
  assetId: "100021045676",
  areaId: "7c9790a5-ea4d-4819-bcdb-0a10094b7166",
  patchId: "a6809b57-9ba9-4a7d-bf14-f3a1182ca994",
  assetType: "LettableNonDwelling",
  rootAsset: null,
  parentAssetIds: null,
  isActive: false,
  assetLocation: null,
  assetAddress: {
    uprn: "100021045676",
    addressLine1: "51 GREENWOOD ROAD - FLAT B",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
    postCode: "E8 1QT",
    postPreamble: "X",
  },
  assetManagement: {
    agent: null,
    areaOfficeName: null,
    isCouncilProperty: false,
    managingOrganisation: null,
    managingOrganisationId: "00000000-0000-0000-0000-000000000000",
    owner: null,
    isTMOManaged: false,
    propertyOccupiedStatus: null,
    propertyOccupiedStatusReason: null,
    isNoRepairsMaintenance: false,
    councilTaxType: null,
    councilTaxLiability: null,
    isTemporaryAccomodation: true,
    readyToLetDate: false,
  },
  assetCharacteristics: null,
  tenure: {
    id: "387ddd25-5b10-452d-ba44-1cfac0583075",
    type: "Asylum Seeker",
    startOfTenureDate: "2011-01-01T00:00:00Z",
  },
  versionNumber: 18,
};

const llpgAddressData = {
  data: {
    address: [
      {
        line1: "FLAT B",
        line2: "51 GREENWOOD ROAD",
        line3: "HACKNEY",
        line4: "",
        town: "LONDON",
        postcode: "E8 1NT",
        UPRN: 100021045676,
      },
    ],
    page_count: 1,
    total_count: 1,
  },
  statusCode: 200,
};

beforeEach(() => {
  jest.resetAllMocks();

  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get("/api/v1/tenures/:id", (req, res, ctx) => {
      return res(ctx.json(tenureData));
    }),
  );

  server.use(
    rest.get("/api/v1/assets/:id", (req, res, ctx) => {
      return res(ctx.json(assetData));
    }),
  );

  server.use(
    rest.get("/api/v1/addresses", (req, res, ctx) => {
      return res(ctx.json(llpgAddressData));
    }),
  );

  server.use(
    rest.patch(`/api/v1/assets/${assetData.id}/address`, (req, res, ctx) => {
      return res(ctx.status(204));
    }),
  );

  server.use(
    rest.patch(`/api/v1/tenures/:id`, (req, res, ctx) => {
      return res(ctx.status(204));
    }),
  );

  server.use(
    rest.patch(`/api/v1/asset/:id`, (req, res, ctx) => {
      return res(ctx.status(204));
    }),
  );
});

//TO DO: uncomment after catch is defined in getAllPatchesAndAreas() new-asset.tsx
test.skip("renders the error on asset load failure", async () => {
  server.use(getAssetV1(undefined, 500));
  render(<AssetEditView />, {
    url: `/property/edit/${mockAssetV1.id}`,
    path: "/property/edit/:assetId",
  });

  await screen.findByRole("alert");
});

test("renders the whole 'Edit property address' view", async () => {
  const { container } = render(<AssetEditView />, {
    url: `/property/edit/${assetData.id}`,
    path: "/property/edit/:assetId",
  });

  // This allows the test to wait for the page to be populated, after receiving data from the mock Address and Asset APIs
  await waitFor(() => expect(screen.getAllByRole("heading")).toHaveLength(3));

  expect(container).toMatchSnapshot();
});

test("the current address from the asset is updated using the LLPG address suggestion", async () => {
  render(<AssetEditView />, {
    url: `/property/edit/${assetData.id}`,
    path: "/property/edit/:assetId",
  });

  // This allows the test to wait for the page to be populated, after receiving data from the mock Address and Asset APIs
  await waitFor(() => expect(screen.getAllByRole("heading")).toHaveLength(3));

  // Assert LLPG Address Line 1 is FLAT B
  const llpgAddressLine1 = screen.getByTestId("address-line-1");
  expect(llpgAddressLine1).toHaveValue("FLAT B");

  // Assert Asset Address Line 1 is 51 GREENWOOD ROAD - FLAT B
  const assetAddressLine1 = screen.getByTestId("asset-address-line-one");
  expect(assetAddressLine1).toHaveValue("51 GREENWOOD ROAD - FLAT B");

  // Assert LLPG AddrLine2 is 51 GREENWOOD ROAD
  const llpgAddressLine2 = screen.getByTestId("address-line-2");
  expect(llpgAddressLine2).toHaveValue("51 GREENWOOD ROAD");

  // Assert Asset AddrLine2 is ""
  const assetAddressLine2 = screen.getByTestId("asset-address-line-two");
  expect(assetAddressLine2).toHaveValue("");

  // Assert LLPG AddrLine3 is HACKNEY
  const llpgAddressLine3 = screen.getByTestId("address-line-3");
  expect(llpgAddressLine3).toHaveValue("HACKNEY");

  // Assert Asset AddrLine3 is ""
  const assetAddressLine3 = screen.getByTestId("asset-address-line-three");
  expect(assetAddressLine3).toHaveValue("");

  // Assert LLPG AddrLine4 is LONDON
  const llpgAddressLine4 = screen.getByTestId("address-line-4");
  expect(llpgAddressLine4).toHaveValue("LONDON");

  // Assert Asset AddrLine4 is ""
  const assetAddressLine4 = screen.getByTestId("asset-address-line-four");
  expect(assetAddressLine4).toHaveValue("");

  // Assert LLPG postcode is ""
  const llpgPostcode = screen.getByTestId("postcode");
  expect(llpgPostcode).toHaveValue("E8 1NT");

  // Assert Asset AddrLine4 is ""
  const assetPostcode = screen.getByTestId("asset-postcode");
  expect(assetPostcode).toHaveValue("E8 1QT");

  // Assert LLPG post preamble is ""
  const llpgPostPreamble = screen.getByTestId("post-preamble");
  expect(llpgPostPreamble).toHaveValue("");

  // Assert Asset AddrLine4 is ""
  const assetPostPreamble = screen.getByTestId("asset-post-preamble");
  expect(assetPostPreamble).toHaveValue("X");

  // Edit post preamble value
  userEvent.clear(llpgPostPreamble);
  userEvent.type(llpgPostPreamble, "Y");
  expect(llpgPostPreamble).toHaveValue("Y");

  // User click on "Update to this address"
  const updateButton = screen.getByRole("button", { name: "Update to this address" });

  // The await is required, as it allows the PATCH API call to be intercepted and the Current Asset Address value to be replaced with the LLPG suggestion.
  // Without it, the test may pass but the below expects would not work as expected.

  await waitFor(() => {
    userEvent.click(updateButton);

    // Assert Asset Address Line 1 is FLAT B, the same as LLPG Address Line 1
    expect(assetAddressLine1).toHaveValue("FLAT B");

    // Assert Asset AddrLine2 is 51 GREENWOOD ROAD, the same as LLPG Address Line 2
    expect(assetAddressLine2).toHaveValue("51 GREENWOOD ROAD");

    // Assert Asset AddrLine3 is HACKNEY, the same as LLPG Address Line 3
    expect(assetAddressLine3).toHaveValue("HACKNEY");

    // Assert Asset AddrLine4 is LONDON, the same as LLPG Address Line 1
    expect(assetAddressLine4).toHaveValue("LONDON");

    // Assert Asset Postcode is E8 1NT, the same as LLPG Postcode
    expect(assetPostcode).toHaveValue("E8 1NT");

    // Assert Asset PostPreamble is Y, the same as LLPG Post Preamble
    expect(assetPostPreamble).toHaveValue("Y");
  });
});

test("form action buttons are rendered and are enabled", async () => {
  render(<AssetEditView />, {
    url: `/property/edit/${assetData.id}`,
    path: "/property/edit/:assetId",
  });

  // This allows the test to wait for the page to be populated, after receiving data from the mock Address and Asset APIs
  await waitFor(() => expect(screen.getAllByRole("heading")).toHaveLength(3));

  // Assert "Update to this address" and "Cancel" buttons are in the DOM and are enabled on page load
  const updateButton = screen.getByRole("button", { name: "Update to this address" });
  const cancelButton = screen.getByText("Cancel");

  expect(updateButton).toBeInTheDocument();
  expect(updateButton).toBeEnabled();

  expect(cancelButton).toBeInTheDocument();
  expect(cancelButton).toBeEnabled();
});

test("the URL of the page includes property/edit followed by the asset GUID", async () => {
  render(<AssetEditView />, {
    url: `/property/edit/${assetData.id}`,
    path: "/property/edit/:assetId",
  });

  expect(window.location.pathname).toContain(`/property/edit/${assetData.id}`);
});

test("it shows the 'Back to asset' link", async () => {
  render(<AssetEditView />, {
    url: `/property/edit/${assetData.id}`,
    path: "/property/edit/:assetId",
  });

  const backLink = await screen.findByText("Back to asset");
  expect(backLink).toBeVisible();
});

test("after a successful asset address update, a success message is shown", async () => {
  render(<AssetEditView />, {
    url: `/property/edit/${assetData.id}`,
    path: "/property/edit/:assetId",
  });

  // This allows the test to wait for the page to be populated, after receiving data from the mock Address and Asset APIs
  await waitFor(() => expect(screen.getAllByRole("heading")).toHaveLength(3));

  // User click on "Update to this address"
  const updateButton = screen.getByRole("button", { name: "Update to this address" });

  await waitFor(async () => {
    userEvent.click(updateButton);

    const successMessage = await screen.findByText(
      "The asset address has been updated successfully.",
    );
    expect(successMessage).toBeVisible();
  });
});

test("after a successful asset address update, the 'submit' and 'cancel' buttons are replaced by a 'back to asset' button", async () => {
  render(<AssetEditView />, {
    url: `/property/edit/${assetData.id}`,
    path: "/property/edit/:assetId",
  });

  // This allows the test to wait for the page to be populated, after receiving data from the mock Address and Asset APIs
  await waitFor(() => expect(screen.getAllByRole("heading")).toHaveLength(3));

  // User click on "Update to this address"
  const updateButton = screen.getByRole("button", { name: "Update to this address" });
  const cancelButton = screen.getByText("Cancel");

  expect(updateButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();

  await waitFor(async () => {
    userEvent.click(updateButton);

    const backToAssetButton = screen.getByText("Back to asset view");

    expect(updateButton).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
    expect(backToAssetButton).toBeInTheDocument();
  });
});

test("unauthorized message is shown for unauthorized users", async () => {
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(false);
  render(<AssetEditView />, {
    url: `/property/edit/${assetData.id}`,
    path: "/property/edit/:assetId",
  });

  // This allows the test to wait for the page to be populated, after receiving data from the mock Address and Asset APIs
  await waitFor(() => {
    const unauthorizedErrorMessage = screen.getByText(
      locale.errors.noAddressEditPermissions,
    );
    expect(unauthorizedErrorMessage).toBeVisible();
  });
});

test("when editing an address without a UPRN, the editable fields are filled with current address details", async () => {
  const assetWithoutUprn = assetData;

  // Remove UPRN property from our test asset (which has one)
  assetWithoutUprn.assetAddress.uprn = "";

  render(<AssetEditView />, {
    url: `/property/edit/${assetWithoutUprn.id}`,
    path: "/property/edit/:assetId",
  });

  // This allows the test to wait for the page to be populated, after receiving data from the mock Address and Asset APIs
  // Unlike previous tests, now we expect to find only 2 headings, as the "Current address" section is not visible
  await waitFor(() => expect(screen.getAllByRole("heading")).toHaveLength(2));

  const currentAddressLine1 = screen.getByTestId("address-line-1");
  expect(currentAddressLine1).toHaveValue("51 GREENWOOD ROAD - FLAT B");

  const currentAddressLine2 = screen.getByTestId("address-line-2");
  expect(currentAddressLine2).toHaveValue("");

  const currentAddressLine3 = screen.getByTestId("address-line-3");
  expect(currentAddressLine3).toHaveValue("");

  const currentAddressLine4 = screen.getByTestId("address-line-4");
  expect(currentAddressLine4).toHaveValue("");

  const currentAddressPostcode = screen.getByTestId("postcode");
  expect(currentAddressPostcode).toHaveValue("E8 1QT");

  const llpgPostPreamble = screen.getByTestId("post-preamble");
  expect(llpgPostPreamble).toHaveValue("X");
});
