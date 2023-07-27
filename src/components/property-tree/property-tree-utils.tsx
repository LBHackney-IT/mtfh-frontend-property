import React from "react";

import { ValidChildAsset } from "../../utils/test-fixtures";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";

interface TreeAsset {
  title: React.ReactNode;
  children: Array<TreeAsset> | null | { title: string; children: null };
  expanded?: boolean;
}

const addChildrenAssets = (
  childAssets: Asset[] | ValidChildAsset[] | undefined,
  assetGuid: string
): TreeAsset[] => {
  const childrenAssets: TreeAsset[] = [];

  if (childAssets) {
    for (const [childAssetIndex, childAssetValue] of childAssets.entries()) {
      if (childAssetIndex < 3) {
        childrenAssets.push(
          generateNode(childAssetValue.assetAddress.addressLine1, [], childAssetValue.id),
        );
      } else if (childAssetIndex === 3) {
        childrenAssets.push(
          generateRelatedAssetLinkNode(assetGuid)
        );
      } else {
        break;
      }
    }
  }

  return childrenAssets;
};

const generateRelatedAssetLinkNode = (assetGuid: string): TreeAsset => {
  const relatedAssetLinkNode: JSX.Element = (
    <a className="lbh-link govuk-link" href={`/property/related/${assetGuid}`}>
      Search for all related properties…
    </a>
  );

  return { title: relatedAssetLinkNode, children: null, expanded: false };
}

const generateNode = (name: string, childList: TreeAsset[], id: string): TreeAsset => {
  const node = (
    <a className="lbh-link govuk-link" href={`/property/${id}`}>
      {name}
    </a>
  );

  return { title: node, children: childList, expanded: false };
};

const generatePrinciple = (asset: Asset, childNodes: TreeAsset[]): TreeAsset => {
  return {
    title: <span>Hackney</span>,
    children: [
      {
        title: `${asset.assetAddress.addressLine1} (this asset)`,
        children: childNodes,
        expanded: true,
      },
    ],
    expanded: true,
  };
};

const addParentsAndPrinciple = (
  asset: Asset,
  childNodes: TreeAsset[],
  excludedTreeAssets: string,
  principle: TreeAsset,
) => {
  const treeViewElements: TreeAsset[] = [];

  const validParents = asset.assetLocation.parentAssets.filter(
    (el) => !excludedTreeAssets.includes(el.id),
  );

  if (validParents.length) {
    for (const [validParentIndex, validParentValue] of validParents.entries()) {
      // Attach principle to last parent
      if (validParentIndex === validParents.length - 1) {
        principle.title = (
          <a className="lbh-link govuk-link" href={`/property/${validParentValue.id}`}>
            {validParentValue.name}
          </a>
        );
        treeViewElements.push(principle);
      } else {
        treeViewElements.push(
          generateNode(validParentValue.name, [], validParentValue.id),
        );
      }
    }
  } else {
    treeViewElements.push(generatePrinciple(asset, childNodes));
  }

  return treeViewElements;
};

export { TreeAsset, addChildrenAssets, generatePrinciple, addParentsAndPrinciple };
