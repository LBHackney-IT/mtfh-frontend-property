import { v4 as uuidv4 } from "uuid";

import { NewPropertyFormData } from "../components/new-asset-form/schema";
import { managingOrganisations } from "../components/new-asset-form/utils/managing-organisations";

import { CreateNewAssetRequest } from "@mtfh/common/lib/api/asset/v1";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";

export const assembleCreateNewAssetRequest = (
  values: NewPropertyFormData,
  patches: Patch[],
) => {
  const parentAssetIds: string[] = getParentAssetsIds(values);

  const asset: CreateNewAssetRequest = {
    id: uuidv4(),
    assetId: values.assetId,
    assetType: values.assetType,
    parentAssetIds: parentAssetIds.join("#"),
    isActive: true,
    assetLocation: {
      floorNo: values?.floorNo ?? "",
      totalBlockFloors: values?.totalBlockFloors ?? null,
      parentAssets: [],
    },
    assetAddress: {
      uprn: values?.uprn ?? "",
      postPreamble: values?.postPreamble ?? "",
      addressLine1: values.addressLine1,
      addressLine2: values?.addressLine2 ?? "",
      addressLine3: values?.addressLine3 ?? "",
      addressLine4: values?.addressLine4 ?? "",
      postCode: values.postcode,
    },
    assetManagement: {
      agent: values?.agent ?? "",
      areaOfficeName: values?.areaOfficeName ?? "",
      isCouncilProperty: values.isCouncilProperty === "Yes",
      managingOrganisation: values.managingOrganisation,
      isTMOManaged: values.isTMOManaged === "Yes",
      managingOrganisationId: getManagingOrganisationId(values.managingOrganisation),
    },
    assetCharacteristics: {
      numberOfBedrooms: values?.numberOfBedrooms ?? null,
      numberOfLivingRooms: values?.numberOfLivingRooms ?? null,
      yearConstructed: values?.yearConstructed?.toString() ?? "",
      windowType: values?.windowType ?? "",
      numberOfLifts: values?.numberOfLifts ?? null,
    },
    patches: patches.length ? patches : undefined,
  };

  return asset;
};

const getManagingOrganisationId = (managingOrganisation: string) => {
  const match = managingOrganisations.find(
    (org) => org.managingOrganisation === managingOrganisation,
  );
  return match ? match.managingOrganisationId : "";
};

const getParentAssetsIds = (formValues: NewPropertyFormData) => {
  const parentAssetIds = [];
  if (formValues?.propertyEstate && formValues.propertyEstate !== "")
    parentAssetIds.push(formValues.propertyEstate);
  if (formValues?.propertyBlock && formValues.propertyBlock !== "")
    parentAssetIds.push(formValues.propertyBlock);

  return parentAssetIds;
};
