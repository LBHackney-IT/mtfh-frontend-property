import React, { useEffect, useState } from "react";
// @ts-ignore
import SortableTree from "react-sortable-tree";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import "react-sortable-tree/style.css";

interface PropertyTreeProps {
  asset: Asset;
  childAssets: Asset[] | undefined;
}

interface AssetWithParentsAndChildren {
  title: JSX.Element;
  children: {
    title: string;
    children: (
      | { title: JSX.Element; children: JSX.Element[][] }
      | { title: string; children: never[] }
    )[];
    expanded: boolean;
  }[];
  expanded: boolean;
}

export const PropertyTree = ({ asset, childAssets }: PropertyTreeProps): JSX.Element => {

  const excludedTreeAssets = "656feda1-896f-b136-da84-163ee4f1be6c"; // Hackney Homes

  // const treeData: Array<JSX.Element> = [];

  const [treeViewData, setTreeViewData] = useState<any>([])

  const addChildrenAssets = () => {
    const childrenAssets = [];

    if (childAssets) {
      for (const [i, v] of childAssets.entries()) {
        if (i < 5) {
          childrenAssets.push(generateNode(v.assetAddress.addressLine1, [], v.id));
          continue;
        }
        if (i === 5) {
          childrenAssets.push({ title: "<< MORE.... >>", children: [] });
          continue;
        }
        if (i > 5) {
          continue;
        }
      }
    }

    return childrenAssets;
  }

  const generateNode = (name: string, childList: Array<JSX.Element>, id: string) => {
    const node = (
      <a className="lbh-link govuk-link" href={`/property/${id}`}>
        {name}
      </a>
    );

    return { title: node, children: [childList] };
  };

  const generatePrinciple = (
    asset: Asset,
    childNodes: (
      | { title: JSX.Element; children: JSX.Element[][] }
      | { title: string; children: never[] }
    )[],
  ): AssetWithParentsAndChildren => {
    if (asset.assetLocation?.parentAssets?.length) {
      return {
        title: <span>Principle</span>,
        children: [
          {
            title: `${asset.assetAddress.addressLine1} (this asset)`,
            children: [...childNodes],
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
          children: [...childNodes],
          expanded: true,
        },
      ],
      expanded: true,
    };
  }

  useEffect(() => {
    addParentsAndPrinciple(asset, childNodes, excludedTreeAssets, principle);
  }, [])

  const addParentsAndPrinciple = (
    asset: Asset,
    childNodes: (
      | { title: JSX.Element; children: JSX.Element[][] }
      | { title: string; children: never[] }
    )[],
    excludedTreeAssets: string,
    principle: AssetWithParentsAndChildren,
  ) => {

    const treeViewElements = []

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
          treeViewElements.push(principle)
        } else {
          treeViewElements.push(generateNode(v.name, [], v.id))
        }
      }
    } else {
      treeViewElements.push(generatePrinciple(asset, childNodes))
    }

    setTreeViewData(treeViewElements)
  }

  const childNodes = addChildrenAssets();

  const principle = generatePrinciple(asset, childNodes);


  const onChangeHandler = (e: Event) => {
    console.log(e);
    setTreeViewData(e);
  };

  return (
    <div>
      <SortableTree treeData={treeViewData} onChange={onChangeHandler} isVirtualized={false} />
    </div>
  );
};