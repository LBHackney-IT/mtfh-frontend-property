import React from "react";
import { useParams } from "react-router-dom";

import { AddBoilerHouseLayout } from "./layout";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, Spinner } from "@mtfh/common/lib/components";

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

  return <AddBoilerHouseLayout asset={asset} />;
};
