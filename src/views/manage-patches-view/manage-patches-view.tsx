import React from "react";

import Cookies from "js-cookie";

import { ManagePatchesLayout } from "./layout";

export const ManagePatchesView = (): JSX.Element => {
  const assetId = Cookies.get("fromAssetId");

  return <ManagePatchesLayout assetId={assetId} />;
};
