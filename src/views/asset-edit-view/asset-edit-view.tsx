import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";
import { AssetEditLayout } from "./layout";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";

export const AssetEditView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);

  const tenure = useTenure(asset?.tenure ? asset?.tenure.id : null).data;

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

  if (!isAuthorisedForGroups(assetAdminAuthGroups)) {
    return (
      <ErrorSummary
        id="unauthorized-error"
        title={locale.errors.noAddressEditPermissions}
      />
    );
  }

  return (
    <>
      {asset.assetType === "Dwelling" || asset.assetType === "LettableNonDwelling" ? (
        <AssetEditLayout assetDetails={asset} tenureApiObject={tenure} />
      ) : (
        <h1>{locale.assetCouldNotBeLoaded}</h1>
      )}
    </>
  );
};
