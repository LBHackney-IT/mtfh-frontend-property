import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { AssetLayout } from "./layout";

import { useAsset, useChildAssets } from "@mtfh/common/lib/api/asset/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";

export const AssetView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);

  const { data: childAssetResponse } = useChildAssets(assetId);

  if (assetRequest.error) {
    return (
      <ErrorSummary
        id="property-error"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.tryAgainOrContactSupport}
      />
    );
  }

  if (!asset) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      {asset.assetType === "Dwelling" || asset.assetType === "LettableNonDwelling" ? (
        <AssetLayout
          assetDetails={asset}
          assetchildren={childAssetResponse?.childAssets}
        />
      ) : (
        <h1>{locale.assetCouldNotBeLoaded}</h1>
      )}
    </>
  );
};
