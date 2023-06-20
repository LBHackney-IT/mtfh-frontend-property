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

  const showTenureInformation = isDwellingOrLettableNonDwelling(asset);
  const showCautionaryAlerts = isDwellingOrLettableNonDwelling(asset);
  const enableNewProcesses = isDwellingOrLettableNonDwelling(asset);

  return (
    <AssetLayout
      assetDetails={asset}
      assetChildren={childAssetResponse?.childAssets}
      showTenureInformation={showTenureInformation}
      showCautionaryAlerts={showCautionaryAlerts}
      enableNewProcesses={enableNewProcesses}
    />
  );
};
