import React, { useEffect, useState } from "react";
// @ts-ignore
import SortableTree from "react-sortable-tree";

import { ValidChildAsset } from "../../utils/test-fixtures";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import "react-sortable-tree/style.css";

interface PropertyTreeProps {
  asset: Asset;
  childAssets: Asset[] | ValidChildAsset[] | undefined;
}

interface AssetWithParentsAndChildren {
  title: React.ReactNode;
  children: Array<AssetWithParentsAndChildren> | null | { title: string; children: null };
  expanded?: boolean;
}

export const PropertyTree = ({ asset, childAssets }: PropertyTreeProps): JSX.Element => {
  const excludedTreeAssets = "656feda1-896f-b136-da84-163ee4f1be6c"; // Hackney Homes

  const [treeViewData, setTreeViewData] = useState<AssetWithParentsAndChildren[]>([]);

  const addChildrenAssets = (): AssetWithParentsAndChildren[] => {
    const childrenAssets: AssetWithParentsAndChildren[] = [];

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

  const generateNode = (
    name: string,
    childList: AssetWithParentsAndChildren[],
    id: string,
  ): AssetWithParentsAndChildren => {
    const node = (
      <a className="lbh-link govuk-link" href={`/property/${id}`}>
        {name}
      </a>
    );

    return { title: node, children: childList, expanded: false };
  };

  const generatePrinciple = (
    asset: Asset,
    childNodes: AssetWithParentsAndChildren[],
  ): AssetWithParentsAndChildren => {
    if (asset.assetLocation?.parentAssets?.length) {
      return {
        title: <span>Principle</span>,
        children: [
          {
            title: `${asset.assetAddress.addressLine1} (this asset)`,
            children: childNodes,
            expanded: true,
          },
        ],
        expanded: true,
      };
    }

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
    childNodes: AssetWithParentsAndChildren[],
    excludedTreeAssets: string,
    principle: AssetWithParentsAndChildren,
  ) => {
    const treeViewElements: AssetWithParentsAndChildren[] = [];

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

    setTreeViewData(treeViewElements);
  };

  const childNodes = addChildrenAssets();
  const principle = generatePrinciple(asset, childNodes);

  useEffect(() => {
    addParentsAndPrinciple(asset, childNodes, excludedTreeAssets, principle);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = (treeData: AssetWithParentsAndChildren[]) => {
    setTreeViewData(treeData);
  };

  return (
    <div>
      <SortableTree
        treeData={treeViewData}
        onChange={onChangeHandler}
        isVirtualized={false}
      />
    </div>
  );
};
