import { sortAddressGeneric } from "../../utils/sortAddressGeneric";
import { RelatedAsset } from "./types";

import { Asset, ParentAsset } from "@mtfh/common/lib/api/asset/v1";

// This methods outputs a unique list of related assets, all in the same format (RelatedAsset interface)
export const getAllRelatedAssets = (
  parentAssets: ParentAsset[],
  childrenAssets: Asset[] = [],
) => {
  const allRelatedAssets: RelatedAsset[] = parentAssets;

  if (childrenAssets?.length) {
    const formattedChildrenAssets = childrenAssets.map((childrenAsset) => ({
      type: childrenAsset.assetType,
      id: childrenAsset.id,
      name: childrenAsset.assetAddress.addressLine1,
    }));

    allRelatedAssets.push(...formattedChildrenAssets);
  }

  return allRelatedAssets;
};

export const organiseRelatedAssetsByType = (
  relatedAssets: RelatedAsset[],
): { [key: string]: RelatedAsset[] } => {
  const assetsByType: { [key: string]: RelatedAsset[] } = {};

  // Define how many asset types we're dealing with
  const uniqueAssetTypes = new Set<string>(relatedAssets.map((x) => x.type));

  // If present, move "Dwelling" to last (so dwellings appear below other asset types)
  if (uniqueAssetTypes.has("Dwelling")) {
    uniqueAssetTypes.delete("Dwelling");
    uniqueAssetTypes.add("Dwelling");
  }

  // For each AssetType, create a array of RelatedAsset[]
  uniqueAssetTypes.forEach((uniqueAssetType) => {
    const sameTypeAssets: RelatedAsset[] = relatedAssets.filter(
      (x) => x.type === uniqueAssetType,
    );

    sortAddressGeneric(sameTypeAssets, "name");

    // Create new key in object for given AssetType, value will be an array related assets of that type
    assetsByType[uniqueAssetType] = sameTypeAssets;
  });

  return assetsByType;
};
