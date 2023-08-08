import React from "react";
import { Link as RouterLink } from "react-router-dom";

export interface FormActionButtonsProps {
  assetGuid: string;
  addressEditSuccessful: boolean;
}

export const FormActionButtons = ({
  assetGuid,
  addressEditSuccessful,
}: FormActionButtonsProps): JSX.Element => {
  if (!addressEditSuccessful) {
    return (
      <>
        <div className="edit-asset-form-actions">
          <button
            className="govuk-button lbh-button"
            data-module="govuk-button"
            type="submit"
            id="submit-address-button"
          >
            Update to this address
          </button>

          <RouterLink
            to={`/property/${assetGuid}`}
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
          >
            Cancel
          </RouterLink>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="form-actions">
        <RouterLink to={`/property/${assetGuid}`} className="govuk-button lbh-button">
          Back to asset view
        </RouterLink>
      </div>
    </>
  );
};
