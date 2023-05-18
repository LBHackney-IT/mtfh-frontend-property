import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { useEffect } from "react";

interface RelatedAssetsResponse {
    rootAsset: Asset;
    parentAssets: Asset[];
    childrenAssets: Asset[];
}

interface PropertyHierarchyObject {
    level: number;
    assets: Asset[];
}

// Example API response
// const relatedAssetResponse = {
//     rootAsset: rootAsset,
//     parentAssets: [parentAsset, rootAsset],
//     childrenAssets: [childAsset]
// }

export const usePropertyHierarchy = (relatedAssetResponse: RelatedAssetsResponse, currentAsset: Asset) => {

    useEffect(() => {
        const hierarchyArray: PropertyHierarchyObject[] | undefined = generateAssetHierarchyObject(relatedAssetResponse, currentAsset);

        if (hierarchyArray?.length) {
            generatePropertyHierarchyElements(hierarchyArray)
        }
        return () => {
            true
        }
    }, [])


}

const addAssetsToHierarchyLevel = (hierarchyLevel: number, assets: Asset[], hierarchyArray: PropertyHierarchyObject[]) => {
    hierarchyArray.push({ level: hierarchyLevel, assets: assets })
}

const generateAssetHierarchyObject = (relatedAssetResponse: RelatedAssetsResponse, currentAsset: Asset) => {

    const hierarchyArray: PropertyHierarchyObject[] = [];
    let hierarchyLevel = 0;

    // Given a list of related asset (API response) in this case "relatedAssetResponse" we want to add the related assets on multiple levels

    // Check that rootAsset parentAssets and childrenAssets are not null
    if (!relatedAssetResponse.rootAsset && !relatedAssetResponse.parentAssets.length && !relatedAssetResponse.childrenAssets.length) {
        // If all 3 are null, we have no relationship recorded on the database for the current asset, so no property hierarchy available
        console.log('There are no related assets for this asset');
        // halt execution, no related assets to work with
        return;
    } else {
        console.log('Found related assets for this asset');
        // do nothing
    }

    // Check parentAssets is not an empty array/has at least one Asset element
    if (relatedAssetResponse.parentAssets.length >= 1) {
        console.log('Checking if rootAsset is included within parentAssets');
        // Check whether parentAssets includes rootAsset, if yes remove it to avoid duplication (this may lead to parentAsset resulting in an empty array)
        if (relatedAssetResponse.parentAssets.includes(relatedAssetResponse.rootAsset)) {
            console.log("rootAsset is included in parentAssets, so it will be removed as it's duplicated");
            relatedAssetResponse.parentAssets = relatedAssetResponse.parentAssets.filter((asset: Asset) => { return asset != relatedAssetResponse.rootAsset });
        } else {
            console.log('rootAsset is NOT included in parentAssets');
        }
    }

    // If we have a rootAsset, then this will always sit at the top level (level 0)
    if (relatedAssetResponse.rootAsset) {
        const assetsForCurrentLevel = [relatedAssetResponse.rootAsset]
        addAssetsToHierarchyLevel(hierarchyLevel, assetsForCurrentLevel, hierarchyArray)
        hierarchyLevel++;
    }

    // If there is no parent asset (different from rootAsset), current asset will sit one level down from rootAsset (lvl 1)
    if (relatedAssetResponse.parentAssets.length === 0) {
        const assetsForCurrentLevel = [currentAsset]
        addAssetsToHierarchyLevel(hierarchyLevel, assetsForCurrentLevel, hierarchyArray)
        hierarchyLevel++;
    } else if ((relatedAssetResponse.parentAssets.length === 1)) {
        // If there ONE a parent asset (that's not the rootAsset), it will always sit at lvl 1 between rootAsset (lvl 0) and the current asset (lvl 2)
        const assetsForCurrentLevel = [relatedAssetResponse.parentAssets[0]]
        addAssetsToHierarchyLevel(hierarchyLevel, assetsForCurrentLevel, hierarchyArray)
        hierarchyLevel++;

        // And the current asset will sit below it at lvl 2
        addAssetsToHierarchyLevel(hierarchyLevel, [currentAsset], hierarchyArray)
        hierarchyLevel++;
    }

    // REVIEW
    // If there is MORE THAN ONE parent asset (that's not the rootAsset), we need to find which one amongst these is the immediate parent asset
    // A new check for (relatedAssetResponse.parentAssets.length > 1) will need to be added, along with a hierarchy system for all Asset Types

    // REVIEW
    // In the same way as above, we ideally want to find the immediate child or children, so again we'd need a Asset Type hierarchy system
    // The below, currently, just checks if there are any children asset, if yes it adds the first one to the lower/current level.
    if (relatedAssetResponse.childrenAssets.length > 0) {
        const assetsForCurrentLevel = [relatedAssetResponse.childrenAssets[0]]
        addAssetsToHierarchyLevel(hierarchyLevel, assetsForCurrentLevel, hierarchyArray)
        hierarchyLevel++;
    }

    return hierarchyArray;

    // example return
    // hierarchyArray = [
    //     {
    //         level: 0
	// 	       assets: [asset]
    //     },
    //     {
    //         level: 1
	// 	       assets: [asset]
    //     }
    //     {
    //         level: 2
	// 	       assets: [asset, asset, asset]
    //     }
    // ]

}

const generatePropertyHierarchyElements = (hierarchyArray: PropertyHierarchyObject[]) => {

    // Start from last level, generate <TreeviewItem/> elements for assets
    // <TreeviewItem/><TreeviewItem/><TreeviewItem/>

    // Look at second to last level, generate a <TreeviewItem> </TreeviewItem>

    // 

}


export { generateAssetHierarchyObject };
