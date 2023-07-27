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
                id: childrenAsset.id,
                name: childrenAsset.assetAddress.addressLine1,
                type: childrenAsset.assetType
            })
        )
    }
    return allRelatedAssets;
}