import {
  AssetAddress,
  AssetCharacteristics,
  AssetType,
} from "@mtfh/common/lib/api/asset/v1";

export default {
  backToSearch: "Search results",
  cancel: "Cancel",
  noDataForKey: "N/A",
  assets: {
    assetDetails: {
      address: (assetAddress: AssetAddress): string => {
        const {
          postPreamble,
          addressLine1,
          addressLine2,
          addressLine3,
          addressLine4,
          postCode,
        } = assetAddress;

        return [
          postPreamble,
          addressLine1,
          addressLine2,
          addressLine3,
          addressLine4,
          postCode,
        ]
          .filter((addressLine) => !!addressLine)
          .join(" ");
      },
      newTenure: "New tenure",
    },
    assetCharacteristics: {
      propSpec: (propSpec: AssetCharacteristics): any => {
        const {
          numberOfBedrooms,
          numberOfLifts,
          numberOfLivingRooms,
          windowType,
          yearConstructed,
        } = propSpec;

        return [
          numberOfBedrooms,
          numberOfLifts,
          numberOfLivingRooms,
          windowType,
          yearConstructed,
        ];
      },
    },
    assetType: (assetType: AssetType): string => {
      if (assetType === "Dwelling") {
        return "Dwelling";
      }
      if (assetType === "LettableNonDwelling") {
        return "Lettable non-dwelling";
      }
      return assetType;
    },
    patchAssetAddressSuccessMessage: "The asset address has been updated successfully.",
    newPropertyAddedSuccessMessage: "The new asset address has been successfully added.",
  },
  comments: {
    heading: "Comments",
    addComment: "Add comment",
  },
  repairs: {
    heading: "Repairs",
  },
  tenureDetails: {
    tenureLabel: "Tenure",
    expandedTenureSection: "Tenure details",
    viewTenureButtonLabel: "View tenure",
    assetTypeLabel: "Type",
    assetPaymentReferenceLabel: "Payment reference",
    uprnLabel: "UPRN",
    assetReferenceLabel: "Reference",
    active: "Active",
    isActive: (isActive: boolean): string => (isActive ? "Active" : "Inactive"),
    status: "Status",
    type: "Type",
    startDate: "Start date",
    endDate: "End date",
    noTenure: "No tenure",
    paymentRef: "Payment ref.",
  },
  cautionaryAlerts: {
    cautionaryAlerts: "Cautionary alerts",
    none: "None",
  },
  boilerHouse: {
    boilerHouse: "Boiler house",
  },
  static: {
    newProcess: "New Process",
  },
  assetCharacteristics: {
    numberOfBedroomsLabel: "No. Bedrooms",
    numberOfSingleBedsLabel: "No. Single Beds",
    numberOfDoubleBedsLabel: "No. Double Beds",
    numberOfLiftsLabel: "No. Lifts",
    numberOfLivingRoomsLabel: "No. Living Rooms",
    numberOfFloorsLabel: "No. Floors",
    totalBlockFloorsLabel: "No. Block Floors",
    heatingLabel: "Heating Label",
    windowTypeLabel: "Window Type",
    propertyFactorLabel: "Property Factor",
    yearConstructedLabel: "Year Constructed",
    architecturalTypeLabel: "Architectural Type",
  },
  assetCouldNotBeLoaded: "This property could not be loaded.",
  errors: {
    unableToFetchRecord: "There was a problem retrieving the record",
    assetDoesNotExist: "The property information you've requested does not exist",
    alertTitle: "Error",
    noAddressEditPermissions: "You are not authorized to edit address data",
    noNewAssetPermissions: "You are not authorized to add new assets",
    postcodeInvalid: "Please enter a valid postcode",
    unableToPatchAsset: "There was a problem amending this asset",
    unableToPatchAssetInvalidVersion:
      "The 'version' property is invalid on this asset. This is a required property when updating the asset.",
    unableToCreateNewAsset: "There was a problem creating a new asset",
    tryAgainOrContactSupport:
      "Please refresh the page and try again. If the issue persists, please contact support.",
  },
};
