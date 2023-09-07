import { Asset } from "@mtfh/common/lib/api/asset/v1";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "./styles.scss";

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
  asset: Asset;
}

export const EditAssetOwnershipForm = ({ setShowSuccess, setRequestError, asset }: Props) => {

  const [isCouncilProperty, setIsCouncilProperty] = useState<boolean>(asset.assetManagement.isCouncilProperty)


  const handleRadioButton = (value: boolean) => {
    setIsCouncilProperty(value)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.alert('Send request')
  }

  return (
    <div>
      <form onSubmit={(e) => handleFormSubmit(e)}>
        <div className="govuk-form-group lbh-form-group">
          <fieldset className="govuk-fieldset" aria-describedby="edit-ownership-hint">
            <legend className="govuk-label lbh-label">Is this asset property of Hackney Council?</legend>
            <div className="govuk-radios lbh-radios">
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="is-council-property-yes"
                  name="is-council-property"
                  type="radio"
                  value="Yes"
                  checked={isCouncilProperty === true}
                  onChange={() => handleRadioButton(true)}
                />
                <label className="govuk-label govuk-radios__label" htmlFor="is-council-property-yes">
                  <span className="govuk-heading-s govuk-!-margin-bottom-1">
                    Yes
                  </span>
                  For properties bla bla bla (to be edited)
                </label>
              </div>
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="is-council-property-no"
                  name="is-council-property"
                  type="radio"
                  value="No"
                  checked={isCouncilProperty === false}
                  onChange={() => handleRadioButton(false)}
                />
                <label className="govuk-label govuk-radios__label" htmlFor="is-council-property-no">
                  <span className="govuk-heading-s govuk-!-margin-bottom-1">
                    No
                  </span>
                  For properties bla bla bla (to be edited)
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="edit-ownership-form-actions">
          <button
            className="govuk-button lbh-button"
            data-module="govuk-button"
            type="submit"
            id="submit-edit-ownership-button"
            disabled={isCouncilProperty === asset.assetManagement.isCouncilProperty}
          >
            Confirm change
          </button>
          <RouterLink
            to={`/property/${asset.id}`}
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
            id="cancel-edit-ownership-button"
          >
            Cancel
          </RouterLink>
        </div>
      </form>
    </div>
  );
};
