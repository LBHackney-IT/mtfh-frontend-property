import React, { Component } from "react";
// @ts-ignore
import SortableTree from "react-sortable-tree";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import "react-sortable-tree/style.css";

interface PropertyTreeProps {
  asset: Asset;
  childAssets: Asset[] | undefined;
  parentAssets: Asset[] | undefined;
}

export const PropertyTree = (props: PropertyTreeProps): JSX.Element => {
  const { asset, childAssets, parentAssets } = props;

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

  const treeData = [];

  //Generate principle
  const principle = {
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

  // Add parents and principle
  if (asset.assetLocation.parentAssets) {
    const validParents = asset.assetLocation.parentAssets.filter(
      (el) => !excludedTreeAssets.includes(el.id),
    );

    for (const [i, v] of validParents.entries()) {
      // Attach princple to last parent
      if (i === validParents.length - 1) {
        principle.title = <a href={`/property/${v.id}`}>{v.name}</a>;
        treeData.push(principle);
      } else {
        treeData.push(generateNode(v.name, [], v.id));
      }
    }
  }

  const onChangeHander = (e: Event) => {
    console.log(e);
  };
  return (
    <div style={{ height: 300 }}>
      <SortableTree treeData={treeData} onChange={onChangeHander} />
    </div>
  );
};

const generateNode = (name: string, childList: Array<JSX.Element>, id: string) => {
  const node = <a href={`/property/${id}`}>{name}</a>;

  return { title: node, children: [childList] };
};
