import React, { useEffect, useState } from "react";
// @ts-ignore
import SortableTree from "react-sortable-tree";

import { ValidChildAsset } from "../../utils/test-fixtures";
import {
  TreeAsset,
  addChildrenAssets,
  addParentsAndPrinciple,
  generatePrinciple,
} from "./property-tree-utils";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";

import "react-sortable-tree/style.css";

interface PropertyTreeProps {
  asset: Asset;
  childAssets: Asset[] | ValidChildAsset[] | undefined;
}

export const PropertyTree = ({ asset, childAssets }: PropertyTreeProps): JSX.Element => {
  const excludedTreeAssets = "656feda1-896f-b136-da84-163ee4f1be6c"; // Hackney Homes

  const [treeViewData, setTreeViewData] = useState<TreeAsset[]>([]);
  const childNodes = addChildrenAssets(childAssets);
  const principle = generatePrinciple(asset, childNodes);

  useEffect(() => {
    setTreeViewData(
      addParentsAndPrinciple(asset, childNodes, excludedTreeAssets, principle),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = (treeData: TreeAsset[]) => {
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
