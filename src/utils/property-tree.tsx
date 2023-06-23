import React from "react";
// @ts-ignore
import SortableTree from "react-sortable-tree";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";

import "react-sortable-tree/style.css";
import { ValidChildAsset } from "test-fixtures";

interface PropertyTreeProps {
  asset: Asset;
  childAssets: Asset[] | ValidChildAsset[] | undefined;
}

export const PropertyTree = (props: PropertyTreeProps): JSX.Element => {
  const { asset, childAssets } = props;

  const excludedTreeAssets = "656feda1-896f-b136-da84-163ee4f1be6c"; // Hackney Homes

  const childNodes = [];

  // Add children
  if (childAssets) {
    for (const [i, v] of childAssets.entries()) {
      if (i < 5) {
        childNodes.push(generateNode(v.assetAddress.addressLine1, [], v.id));
        continue;
      }
      if (i === 5) {
        childNodes.push({ title: "<< MORE.... >>", children: [] });
        continue;
      }
      if (i > 5) {
        continue;
      }
    }
  }

  const treeData: Array<JSX.Element> = [];

  //Generate principle
  const principle = generatePrinciple(asset, childNodes);

  // Add parents and principle
  addParentsAndPrinciple(asset, excludedTreeAssets, principle, treeData);

  const onChangeHander = (e: Event) => {
    console.log(e);
  };
  return (
    <div style={{ height: 300 }}>
      <SortableTree treeData={treeData} onChange={onChangeHander} isVirtualized={false} />
    </div>
  );
};

const generateNode = (name: string, childList: Array<JSX.Element>, id: string) => {
  const node = (
    <a className="lbh-link govuk-link" href={`/property/${id}`}>
      {name}
    </a>
  );

  return { title: node, children: [childList] };
};
function generatePrinciple(
  asset: Asset,
  childNodes: (
    | { title: JSX.Element; children: JSX.Element[][] }
    | { title: string; children: never[] }
  )[],
) {
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

function addParentsAndPrinciple(
  asset: Asset,
  excludedTreeAssets: string,
  principle: {
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
  },
  treeData: any[],
) {
  if (asset.assetLocation.parentAssets) {
    const validParents = asset.assetLocation.parentAssets.filter(
      (el) => !excludedTreeAssets.includes(el.id),
    );

    for (const [i, v] of validParents.entries()) {
      // Attach princple to last parent
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
  }
}