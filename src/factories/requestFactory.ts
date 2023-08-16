import { v4 as uuidv4 } from "uuid";

import { NewPropertyFormData } from "../components/new-asset-form/schema";
import { managingOrganisations } from "../components/new-asset-form/utils/managing-organisations";

import { CreateNewAssetRequest, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";

export const assembleCreateNewAssetRequest = (
  values: NewPropertyFormData,
  patches: Patch[],
) => {
  const asset: CreateNewAssetRequest = {
    id: uuidv4(),
    assetId: values.assetId,
    assetType: values.assetType,
    parentAssetIds: values?.parentAsset ? getParentAsset(values?.parentAsset).id : "",
    isActive: true,
    assetLocation: {
      floorNo: values?.floorNo ?? "",
      totalBlockFloors: values?.totalBlockFloors ?? null,
      parentAssets: values?.parentAsset ? [getParentAsset(values?.parentAsset)] : [],
    },
    assetAddress: {
      uprn: values?.uprn ?? "",
      postPreamble: values?.postPreamble ?? "",
      addressLine1: values.addressLine1,
      addressLine2: values?.addressLine2 ?? "",
      addressLine3: values?.addressLine3 ?? "",
      addressLine4: values?.addressLine4 ?? "",
      postCode: values.postcode.toUpperCase(),
    },
    assetManagement: {
      agent: values?.agent ?? "",
      areaOfficeName: values?.areaOfficeName ?? "",
      isCouncilProperty: values.isCouncilProperty === "Yes",
      managingOrganisation: values.managingOrganisation,
      isTMOManaged: values.managingOrganisation !== "London Borough of Hackney",
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
    addDefaultSorContracts: values?.addDefaultSorContracts === "Yes",
  };

  return asset;
};

const getManagingOrganisationId = (managingOrganisation: string) => {
  const match = managingOrganisations.find(
    (org) => org.managingOrganisation === managingOrganisation,
  );
  return match ? match.managingOrganisationId : "";
};

const getParentAsset = (parentAsset: string): ParentAsset => {
  // Convert the value from the Parent Asset field from JSON back into an object
  const parentAssetObject = JSON.parse(parentAsset);

  // Use its values to output a new object of the type (ParentAsset) with the correct properties
  return {
    id: parentAssetObject.value,
    name: parentAssetObject.label,
    type: parentAssetObject.assetType,
  };
};
