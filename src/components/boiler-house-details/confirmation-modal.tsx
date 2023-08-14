import React, { useState } from "react";

import { locale } from "../../services";

import { Asset, PatchAssetRequest, patchAsset } from "@mtfh/common/lib/api/asset/v1";
import { Button, Dialog, DialogActions, Link } from "@mtfh/common/lib/components";

interface Props {
  asset: Asset;
  showModal: boolean;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
}

export const ConfirmationModal = ({ showModal, setShowModal, asset }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (isLoading) return;

    const request: PatchAssetRequest = {
      boilerHouseId: "",
    };

    setIsLoading(true);

    patchAsset(asset.id, request, asset?.versionNumber?.toString() ?? "")
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

  return (
    <Dialog
      isOpen={showModal}
      onDismiss={() => setShowModal(false)}
      title={locale.boilerHouseDetails.modal.heading}
    >
      <DialogActions>
        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          data-testid="confirm-remove-modal-button"
        >
          Remove
        </Button>
        <Link as="button" type="button" onClick={() => setShowModal(false)}>
          Cancel
        </Link>
      </DialogActions>
    </Dialog>
  );
};
