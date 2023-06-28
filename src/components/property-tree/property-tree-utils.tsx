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
): TreeAsset[] => {
  const childrenAssets: TreeAsset[] = [];

  if (childAssets) {
    for (const [i, v] of childAssets.entries()) {
      if (i < 5) {
        childrenAssets.push(generateNode(v.assetAddress.addressLine1, [], v.id));
      } else if (i === 5) {
        childrenAssets.push({ title: "<< MORE.... >>", children: null });
      } else {
        break;
      }
    }
  }

  return childrenAssets;
};

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
    title: (
      <span>{asset.assetLocation?.parentAssets?.length ? "Principle" : "Hackney"}</span>
    ),
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

  if (asset.assetLocation?.parentAssets?.length) {
    const validParents = asset.assetLocation.parentAssets.filter(
      (el) => !excludedTreeAssets.includes(el.id),
    );

    for (const [i, v] of validParents.entries()) {
      // Attach principle to last parent
      if (i === validParents.length - 1) {
        principle.title = (
          <a className="lbh-link govuk-link" href={`/property/${v.id}`}>
            {v.name}
          </a>
        );
        treeViewElements.push(principle);
      } else {
        treeViewElements.push(generateNode(v.name, [], v.id));
      }
    }
  } else {
    treeViewElements.push(generatePrinciple(asset, childNodes));
  }

  return treeViewElements;
};

export { TreeAsset, addChildrenAssets, generatePrinciple, addParentsAndPrinciple };
