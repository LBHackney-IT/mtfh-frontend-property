import React from "react";
import { useParams } from "react-router-dom";
import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, Spinner } from "@mtfh/common/lib/components";
import { AssetEditLayout } from "./layout";

export const AssetEditView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);

  if (!asset) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
        <AssetEditLayout assetDetails={asset} />
    </>
  )
};
