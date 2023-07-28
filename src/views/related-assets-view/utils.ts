import { Asset, ParentAsset } from "@mtfh/common/lib/api/asset/v1";

export interface RelatedAsset {
    id: string;
    name: string;
    type: string;
}

// This methods outputs a unique list of related assets, all in the same format (RelatedAsset interface)
export const getAllRelatedAssets = (parentAssets: ParentAsset[], childrenAssets: Asset[] = []) => {
    let allRelatedAssets: RelatedAsset[] = [];

    if (parentAssets.length) {
        parentAssets.forEach(parentAsset => allRelatedAssets.push(parentAsset))
    }

    if (childrenAssets && childrenAssets.length) {
        childrenAssets.forEach(childrenAsset =>
            allRelatedAssets.push({
                type: childrenAsset.assetType,
                id: childrenAsset.id,
                name: childrenAsset.assetAddress.addressLine1
            })
        )
    }
    return allRelatedAssets;
}

export const organiseRelatedAssetsByType = (relatedAssets: RelatedAsset[]) => {
    let assetsByType: { [key: string]: RelatedAsset[] } = {};

    // Define how many asset types we're dealing with
    let uniqueAssetTypes = new Set<string>([]);
    relatedAssets.forEach(relatedAsset => uniqueAssetTypes.add(relatedAsset.type))

    // For each AssetType, create a array of RelatedAsset[]
    uniqueAssetTypes.forEach(uniqueAssetType => {
        let sameTypeAssets: RelatedAsset[] = [];

        relatedAssets.forEach(relatedAsset => {
            if (uniqueAssetType == relatedAsset.type) sameTypeAssets.push(relatedAsset)
        })

        // Create new key in object for given AssetType, value will be an array related assets of that type
        assetsByType[uniqueAssetType] = sameTypeAssets;
    })

    // Return an array that contains multiple arrays of RelatedAsset[]
    return assetsByType;
}