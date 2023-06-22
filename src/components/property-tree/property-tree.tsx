import React from "react";
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

  const treeData: JSX.Element[] = [];

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
  };

  const generateNode = (name: string, childList: JSX.Element[], id: string) => {
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
  };

  const addParentsAndPrinciple = (
    asset: Asset,
    childNodes: (
      | { title: JSX.Element; children: JSX.Element[][] }
      | { title: string; children: never[] }
    )[],
    excludedTreeAssets: string,
    principle: AssetWithParentsAndChildren,
    treeData: any[],
  ) => {
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
          treeData.push(principle);
        } else {
          treeData.push(generateNode(v.name, [], v.id));
        }
      }
    } else {
      treeData.push(generatePrinciple(asset, childNodes));
    }
  };

  const childNodes = addChildrenAssets();

  const principle = generatePrinciple(asset, childNodes);

  addParentsAndPrinciple(asset, childNodes, excludedTreeAssets, principle, treeData);

  const onChangeHandler = (e: Event) => {
    console.log(e);
  };

  return (
    <div>
      <SortableTree
        treeData={treeData}
        onChange={onChangeHandler}
        isVirtualized={false}
      />
    </div>
  );
};
