import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { useEffect, useState } from "react";
import { renderAssetTypeIcon } from "./treeViewItems";
import TreeItem from '@mui/lab/TreeItem';
import React from "react";

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
//      current 
//     childrenAssets: [childAsset]
// }

export const usePropertyHierarchy = (relatedAssetResponse: RelatedAssetsResponse, currentAsset: Asset) => {
    const [propertyHierarchyJsxElements, setPropertyHierarchyJsxElements] = useState<JSX.Element[] | null>(null);

    useEffect(() => {
        const hierarchyArray: PropertyHierarchyObject[] | undefined = generateAssetHierarchyObject(relatedAssetResponse, currentAsset);

        if (hierarchyArray?.length) {
            // If we have a hierarchy array, it means we can generate JSX elements for the tree view
            setPropertyHierarchyJsxElements(generatePropertyHierarchyElements(hierarchyArray))
        }
    }, [])

    return propertyHierarchyJsxElements;
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
}

// example returns for generateAssetHierarchyObject (PropertyHierarchyObjects)
// hierarchyArray = [
//     {
//         level: 0
// 	       assets: [asset]
//     },
//     {
//         level: 1
// 	       assets: [asset]
//     },
//     {
//         level: 2
// 	       assets: [asset, asset, asset]
//     }
// ]

// hierarchyArray = [
//     {
//         level: 0
// 	       assets: [asset]
//     },
//     {
//         level: 1
// 	       assets: [asset]
//     }
// ]

// hierarchyArray = [
// {
//     level: 0,
//        assets: [asset]
// },
// {
//     level: 1,
//        assets: [asset]
// },
// {
//     level: 2,
//        assets: [asset]
// },
// {
//     level: 3,
//        assets: [asset, asset, asset]
// }
// ]

const getPropertyHierarchyObjectByLevel = (hierarchyArray: PropertyHierarchyObject[], level: number): PropertyHierarchyObject => {
    // Find hierarchyObject for a given level
    const hierarchyObject = hierarchyArray.find(hierarchyObject => hierarchyObject.level == level)

    // There's always going to be a match (maybe...)
    return hierarchyObject!;
}

const generateTreeViewJsxElements = (upperLevelHierarchyObject: PropertyHierarchyObject, nestedAssetTreeViewElements: JSX.Element[] | null = null): JSX.Element[] => {
    let assetTreeViewElements: JSX.Element[] = [];

    if (nestedAssetTreeViewElements && nestedAssetTreeViewElements.length) {
        upperLevelHierarchyObject.assets.forEach(asset => {
            const treeViewAssetElement: JSX.Element =
                <div className="tree-view-item">
                    {renderAssetTypeIcon(asset)}
                    <TreeItem nodeId={asset.id} label={asset.assetAddress.addressLine1}>
                        {nestedAssetTreeViewElements}
                    </TreeItem>
                </div>

            assetTreeViewElements.push(treeViewAssetElement);
        })
    } else {
        upperLevelHierarchyObject.assets.forEach(asset => {
            const treeViewAssetElement: JSX.Element =
                <div className="tree-view-item">
                    {renderAssetTypeIcon(asset)}<TreeItem nodeId={asset.id} label={asset.assetAddress.addressLine1} />
                </div>

            assetTreeViewElements.push(treeViewAssetElement);
        })
    }
    return assetTreeViewElements;
}

const determineHierarchyBottomLevel = (hierarchyArray: PropertyHierarchyObject[]): number => {
    // Determine how many levels we're working with (example: levels = [0, 1, 2, 3])
    const levels: number[] = hierarchyArray.map(hierarchyObj => hierarchyObj.level)

    return Math.max(...levels);
}

const generatePropertyHierarchyElements = (hierarchyArray: PropertyHierarchyObject[]): JSX.Element[] => {

    let propertyHierarchyJsxElements: JSX.Element[] = [];

    // Determine bottom level number to start with generateAssetHierarchyObject(the higher the number, the lower the level)
    let currentHierarchyLevel = determineHierarchyBottomLevel(hierarchyArray);

    // Find last level object in hierarchyArray, this will be the PropertyHierarchyObject with the highest level number
    const bottomLevelHierarchyObject: PropertyHierarchyObject = getPropertyHierarchyObjectByLevel(hierarchyArray, currentHierarchyLevel)

    // Start from last level, generate <TreeviewItem/> elements for assets. These will have no children!
    const lowestLevelHierarchyJsxElements = generateTreeViewJsxElements(bottomLevelHierarchyObject)
    propertyHierarchyJsxElements = lowestLevelHierarchyJsxElements;

    // If the next level up is > 0 (not the top level), go one level up (currentHierarchyLevel-1), create new set of JSX elements, overwrite existing JSX elements, and return propertyHierarchyJsxElements.
    // Eventually currentHierarchyLevel will be 1, the code will enter the while loop, currentHierarchyLevel will go to 0 and the JSX elements will also be generated for the top level asset
    while (currentHierarchyLevel > 0) {

        // Go to the upper level
        currentHierarchyLevel -= 1;

        // Get PropertyHierarchyObject for upper level
        const currentLevelHierarchyObject: PropertyHierarchyObject = getPropertyHierarchyObjectByLevel(hierarchyArray, currentHierarchyLevel)

        // Generate JSX tree view elements with nested elements
        const currentLevelHierarchyJsxElement: JSX.Element[] = generateTreeViewJsxElements(currentLevelHierarchyObject, propertyHierarchyJsxElements)
        propertyHierarchyJsxElements = currentLevelHierarchyJsxElement;
    }

    // If currentHierarchyLevel is 0, it means there's no upper level so we return propertyHierarchyJsxElements
    if (currentHierarchyLevel === 0) {
        return propertyHierarchyJsxElements;
    }

    return propertyHierarchyJsxElements;
}

export default usePropertyHierarchy;
