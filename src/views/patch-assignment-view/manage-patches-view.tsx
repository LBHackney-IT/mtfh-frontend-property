import React from "react";

import { ManagePatchesLayout } from "./layout";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, Spinner } from "@mtfh/common/lib/components";

export const ManagePatchesView = (): JSX.Element => {
  const assetId = document.cookie
    .split(";")
    .reduce((cookies, cookie) => {
      const [name, value] = cookie.split("=");
      return name.trim() === "fromAssetId" ? decodeURIComponent(value) : cookies;
    })
    .split("=")[1];

  const { data: asset } = useAsset(assetId);

  return <ManagePatchesLayout asset={asset} />;
};
