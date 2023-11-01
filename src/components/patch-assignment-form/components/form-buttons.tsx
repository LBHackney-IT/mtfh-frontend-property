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
      type="button"
      onClick={() => onClick()}
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
      type="button"
      onClick={() => onClick()}
    >
      Reassign
    </button>
  );
};

interface AssignButtonProps {
  reassigningPatch: Patch;
  setReassigningPatch: Dispatch<SetStateAction<Patch | null>>;
  reassigningThisEntity: boolean;
  onClick: Function;
}
export const AssignButton = ({
  reassigningPatch,
  setReassigningPatch,
  reassigningThisEntity,
  onClick,
}: AssignButtonProps) => {
  if (reassigningThisEntity) {
    return <CancelReassignmentButton onClick={() => setReassigningPatch(null)} />;
  }
  const officerName = reassigningPatch.responsibleEntities[0].name;
  return (
    <button
      data-testid="assign-button"
      className="govuk-button lbh-button"
      style={{ marginTop: 0, maxHeight: "2.5em", display: "flex", alignItems: "center" }}
      type="button"
      onClick={() => onClick()}
    >
      Assign {officerName}
    </button>
  );
};
