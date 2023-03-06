import React from "react";

import { Field, Form, Formik, useFormikContext } from "formik";
import { Link as RouterLink } from "react-router-dom";
import { EditableAddressFormData, editableAddressSchema } from "./schema";

import { Address } from "@mtfh/common/lib/api/address/v1/types";
import { Center, Spinner } from "@mtfh/common/lib/components";

import "../styles.scss";
import { Asset, AssetAddress, EditAssetAddressRequest } from "@mtfh/common/lib/api/asset/v1/types";
import { patchAsset } from "@mtfh/common/lib/api/asset/v1";
import { locale } from "../../../services";

export interface EditableAddressProperties {
    llpgAddress: Address | null
    assetDetails: Asset
    setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
    setCurrentAssetAddress: React.Dispatch<React.SetStateAction<AssetAddress>>
}

interface PatchAssetFormValues {
    AddressLine1: string
    AddressLine2?: string | undefined
    AddressLine3?: string | undefined
    AddressLine4?: string | undefined
    Postcode: string
}

export const EditableAddress = ({
    llpgAddress,
    assetDetails,
    setShowSuccess,
    setShowError,
    setErrorMessage,
    setCurrentAssetAddress
}: EditableAddressProperties): JSX.Element => {

    if (!llpgAddress) {
        return (
            <Center>
                <Spinner />
            </Center>
        );
    }

    const handleSubmit = async (values: PatchAssetFormValues) => {
        setShowSuccess(false)
        setShowError(false)
        setErrorMessage(null)

        console.log(values)

        const assetAddress: EditAssetAddressRequest = {
            assetAddress:
            {
                uprn: llpgAddress.UPRN.toString(),
                addressLine1: values.AddressLine1,
                addressLine2: values.AddressLine2 ? values.AddressLine2 : "",
                addressLine3: values.AddressLine3 ? values.AddressLine3 : "",
                addressLine4: values.AddressLine4 ? values.AddressLine4 : "",
                postCode: values.Postcode,
                postPreamble: assetDetails.assetAddress.postPreamble
            }
        }

        if (assetDetails?.versionNumber) {
            const assetVersionNumber = assetDetails.versionNumber.toString()

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
                        uprn: assetDetails.assetAddress.uprn
                    }
                    setCurrentAssetAddress(newAssetAddress)
                    setShowSuccess(true)
                })
                .catch(() => {
                    setShowError(true)
                    setErrorMessage(locale.errors.unableToPatchAssetDescription)
                })
        } else {
            setShowError(true)
            setErrorMessage(`Asset "version" invalid (value: ${assetDetails?.versionNumber}). This is a required property when updating the asset. If the issue persists, please contact support.`)
        }
    }

    return (
        <>
            <Formik<EditableAddressFormData>
                initialValues={{
                    AddressLine1: llpgAddress?.line1 ? llpgAddress.line1 : "",
                    AddressLine2: llpgAddress?.line2 ? llpgAddress.line2 : "",
                    AddressLine3: llpgAddress?.line3 ? llpgAddress.line3 : "",
                    AddressLine4: llpgAddress?.town ? llpgAddress.town : "",
                    Postcode: llpgAddress?.postcode ? llpgAddress.postcode : "",
                }}
                validationSchema={editableAddressSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, touched }) => (
                    <div id="edit-address-form">
                        <Form>
                            <h3 className="lbh-heading-h3">Suggestion from the Local Gazetteer</h3>

                            <div className={errors.AddressLine1 && touched.AddressLine1 ? "govuk-form-group govuk-form-group--error lbh-form-group" : "govuk-form-group lbh-form-group"}>
                                <label className="govuk-label lbh-label" htmlFor="addressLine1">
                                    Address line 1*
                                </label>
                                <span
                                    id="addressLine1-input-error"
                                    className="govuk-error-message lbh-error-message"
                                >
                                    <span className="govuk-visually-hidden">Error:</span> {errors.AddressLine1}
                                </span>
                                <Field id="addressLine1" name="AddressLine1" className={errors.AddressLine1 && touched.AddressLine1 ? "govuk-input lbh-input govuk-input--error" : "govuk-input lbh-input"} type="text" />
                            </div>

                            <label className="govuk-label lbh-label" htmlFor="AddressLine2">
                                Address line 2
                            </label>
                            <Field id="AddressLine2" name="AddressLine2" className="govuk-input lbh-input" type="text" />

                            <label className="govuk-label lbh-label" htmlFor="AddressLine3">
                                Address line 3
                            </label>
                            <Field id="AddressLine3" name="AddressLine3" className="govuk-input lbh-input" type="text" />

                            <label className="govuk-label lbh-label" htmlFor="AddressLine4">
                                Address line 4
                            </label>
                            <Field id="AddressLine4" name="AddressLine4" className="govuk-input lbh-input" type="text" />

                            <div className={errors.Postcode && touched.Postcode ? "govuk-form-group govuk-form-group--error lbh-form-group" : "govuk-form-group lbh-form-group"}>
                                <label className="govuk-label lbh-label" htmlFor="postcode">
                                    Postcode
                                </label>
                                <span
                                    id="Postcode-input-error"
                                    className="govuk-error-message lbh-error-message"
                                >
                                    <span className="govuk-visually-hidden">Error:</span> {errors.Postcode}
                                </span>
                                <Field id="postcode" name="Postcode" className={errors.Postcode && touched.Postcode ? "govuk-input lbh-input govuk-input--error" : "govuk-input lbh-input"} type="text" required />
                            </div>

                            <div className="form-actions">
                                <button className="govuk-button lbh-button" data-module="govuk-button" type="submit" id="submit-address-button">
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
