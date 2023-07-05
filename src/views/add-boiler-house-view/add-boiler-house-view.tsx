import React from "react";

import { Center, Spinner } from "@mtfh/common/lib/components";
import { useParams } from "react-router-dom";
import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { AddBoilerHouseLayout } from "./layout";

export const AddBoilerHouseView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset } = useAsset(assetId);

  if (asset === undefined) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return <AddBoilerHouseLayout assetId={assetId} asset={asset} />;
};
