import { PatchAssetFormValues } from "./types";

import {
  Asset,
  AssetAddress,
  EditAssetAddressRequest,
} from "@mtfh/common/lib/api/asset/v1";
import { EditTenureParams, Tenure } from "@mtfh/common/lib/api/tenure/v1";

export const getTenureVersionNumber = (tenureApiObj: Tenure | undefined) =>
  tenureApiObj?.etag?.toString() ? tenureApiObj.etag.toString() : "0";

// the toString() prevents a version with a potential valid value of Number 0 from being seen as 'falsy'
export const getAssetVersionNumber = (assetDetails: Asset) =>
  assetDetails?.versionNumber?.toString() ? assetDetails.versionNumber.toString() : null;

export const buildEditAssetAddressRequest = (
  formValues: PatchAssetFormValues,
  assetDetails: Asset,
): EditAssetAddressRequest => ({
  assetAddress: {
    uprn: assetDetails.assetAddress.uprn,
    addressLine1: formValues.addressLine1,
    addressLine2: formValues.addressLine2 ? formValues.addressLine2 : "",
    addressLine3: formValues.addressLine3 ? formValues.addressLine3 : "",
    addressLine4: formValues.addressLine4 ? formValues.addressLine4 : "",
    postCode: formValues.postcode,
    postPreamble: assetDetails.assetAddress.postPreamble,
  },
});

export const buildEditTenureRequest = (
  formValues: PatchAssetFormValues,
  assetDetails: Asset,
  tenureApiObject: Tenure | undefined,
): EditTenureParams => {
  const tenureVersionNumber = getTenureVersionNumber(tenureApiObject);

  return {
    tenuredAsset: {
      id: assetDetails.id,
      type: assetDetails.assetType,
      fullAddress: `${formValues.addressLine1} ${formValues.postcode}`,
      uprn: assetDetails.assetAddress.uprn,
      propertyReference: assetDetails.assetId,
    },
    etag: `${tenureVersionNumber}`,
    id: tenureApiObject?.id ?? "",
  };
};

export const buildAssetAddress = (
  editAssetAddressRequest: EditAssetAddressRequest,
  assetDetails: Asset,
): AssetAddress => ({
  addressLine1: editAssetAddressRequest.assetAddress.addressLine1,
  addressLine2: editAssetAddressRequest.assetAddress.addressLine2,
  addressLine3: editAssetAddressRequest.assetAddress.addressLine3,
  addressLine4: editAssetAddressRequest.assetAddress.addressLine4,
  postCode: editAssetAddressRequest.assetAddress.postCode,
  postPreamble: assetDetails.assetAddress.postPreamble,
  uprn: assetDetails.assetAddress.uprn,
});
