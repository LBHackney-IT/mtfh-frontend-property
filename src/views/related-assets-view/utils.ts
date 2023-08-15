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

export const organiseRelatedAssetsByType = (relatedAssets: RelatedAsset[]): Object => {
  const assetsByType: { [key: string]: RelatedAsset[] } = {};

  relatedAssets = removeHackneyHomesRelatedAsset(relatedAssets);

  // Define how many asset types we're dealing with
  const uniqueAssetTypes = new Set<string>([]);
  relatedAssets.forEach((relatedAsset) => uniqueAssetTypes.add(relatedAsset.type));

  // If present, move "Dwelling" to last (so dwellings appear below other asset types)
  if (uniqueAssetTypes.has("Dwelling")) {
    uniqueAssetTypes.delete("Dwelling");
    uniqueAssetTypes.add("Dwelling");
  }

  // For each AssetType, create a array of RelatedAsset[]
  uniqueAssetTypes.forEach((uniqueAssetType) => {
    const sameTypeAssets: RelatedAsset[] = [];

    relatedAssets.forEach((relatedAsset) => {
      if (uniqueAssetType === relatedAsset.type) sameTypeAssets.push(relatedAsset);
    });

    // Sort assets by addressLine1 (name)
    sortAddressGeneric(sameTypeAssets, "name");

    // Create new key in object for given AssetType, value will be an array related assets of that type
    assetsByType[uniqueAssetType] = sameTypeAssets;
  });

  // Return an object that contains multiple arrays of RelatedAsset[]
  return assetsByType;
};
