import { useState } from "react";

import {
  PatchAssetRequest,
  patchAsset,
} from "../../add-boiler-house-form/utils";
import { Asset } from "@mtfh/common/lib/api/asset/v1";

export const useConfirmRemoveModal = (assetId: string, asset: Asset) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveBoilerHouse = () => {
    if (isLoading) return;

    const request: PatchAssetRequest = {
      boilerHouseId: "",
    };

    setIsLoading(true);

    patchAsset(assetId, request, asset?.versionNumber?.toString() || "")
      .then((res) => {
        setShowModal(false);
        // useAsset doesnt always update
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    isLoading,
    setShowModal,
    showModal,
    handleRemoveBoilerHouse,
  };
};
