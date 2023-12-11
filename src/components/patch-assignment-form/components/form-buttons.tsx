import React from "react";

export const CancelReassignmentButton = ({
  onClick,
}: {
  onClick: Function;
}): JSX.Element => {
  return (
    <button
      data-testid="cancel-reassignment-button"
      className="govuk-button lbh-button"
      style={{ marginTop: 0, backgroundColor: "red" }}
      type="button"
      onClick={() => onClick()}
    >
      Cancel
    </button>
  );
};

export const EditAssignmentButton = ({ onClick }: { onClick: Function }): JSX.Element => {
  return (
    <button
      data-testid="edit-assignment-button"
      className="govuk-button lbh-button"
      style={{ marginTop: 0 }}
      type="button"
      onClick={() => onClick()}
    >
      Edit
    </button>
  );
};

interface ConfirmReassignmentButtonProps {
  onClick: Function;
  enabled: boolean;
}
export const ConfirmReassignmentButton = ({
  onClick,
  enabled,
}: ConfirmReassignmentButtonProps): JSX.Element => {
  return (
    <button
      disabled={!enabled}
      data-testid="confirm-reassignment-button"
      className="govuk-button lbh-button"
      style={{ marginTop: 0, marginRight: "1rem" }}
      onClick={() => onClick()}
    >
      Confirm
    </button>
  );
};
