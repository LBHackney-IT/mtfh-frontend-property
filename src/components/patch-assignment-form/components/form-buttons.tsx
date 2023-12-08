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

export const ConfirmReassignmentButton = (): JSX.Element => {
  return (
    <button
      data-testid="confirm-reassignment-button"
      className="govuk-button lbh-button"
      style={{ marginTop: 0, marginRight: "1rem" }}
      type="submit"
      value="Submit"
      onClick={() => {
        console.log("Submitted!");
      }}
    >
      Confirm
    </button>
  );
};
