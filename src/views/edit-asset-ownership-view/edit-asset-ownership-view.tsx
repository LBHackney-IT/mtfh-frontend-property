import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";
import { EditAssetOwnershipLayout } from "./layout";

import { isAuthorisedForGroups } from "@mtfh/common";
import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";

export const EditAssetOwnershipView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);

  if (!isAuthorisedForGroups(assetAdminAuthGroups)) {
    return (
      <ErrorSummary
        id="unauthorized-error"
        title={locale.errors.noAddressEditPermissions}
      />
    );
  }

  if (assetRequest.error) {
    return (
      <ErrorSummary
        id="property-error"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.tryAgainOrContactSupport}
      />
    );
  }

  if (asset === undefined) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return <EditAssetOwnershipLayout asset={asset} />;
};
