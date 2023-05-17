console.log('Test');

// interface Asset {
//     id: string;
//     assetType: string;
//     addressLine1: string;
// }

// interface RelatedAssetResponse {
//     rootAsset: Asset;
//     parentAssets: Asset[];
//     childrenAssets: Asset[];
// }


const rootAsset = {
    id: "id1",
    addressLine1: "address 1",
    assetType: "Estate"
}

const parentAsset = {
    id: "id2",
    addressLine1: "address 2",
    assetType: "Block"
}

const currentAsset = {
    id: "id3",
    addressLine1: "address 3",
    assetType: "Estate"
}

const childAsset = {
    id: "id4",
    addressLine1: "address 4",
    assetType: "Estate"
}

const relatedAssetResponse = {
    rootAsset: rootAsset,
    parentAssets: [parentAsset, rootAsset],
    childrenAssets: [childAsset]
}

const magicFunction = (relatedAssetResponse) => {

    let topToBottomArray = [];
    let hierarchyLevel = 0;

    // Given a list of related asset (API response) in this case "relatedAssetResponse"

    // 1. We want to understand how many levels we're working with

    // Check that rootAsset parentAssets and childrenAssets are not null
    console.log("Checking asset's relationships")
    if (!relatedAssetResponse.rootAsset && !relatedAssetResponse.parentAssets.length && !relatedAssetResponse.childrenAssets.length) {
        // If all 3 are null, we have no relationship recorded on the database for the current asset, so no property hierarchy available
        console.log('There are no related assets for this asset')
        return;
    } else {
        console.log('Found related assets for this asset')
    }

    // Check parentAssets is not an empty array/has at least one Asset element
    if (relatedAssetResponse.parentAssets.length >= 1) {
        console.log('Checking if rootAsset is included within parentAssets')
        // Check whether parentAssets includes rootAsset, if yes remove it to avoid duplication
        if (relatedAssetResponse.parentAssets.includes(rootAsset)) {
            console.log("rootAsset is included in parentAssets, so it will be removed as it's duplicated")
            relatedAssetResponse.parentAssets = relatedAssetResponse.parentAssets.filter((asset) => { return asset != rootAsset })
        } else {
            console.log('rootAsset is NOT included in parentAssets')
        }
    }

    // If we have a rootAsset, then this will always sit at the top level (level 0)
    if (relatedAssetResponse.rootAsset) {
        let levelKey = `level${hierarchyLevel}`;

        topToBottomArray.push({ levelKey: rootAsset })
    }

    console.log("topToBottomArray", topToBottomArray)


}

magicFunction(relatedAssetResponse);
