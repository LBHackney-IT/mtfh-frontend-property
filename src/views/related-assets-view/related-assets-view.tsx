import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { RelatedAssetsLayout } from "./layout";

import { useAsset, useChildAssets } from "@mtfh/common/lib/api/asset/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";

export const RelatedAssetsView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);
  const { data: childAssetResponse, ...childAssetRequest } = useChildAssets(assetId);

  if (assetRequest.error) {
    return (
      <ErrorSummary
        id="property-error"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.tryAgainOrContactSupport}
      />
    );
  }

  if (childAssetRequest.error) {
    return (
      <ErrorSummary
        id="cannot-fetch-children-error"
        title={locale.errors.unableToFetchAssetChildren}
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
      <RelatedAssetsLayout
        asset={asset}
        parentAssets={asset.assetLocation.parentAssets}
        childrenAssets={childAssetResponse?.childAssets}
        loading={childAssetResponse ? false : true}
      />
    </>
  );
};
