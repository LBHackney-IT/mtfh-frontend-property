import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { AssetEditLayout } from "./layout";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { propertyAuthorizedGroups } from "../../services/config/config";

export const AssetEditView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);

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

  if (!isAuthorisedForGroups(propertyAuthorizedGroups)) {
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
        <AssetEditLayout assetDetails={asset} />
      ) : (
        <h1>{locale.assetCouldNotBeLoaded}</h1>
      )}
    </>
  );
};
