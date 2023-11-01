import React, { Dispatch, SetStateAction } from "react";

import { switchPatchAssignments } from "../utils/switch-patch-assignments";

import { Patch } from "@mtfh/common/lib/api/patch/v1";
import { Button, Dialog, DialogActions, Link } from "@mtfh/common/lib/components";

interface ConfirmReassignmentDialogProps {
  onSuccess: Function;
  onDialogCancel: Function;
  setRequestError: Dispatch<SetStateAction<string | null>>;
  isOpen: boolean;
  reassigningPatch: Patch;
  switchingWithPatch: Patch;
}

export const ConfirmReassignmentDialog = ({
  onSuccess,
  onDialogCancel,
  setRequestError,
  isOpen,
  reassigningPatch,
  switchingWithPatch,
}: ConfirmReassignmentDialogProps): JSX.Element => {
  const onSwitchAssignmentSuccess = () => onSuccess();
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => {
        onDialogCancel();
      }}
      title="Switch assignment"
    >
      <p data-testid={`reassign-message-${switchingWithPatch.name}`}>
        Reassigning <strong>{reassigningPatch?.responsibleEntities[0].name}</strong> to{" "}
        <strong>{switchingWithPatch?.name}</strong>
      </p>
      <p data-testid={`reassign-message-${reassigningPatch.name}`}>
        Reassigning <strong>{switchingWithPatch?.responsibleEntities[0].name}</strong> to{" "}
        <strong>{reassigningPatch?.name}</strong>
      </p>

      <DialogActions>
        <Button
          data-testid="confirm-reassignment-button"
          onClick={() => {
            if (!reassigningPatch || !switchingWithPatch) return;
            switchPatchAssignments(
              reassigningPatch,
              switchingWithPatch,
              onSwitchAssignmentSuccess,
              setRequestError,
            );
          }}
        >
          Confirm
        </Button>

        <Link
          as="button"
          onClick={() => {
            onDialogCancel();
          }}
        >
          Cancel
        </Link>
      </DialogActions>
    </Dialog>
  );
};
