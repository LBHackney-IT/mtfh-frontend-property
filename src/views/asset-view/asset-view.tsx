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

    // What we have already addresses, data box with time and uprn, cautionary alerts, tenure, processes, repairs, comments and hierarchy. 
  // We won’t need tenure or Cautionary Alerts, or processes. We should have comments or repairs. 

  // {asset.assetType === "Dwelling" || asset.assetType === "LettableNonDwelling" ? (

  const showTenureInformation = asset.assetType === "Dwelling" || asset.assetType === "LettableNonDwelling"
  const showCautionaryAlerts = asset.assetType === "Dwelling" || asset.assetType === "LettableNonDwelling"
  const enableNewProcesses = asset.assetType === "Dwelling" || asset.assetType === "LettableNonDwelling"



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
