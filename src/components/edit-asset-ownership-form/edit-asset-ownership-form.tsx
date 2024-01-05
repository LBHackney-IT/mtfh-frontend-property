import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import locale from "../../services/locale";

import { Center, Spinner } from "@mtfh/common";
import {
  Asset,
  PatchAssetLbhOwnershipRequest,
  patchAsset,
} from "@mtfh/common/lib/api/asset/v1";
import "./styles.scss";

interface EditAssetOwnershipFormProps {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
  asset: Asset;
}

export const EditAssetOwnershipForm = ({
  setShowSuccess,
  setRequestError,
  asset,
}: EditAssetOwnershipFormProps) => {
  const [isCouncilProperty, setIsCouncilProperty] = useState<boolean>(
    asset.assetManagement?.isCouncilProperty,
  );
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRadioButton = (value: boolean) => {
    setIsCouncilProperty(value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { assetManagement } = asset;

    const requestPayload: PatchAssetLbhOwnershipRequest = {
      assetManagement: {
        ...assetManagement,
        isCouncilProperty,
      },
    };

    patchAsset(asset.id, requestPayload, asset?.versionNumber?.toString() ?? "")
      .then(() => {
        setShowSuccess(true);
        setFormSubmitted(true);
      })
      .catch((err) => {
        console.error({ err });
        setRequestError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <form onSubmit={(e) => handleFormSubmit(e)}>
        <div className="govuk-form-group lbh-form-group">
          <fieldset className="govuk-fieldset" aria-describedby="edit-ownership-hint">
            <legend className="govuk-label lbh-label">
              Is this asset property of Hackney Council?
            </legend>
            <div className="govuk-radios lbh-radios">
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="is-council-property-yes"
                  data-testid="is-council-property-yes"
                  name="is-council-property"
                  type="radio"
                  value="Yes"
                  checked={isCouncilProperty === true}
                  onChange={() => handleRadioButton(true)}
                  disabled={formSubmitted}
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor="is-council-property-yes"
                >
                  <span className="govuk-heading-s govuk-!-margin-bottom-1">Yes</span>
                  {locale.lbhOwnershipInformation.editOwnershipFormYesDescription}
                </label>
              </div>
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="is-council-property-no"
                  data-testid="is-council-property-no"
                  name="is-council-property"
                  type="radio"
                  value="No"
                  checked={isCouncilProperty === false}
                  onChange={() => handleRadioButton(false)}
                  disabled={formSubmitted}
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor="is-council-property-no"
                >
                  <span className="govuk-heading-s govuk-!-margin-bottom-1">No</span>
                  {locale.lbhOwnershipInformation.editOwnershipFormNoDescription}
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        {loading && (
          <Center>
            <Spinner />
          </Center>
        )}
        <div className="edit-ownership-form-actions">
          <button
            className="govuk-button lbh-button"
            data-module="govuk-button"
            type="submit"
            id="submit-edit-ownership-button"
            data-testid="submit-edit-ownership-button"
            disabled={
              formSubmitted ||
              isCouncilProperty === asset.assetManagement?.isCouncilProperty
            }
          >
            Confirm change
          </button>
          <RouterLink
            to={`/property/${asset.id}`}
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
            id="cancel-edit-ownership-button"
            data-testid="cancel-edit-ownership-button"
          >
            Back to asset
          </RouterLink>
        </div>
      </form>
    </div>
  );
};
