import { useState } from "react";

import { Asset, PatchAssetRequest, patchAsset } from "@mtfh/common/lib/api/asset/v1";

export const useConfirmRemoveModal = (asset: Asset) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveBoilerHouse = () => {
    if (isLoading) return;

    const request: PatchAssetRequest = {
      boilerHouseId: "",
    };

    setIsLoading(true);

    patchAsset(asset.id, request, asset?.versionNumber?.toString() || "")
      .then(() => {
        setShowModal(false);
        // useAsset doesn't always update
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
