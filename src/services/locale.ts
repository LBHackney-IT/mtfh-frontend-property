import { AssetAddress, AssetType } from "@mtfh/common/lib/api/asset/v1";

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
    assetType: (assetType: AssetType): string => {
      if (assetType === "Dwelling") {
        return "Dwelling";
      }
      if (assetType === "LettableNonDwelling") {
        return "Lettable non-dwelling";
      }
      return assetType;
    },
    patchAssetAddressSuccessMessage: "The asset address has been updated successfully."
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
  static: {
    newProcess: "New Process",
  },
  assetCouldNotBeLoaded: "This property could not be loaded.",
  errors: {
    unableToFetchRecord: "There was a problem retrieving the record",
    assetDoesNotExist: "The property information you've requested does not exist",
    unableToFetchRecordDescription:
      "Please try again. If the issue persists, please contact support.",
    alertTitle: "Error",
    postcodeInvalid: "Please enter a valid postcode",
    unableToPatchAsset: "There was a problem amending this asset",
    unableToPatchAssetInvalidVersion: "The 'version' property is invalid on this asset. This is a required property when updating the asset.",
    unableToPatchAssetDescription:
      "Please refresh the page and try again. If the issue persists, please contact support.",
  },
};
