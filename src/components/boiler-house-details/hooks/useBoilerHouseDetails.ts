import { useEffect, useState } from "react";

import { Asset, getAsset } from "@mtfh/common/lib/api/asset/v1";

export const useBoilerHouseDetails = (asset: Asset) => {
  const [isLoading, setIsLoading] = useState(false);

  const [boilerHouseAsset, setBoilerHouseAsset] = useState<Asset | null>(null);

  const assetHasBoilerHouse = () =>
    asset.boilerHouseId !== "" && asset.boilerHouseId !== undefined;

  useEffect(() => {
    // no boilerHouse to fetch
    if (!assetHasBoilerHouse()) {
      // in case of state change
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getAsset(asset.boilerHouseId)
      .then((res) => {
        setBoilerHouseAsset(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.boilerHouseId]);

  return {
    isLoading,
    boilerHouseAsset,
    assetHasBoilerHouse,
  };
};
