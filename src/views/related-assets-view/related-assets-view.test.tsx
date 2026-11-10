import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { v4 as uuidv4 } from "uuid";

import { RelatedAssetsLayout } from "./layout";

import { Asset } from "@mtfh/common/lib/api/asset/v1";

const asset: Asset = {
  id: "a65918aa-e441-bc34-e49d-fa8671f768da",
  patchId: uuidv4(),
  areaId: uuidv4(),
  assetId: "00074866",
  assetType: "HighRiseBlock",
  rootAsset: "14edf718-19ff-ff43-4679-f8ef404fa029",
  parentAssetIds: "14edf718-19ff-ff43-4679-f8ef404fa029",
  assetLocation: {
    floorNo: "",
    totalBlockFloors: 0,
    parentAssets: [
      {
        type: "Estate",
        id: "14edf718-19ff-ff43-4679-f8ef404fa029",
        name: "Frampton Park Estate Frampton Park Road",
      },
    ],
  },
  assetAddress: {
    uprn: "",
    addressLine1: "1-93 Pitcairn House St Thomass Square",
    addressLine2: "Hackney",
    addressLine3: "London",
    addressLine4: "",
    postCode: "E9 6PT",
    postPreamble: "",
  },
  assetManagement: {
    agent: "Hackney Homes",
    areaOfficeName: "Homerton (1) Panel Area Team",
    isCouncilProperty: false,
    managingOrganisation: "London Borough of Hackney",
    managingOrganisationId: "c01e3146-e630-c2cd-e709-18ef57bf3724",
    owner: "LBH",
    isTMOManaged: false,
  },
  assetCharacteristics: {
    numberOfSingleBeds: 1,
    numberOfDoubleBeds: 1,
    numberOfFloors: 2,
    numberOfBedrooms: 0,
    numberOfLifts: 1,
    numberOfLivingRooms: 0,
    windowType: "",
    yearConstructed: "1960",
    totalBlockFloors: 1,
    heating: "",
    propertyFactor: "",
    architecturalType: "",
  },
  boilerHouseId: "",
  rentGroup: null,
  tenure: null,
  versionNumber: undefined,
};

const childrenAssets: Asset[] = [
  {
    id: "13e7cf17-60a0-729d-c297-a4e76a16b6fa",
    patchId: uuidv4(),
    areaId: uuidv4(),
    assetId: "00023449",
    assetType: "Dwelling",
    assetAddress: {
      uprn: "100023022363",
      addressLine1: "61 PITCAIRN HOUSE",
      addressLine2: "ST THOMASS SQUARE",
      addressLine3: "HACKNEY",
      addressLine4: "LONDON",
      postCode: "E9 6PU",
      postPreamble: "",
    },
    tenure: {
      id: "650b9052-9fc6-37cf-cafe-dd93d64646b2",
      paymentReference: "1923449802",
      startOfTenureDate: "2015-12-07T00:00:00Z",
      endOfTenureDate: "",
      type: "Secure",
      isActive: true,
    },
    rootAsset: "14edf718-19ff-ff43-4679-f8ef404fa029",
    parentAssetIds: "a65918aa-e441-bc34-e49d-fa8671f768da",
    assetCharacteristics: {
      numberOfSingleBeds: 1,
      numberOfDoubleBeds: 1,
      numberOfFloors: 2,
      numberOfBedrooms: 0,
      numberOfLifts: 1,
      numberOfLivingRooms: 0,
      windowType: "",
      yearConstructed: "1965",
      totalBlockFloors: 1,
      heating: "",
      propertyFactor: "",
      architecturalType: "",
    },
    assetManagement: {
      agent: "Hackney Homes",
      areaOfficeName: "Homerton (1) Panel Area Team",
      isCouncilProperty: true,
      managingOrganisation: "London Borough of Hackney",
      managingOrganisationId: "c01e3146-e630-c2cd-e709-18ef57bf3724",
      owner: "LBH",
      isTMOManaged: false,
    },
    assetLocation: {
      floorNo: "5",
      totalBlockFloors: 6,
      parentAssets: [],
    },
    boilerHouseId: "",
    rentGroup: null,
    versionNumber: undefined,
  },
];

test("it renders the component", async () => {
  const { container } = render(
    <RelatedAssetsLayout
      asset={asset}
      parentAssets={asset.assetLocation.parentAssets}
      childrenAssets={childrenAssets}
      loading={false}
    />,
  );
  expect(container).toMatchSnapshot();
});

test("it displays the heading of the page, a back button, and the property whose related assets are being displayed", async () => {
  const { container } = render(
    <RelatedAssetsLayout
      asset={asset}
      parentAssets={asset.assetLocation.parentAssets}
      childrenAssets={childrenAssets}
      loading={false}
    />,
  );
  expect(container).toHaveTextContent("Related assets");
  expect(container).toHaveTextContent(asset.assetAddress.addressLine1);
  expect(container).toHaveTextContent("Back to asset view");
});
