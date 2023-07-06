import React from "react";

import { Button, Dialog, DialogActions, Link } from "@mtfh/common/lib/components";

interface Props {
  showModal: boolean;
  hideModal: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ConfirmationModal = ({
  showModal,
  hideModal,
  onSubmit,
  isLoading,
}: Props) => {
  return (
    <Dialog
      isOpen={showModal}
      onDismiss={hideModal}
      title="Remove boiler house from property"
    >
      <DialogActions>
        <Button onClick={onSubmit} isLoading={isLoading}>
          Remove
        </Button>
        <Link as="button" type="button" onClick={hideModal}>
          Cancel
        </Link>
      </DialogActions>
    </Dialog>
  );
};
