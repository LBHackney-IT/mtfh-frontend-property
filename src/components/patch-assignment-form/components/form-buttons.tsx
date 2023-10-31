import React, { Dispatch, SetStateAction } from "react";

import { Patch } from "@mtfh/common/lib/api/patch/v1";

export const CancelReassignmentButton = ({
  onClick,
}: {
  onClick: Function;
}): JSX.Element => {
  return (
    <button
      data-testid="cancel-reassignment-button"
      className="govuk-button lbh-button"
      style={{ marginTop: 0 }}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      Cancel
    </button>
  );
};

export const ReassignButton = ({ onClick }: { onClick: Function }): JSX.Element => {
  return (
    <button
      data-testid="reassign-button"
      className="govuk-button lbh-button"
      style={{ marginTop: 0 }}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      Reassign
    </button>
  );
};

interface AssignButtonProps {
  setReassigningPatch: Dispatch<SetStateAction<Patch | null>>;
  reassigningThisEntity: boolean;
  officerName: string;
  onClick: Function;
}
export const AssignButton = ({
  setReassigningPatch,
  reassigningThisEntity,
  officerName,
  onClick,
}: AssignButtonProps) => {
  if (reassigningThisEntity) {
    return <CancelReassignmentButton onClick={() => setReassigningPatch(null)} />;
  }
  return (
    <button
      data-testid="assign-button"
      className="govuk-button lbh-button"
      style={{ marginTop: 0, maxHeight: "2.5em" }}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      Assign {officerName}
    </button>
  );
};
