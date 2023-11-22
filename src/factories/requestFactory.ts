import { v4 as uuidv4 } from "uuid";

import { NewPropertyFormData } from "../components/new-asset-form/schema";
import { managingOrganisations } from "../components/new-asset-form/utils/managing-organisations";

import { CreateNewAssetRequest, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { Patch } from "@mtfh/common/lib/api/patch/v1";

export const assembleCreateNewAssetRequest = (
  values: NewPropertyFormData,
  patch: Patch,
) => {
  const asset: CreateNewAssetRequest = {
    id: uuidv4(),
    assetId: values.propertyReference,
    areaId: getParentId(patch),
    patchId: getPatchId(patch),
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
      postCode: values.postcode,
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

const getAreaName = (patch: Patch): string => {
  if (patch.name === "HN10" || patch.name === "HN11" || patch.name === "HN2") {
    return "HN1 Area";
  }
  if (patch.name !== "HN10" && patch.name !== "HN11" && patch.name !== "HN2") {
    return "HN2 Area";
  }

  const first2 = patch.name.slice(0, 2);
  console.log(first2);
  return `${first2} Area`;
};

const getParentId = (patch: Patch): string => {
  getAreaName(patch);
  //to do - get the parentId based on the name given. - need to test
  console.log(`parentId${patch.parentId}`);
  return patch.parentId;
};

const getPatchId = (patch: Patch): string => {
  return patch.id;
};
