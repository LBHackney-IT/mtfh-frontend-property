import { v4 as uuidv4 } from "uuid";

import { NewPropertyFormData } from "../components/new-asset-form/schema";
import { managingOrganisations } from "../utils/managing-organisations";

import { CreateNewAssetRequest } from "@mtfh/common/lib/api/asset/v1";

export const assetToCreateAssetAddressRequest = (values: NewPropertyFormData) => {
  const parentAssetIds: string[] = [];
  if (values?.propertyEstate && values.propertyEstate !== "")
    parentAssetIds.push(values.propertyEstate);
  if (values?.propertyBlock && values.propertyBlock !== "")
    parentAssetIds.push(values.propertyBlock);
  if (values?.propertySubBlock && values.propertySubBlock !== "")
    parentAssetIds.push(values.propertySubBlock);

  const asset: CreateNewAssetRequest = {
    id: uuidv4(),
    assetId: values.assetId,
    assetType: values.assetType,
    parentAssetIds: parentAssetIds.join("#"),
    assetLocation: {
      floorNo: values?.floorNo || "",
      totalBlockFloors: values?.totalBlockFloors || 0,
      parentAssets: [],
    },
    assetAddress: {
      uprn: values?.uprn || "",
      addressLine1: values.addressLine1,
      addressLine2: values?.addressLine2 || "",
      addressLine3: values?.addressLine3 || "",
      addressLine4: values?.addressLine4 || "",
      postCode: values.postcode,
      postPreamble: "", // Add postPreamble?
    },
    assetManagement: {
      agent: values?.agent || "",
      areaOfficeName: values?.areaOfficeName || "",
      isCouncilProperty: values.isCouncilProperty === "Yes",
      managingOrganisation: values.managingOrganisation,
      isTMOManaged: values.isTMOManaged === "Yes",
      managingOrganisationId: getManagingOrganisationId(values.managingOrganisation),
    },
    assetCharacteristics: {
      numberOfBedrooms: values?.numberOfBedrooms || 0,
      numberOfLivingRooms: values?.numberOfLivingRooms || 0,
      yearConstructed: values?.yearConstructed?.toString() || "",
      windowType: values?.windowType || "",
      numberOfLifts: values?.numberOfLifts || 0,
    },
  };

  return asset;
};

const getManagingOrganisationId = (managingOrganisation: string) => {
  const match = managingOrganisations.find(
    (org) => org.managingOrganisation === managingOrganisation,
  );
  return match ? match.managingOrganisationId : "";
};
