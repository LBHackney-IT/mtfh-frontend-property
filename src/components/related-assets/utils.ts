import { sortAddressGeneric } from "../../utils/sortAddressGeneric";

import { Asset, ParentAsset } from "@mtfh/common/lib/api/asset/v1";

export interface RelatedAsset {
  id: string;
  name: string;
  type: string;
}

// This methods outputs a unique list of related assets, all in the same format (RelatedAsset interface)
export const getAllRelatedAssets = (
  parentAssets: ParentAsset[],
  childrenAssets: Asset[] = [],
) => {
  const allRelatedAssets: RelatedAsset[] = [];

  if (parentAssets.length) {
    parentAssets.forEach((parentAsset) => allRelatedAssets.push(parentAsset));
  }

  if (childrenAssets?.length) {
    childrenAssets.forEach((childrenAsset) =>
      allRelatedAssets.push({
        type: childrenAsset.assetType,
        id: childrenAsset.id,
        name: childrenAsset.assetAddress.addressLine1,
      }),
    );
  }
  return allRelatedAssets;
};

const removeHackneyHomesRelatedAsset = (relatedAssets: RelatedAsset[]) => {
  const hackneyHomesGuid = "656feda1-896f-b136-da84-163ee4f1be6c";
  return relatedAssets.filter((relatedAsset) => relatedAsset.id !== hackneyHomesGuid);
};

const assetTypeSorter = (a: string, b: string) => {
  // Dwellings should be last
  if (a === "Dwelling" && b !== "Dwelling") return 1;
  if (a !== "Dwelling" && b === "Dwelling") return -1;

  // Default alphabetical sorting
  return a.localeCompare(b);
};

export const organiseRelatedAssetsByType = (relatedAssets: RelatedAsset[]) => {
  const assetsByType: { [key: string]: RelatedAsset[] } = {};

  relatedAssets = removeHackneyHomesRelatedAsset(relatedAssets);

  // Define how many asset types we're dealing with
  const uniqueAssetTypes = [...new Set(relatedAssets.map((x) => x.type))].sort(
    assetTypeSorter,
  );

  // For each AssetType, create a array of RelatedAsset[]
  uniqueAssetTypes.forEach((assetType) => {
    const sameTypeAssets = relatedAssets.filter((x) => x.type === assetType);

    // Sort assets by addressLine1 (name)
    if (sameTypeAssets.length > 1) {
      sortAddressGeneric(sameTypeAssets, "name");
    }

    // Create new key in object for given AssetType, value will be an array related assets of that type
    assetsByType[assetType] = sameTypeAssets;
  });

  // Return an object that contains multiple arrays of RelatedAsset[]
  return assetsByType;
};
