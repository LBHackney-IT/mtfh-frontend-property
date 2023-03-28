import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Field, Form, Formik } from "formik";

import { locale } from "../../../services";
import { EditableAddressFormData, editableAddressSchema } from "./schema";

import { Address } from "@mtfh/common/lib/api/address/v1/types";
import { patchAsset } from "@mtfh/common/lib/api/asset/v1";
import {
  Asset,
  AssetAddress,
  EditAssetAddressRequest,
} from "@mtfh/common/lib/api/asset/v1/types";
import { Center, Spinner } from "@mtfh/common/lib/components";

import "../styles.scss";

export interface Props {
  llpgAddress: Address | null;
  loading: boolean;
  assetDetails: Asset;
  setShowSuccess: (value: boolean) => void;
  setShowError: (value: boolean) => void;
  setErrorHeading: (error: string | null) => void;
  setErrorDescription: (error: string | null) => void;
  setCurrentAssetAddress: (assetAddress: AssetAddress) => void;
}

interface PatchAssetFormValues {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  postcode: string;
}

export const EditableAddress = ({
  llpgAddress,
  loading,
  assetDetails,
  setShowSuccess,
  setShowError,
  setErrorHeading,
  setErrorDescription,
  setCurrentAssetAddress,
}: Props) => {
  const [submitEditEnabled, setSubmitEditEnabled] = useState<boolean>(true);

  const handleSubmit = async (values: PatchAssetFormValues) => {
    setShowSuccess(false);
    setShowError(false);
    setErrorHeading(null);
    setErrorDescription(null);

    const assetAddress: EditAssetAddressRequest = {
      assetAddress: {
        uprn: assetDetails.assetAddress.uprn,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2 ? values.addressLine2 : "",
        addressLine3: values.addressLine3 ? values.addressLine3 : "",
        addressLine4: values.addressLine4 ? values.addressLine4 : "",
        postCode: values.postcode,
        postPreamble: assetDetails.assetAddress.postPreamble,
      },
    };

    // the toString() prevents a version with a potential valid value of Number 0 from being seen as 'falsy'
    const assetVersionNumber = assetDetails?.versionNumber?.toString()
      ? assetDetails.versionNumber.toString()
      : null;

    await patchAsset(assetDetails.id, assetAddress, assetVersionNumber)
      .then(() => {
        // If the update is successful, we update the "Current Address" details (postPreamble and UPRN are unchanged)
        const newAssetAddress: AssetAddress = {
          addressLine1: assetAddress.assetAddress.addressLine1,
          addressLine2: assetAddress.assetAddress.addressLine2,
          addressLine3: assetAddress.assetAddress.addressLine3,
          addressLine4: assetAddress.assetAddress.addressLine4,
          postCode: assetAddress.assetAddress.postCode,
          postPreamble: assetDetails.assetAddress.postPreamble,
          uprn: assetDetails.assetAddress.uprn,
        };
        setCurrentAssetAddress(newAssetAddress);
        setShowSuccess(true);
        setSubmitEditEnabled(false);
      })
      .catch(() => {
        setShowError(true);
        setErrorHeading(locale.errors.unableToPatchAsset);
        setErrorDescription(locale.errors.tryAgainOrContactSupport);
      });
  };

  if (!llpgAddress && loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Formik<EditableAddressFormData>
        initialValues={{
          addressLine1: llpgAddress?.line1 ? llpgAddress.line1 : "",
          addressLine2: llpgAddress?.line2 ? llpgAddress.line2 : "",
          addressLine3: llpgAddress?.line3 ? llpgAddress.line3 : "",
          addressLine4: llpgAddress?.town ? llpgAddress.town : "",
          postcode: llpgAddress?.postcode ? llpgAddress.postcode : "",
        }}
        validationSchema={editableAddressSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ errors, touched }) => (
          <div id="edit-address-form">
            <Form>
              <h3 className="lbh-heading-h3">
                {llpgAddress
                  ? "Suggestion from the Local Gazetteer"
                  : "New address details"}
              </h3>

              <div
                className={
                  errors.addressLine1 && touched.addressLine1
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="addressLine1">
                  Address line 1*
                </label>
                <span
                  id="addressLine1-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span>
                  {errors.addressLine1}
                </span>
                <Field
                  id="addressLine1"
                  name="addressLine1"
                  className={
                    errors.addressLine1 && touched.addressLine1
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="addressLine1"
                />
              </div>

              <label className="govuk-label lbh-label" htmlFor="addressLine2">
                Address line 2
              </label>
              <Field
                id="addressLine2"
                name="addressLine2"
                className="govuk-input lbh-input"
                type="text"
                data-testid="addressLine2"
              />

              <label className="govuk-label lbh-label" htmlFor="addressLine3">
                Address line 3
              </label>
              <Field
                id="addressLine3"
                name="addressLine3"
                className="govuk-input lbh-input"
                type="text"
                data-testid="addressLine3"
              />

              <label className="govuk-label lbh-label" htmlFor="addressLine4">
                Address line 4
              </label>
              <Field
                id="addressLine4"
                name="addressLine4"
                className="govuk-input lbh-input"
                type="text"
                data-testid="addressLine4"
              />

              <div
                className={
                  errors.postcode && touched.postcode
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="postcode">
                  Postcode*
                </label>
                <span
                  id="postcode-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span> {errors.postcode}
                </span>
                <Field
                  id="postcode"
                  name="postcode"
                  className={
                    errors.postcode && touched.postcode
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="postcode"
                />
              </div>

              <div className="edit-asset-form-actions">
                <button
                  className="govuk-button lbh-button"
                  data-module="govuk-button"
                  type="submit"
                  id="submit-address-button"
                  disabled={!submitEditEnabled}
                >
                  Update to this address
                </button>

                <RouterLink
                  to={`/property/${assetDetails.id}`}
                  className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
                >
                  Cancel edit address
                </RouterLink>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};
