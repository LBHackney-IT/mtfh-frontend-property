import { Asset, RentGroup } from "@mtfh/common/lib/api/asset/v1/types";

export const testValidDwellingFixture: Asset = {
  id: "2d13b5cb-baf2-91fd-c231-8c5c2ee9548c",
  assetId: "00023400",
  assetType: "Dwelling",
  rootAsset: "14edf718-19ff-ff43-4679-f8ef404fa029",
  rentGroup: RentGroup.HRA,
  parentAssetIds:
    "656feda1-896f-b136-da84-163ee4f1be6c#14edf718-19ff-ff43-4679-f8ef404fa029#a65918aa-e441-bc34-e49d-fa8671f768da",
  assetLocation: {
    floorNo: "2",
    totalBlockFloors: 10,
    parentAssets: [
      {
        type: "Estate",
        id: "14edf718-19ff-ff43-4679-f8ef404fa029",
        name: "Frampton Park Estate",
      },
      {
        type: "High Rise Block (6 storeys or more)",
        id: "a65918aa-e441-bc34-e49d-fa8671f768da",
        name: "1-93 Pitcairn House",
      },
      {
        type: "NA",
        id: "656feda1-896f-b136-da84-163ee4f1be6c",
        name: "Hackney Homes Limited",
      },
    ],
  },
  assetAddress: {
    uprn: "100023022306",
    postPreamble: "",
    addressLine1: "12 PITCAIRN HOUSE",
    addressLine2: "ST THOMASS SQUARE",
    addressLine3: "HACKNEY",
    addressLine4: "LONDON",
    postCode: "E9 6PT",
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
  assetCharacteristics: {
    numberOfBedrooms: 2,
    numberOfLifts: 1,
    numberOfLivingRooms: 1,
    windowType: "DBL",
    yearConstructed: "2077",
    numberOfSingleBeds: 1,
    numberOfDoubleBeds: 1,
    numberOfFloors: 2,
    totalBlockFloors: 5,
    heating: "FCB",
    propertyFactor: "4.5",
    architecturalType: "PRE45MR-FLT",
  },
  tenure: {
    id: "35ffe2a1-ee7f-c09d-df11-c065d97fa7d0",
    paymentReference: "7647012704",
    type: "Secure",
    startOfTenureDate: "2005-08-29T00:00:00Z",
    endOfTenureDate: "2028-04-03T00:00:00Z",
    isActive: true,
  },
};

export interface ValidChildAsset extends Asset {
  isAssetCautionaryAlerted: boolean;
  isActive: boolean;
  assetStatus: null;
  assetContract: null;

  assetManagement: {
    agent: string;
    areaOfficeName: string;
    isCouncilProperty: boolean;
    managingOrganisation: string;
    managingOrganisationId: string;
    owner: string;
    isTMOManaged: boolean;
    propertyOccupiedStatus: string;
    isNoRepairsMaintenance: boolean;
    isTemporaryAccommodation: boolean;
  };
}

export const testValidChildAssetFixture: ValidChildAsset[] = [
  {
    id: "77ec7c49-1ec5-0ef5-bd51-3fbccce7e96e",
    assetId: "00049158",
    assetType: "LettableNonDwelling",
    isAssetCautionaryAlerted: false,
    rentGroup: RentGroup.HRA,
    assetAddress: {
      uprn: "00049158",
      addressLine1: "Gge 12 Pitcairn House St Thomass Square",
      addressLine2: "Hackney",
      addressLine3: "London",
      addressLine4: "",
      postCode: "E9 6PT",
      postPreamble: "",
    },
    tenure: {
      id: "1d7e6192-5697-51c1-760b-593a9e61303b",
      paymentReference: "3749158504",
      startOfTenureDate: "2020-07-06T00:00:00",
      endOfTenureDate: "2021-07-05T00:00:00",
      type: "Private Garage",
      isActive: true,
    },
    rootAsset: "ROOT",
    isActive: false,
    parentAssetIds: "2d13b5cb-baf2-91fd-c231-8c5c2ee9548c",
    assetCharacteristics: {
      numberOfBedrooms: 2,
      numberOfLifts: 1,
      numberOfLivingRooms: 1,
      windowType: "DBL",
      yearConstructed: "2077",
      numberOfSingleBeds: 1,
      numberOfDoubleBeds: 1,
      numberOfFloors: 2,
      totalBlockFloors: 5,
      heating: "FCB",
      propertyFactor: "4.5",
      architecturalType: "PRE45MR-FLT",
    },
    assetManagement: {
      agent: "Hackney Homes",
      areaOfficeName: "Homerton (1) Panel Area Team",
      isCouncilProperty: true,
      managingOrganisation: "London Borough of Hackney",
      managingOrganisationId: "c01e3146-e630-c2cd-e709-18ef57bf3724",
      owner: "LBH",
      isTMOManaged: false,
      propertyOccupiedStatus: "OC",
      isNoRepairsMaintenance: false,
      isTemporaryAccommodation: false,
    },
    assetStatus: null,
    assetLocation: {
      floorNo: "0",
      totalBlockFloors: 10,
      parentAssets: [],
    },
    assetContract: null,
  },
];
