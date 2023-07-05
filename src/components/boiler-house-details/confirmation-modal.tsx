import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";
import { PatchAssetRequest, patchAsset } from "../add-boiler-house-form/utils";

import { Asset, useAsset } from "@mtfh/common/lib/api/asset/v1";
import {
  Button,
  Center,
  Dialog,
  DialogActions,
  Heading,
  Link,
  Spinner,
} from "@mtfh/common/lib/components";

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
