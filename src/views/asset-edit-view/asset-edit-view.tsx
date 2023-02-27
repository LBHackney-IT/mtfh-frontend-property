import React from "react";
import { useParams } from "react-router-dom";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";
import { locale } from "../../services";
import { AssetEditLayout } from "./layout";

export const AssetEditView = (): JSX.Element => {
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
          <AssetEditLayout assetDetails={asset} />
        ) : (
          <h1>{locale.assetCouldNotBeLoaded}</h1>
        )}
      </>
    );
};
