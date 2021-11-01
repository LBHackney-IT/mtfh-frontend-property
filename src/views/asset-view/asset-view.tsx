import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { AssetLayout } from "./layout";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";
export const AssetView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);

  if (assetRequest.error) {
    return (
      <ErrorSummary
        id="property-error"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
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
        <AssetLayout assetDetails={asset} />
      ) : (
        <h1>{locale.assetCouldNotBeLoaded}</h1>
      )}
    </>
  );
};
