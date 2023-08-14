import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { AssetLayout } from "./layout";

import { Asset, useAsset, useChildAssets } from "@mtfh/common/lib/api/asset/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";

export const AssetView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);
  const { data: childAssetResponse } = useChildAssets(assetId);

  if (asset?.assetCharacteristics)
    asset.assetCharacteristics.totalBlockFloors =
      asset.assetLocation?.totalBlockFloors ?? null;

  const isDwellingOrLettableNonDwelling = (asset: Asset) => {
    return asset.assetType === "Dwelling" || asset.assetType === "LettableNonDwelling";
  };

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
    <AssetLayout
      assetDetails={asset}
      assetChildren={childAssetResponse?.childAssets}
      showTenureInformation={isDwellingOrLettableNonDwelling(asset)}
      showCautionaryAlerts={isDwellingOrLettableNonDwelling(asset)}
      enableNewProcesses={isDwellingOrLettableNonDwelling(asset)}
    />
  );
};
