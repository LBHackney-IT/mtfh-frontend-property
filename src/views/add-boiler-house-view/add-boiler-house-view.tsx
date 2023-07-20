import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { AddBoilerHouseLayout } from "./layout";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";
import { assetAdminAuthGroups } from "services/config/config";

export const AddBoilerHouseView = (): JSX.Element => {
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

  return <AddBoilerHouseLayout asset={asset} />;
};
