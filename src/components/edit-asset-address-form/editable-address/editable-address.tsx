import React from "react";

import { Field, Form, Formik } from "formik";
import { Link as RouterLink } from "react-router-dom";
import { EditableAddressFormData, editableAddressSchema } from "./schema";

import { Address } from "@mtfh/common/lib/api/address/v1/types";
import { Center, Spinner } from "@mtfh/common/lib/components";

import "../styles.scss";

export interface EditableAddressProperties {
    llpgAddress: Address | null
    assetId: string
}

export const EditableAddress = ({
    llpgAddress,
    assetId
}: EditableAddressProperties): JSX.Element => {

    if (!llpgAddress) {
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
                    editableAddressLine1: llpgAddress?.line1 ? llpgAddress.line1 : "",
                    editableAddressLine2: llpgAddress?.line2 ? llpgAddress.line2 : "",
                    editableAddressLine3: llpgAddress?.line3 ? llpgAddress.line3 : "",
                    editableAddressLine4: llpgAddress?.line4 ? llpgAddress.line4 : "",
                    editablePostcode: llpgAddress?.postcode ? llpgAddress.postcode : "",
                }}
                validationSchema={editableAddressSchema}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    alert(JSON.stringify(values, null, 2));
                }}
            >
                {({ errors, touched }) => (
                    <div id="edit-address-form">
                        <Form>
                            <h3 className="lbh-heading-h3">Suggestion from the Local Gazetteer</h3>

                            <label className="govuk-label lbh-label" htmlFor="editableAddressLine1">
                                Address line 1*
                            </label>
                            <Field id="editableAddressLine1" name="editableAddressLine1" className="govuk-input lbh-input" type="text" required disabled />

                            <label className="govuk-label lbh-label" htmlFor="editableAddressLine2">
                                Address line 2
                            </label>
                            <Field id="editableAddressLine2" name="editableAddressLine2" className="govuk-input lbh-input" type="text" />

                            <label className="govuk-label lbh-label" htmlFor="editableAddressLine3">
                                Address line 3
                            </label>
                            <Field id="editableAddressLine3" name="editableAddressLine3" className="govuk-input lbh-input" type="text" />

                            <label className="govuk-label lbh-label" htmlFor="editableAddressLine4">
                                Address line 4 / Town
                            </label>
                            <Field id="editableAddressLine4" name="editableAddressLine4" className="govuk-input lbh-input" type="text" />

                            <div className={!errors.editablePostcode ? "govuk-form-group lbh-form-group" : "govuk-form-group govuk-form-group--error lbh-form-group"}>
                                <label className="govuk-label lbh-label" htmlFor="editablePostcode">
                                    Postcode
                                </label>
                                <span
                                    id="editablePostcode-input-error"
                                    className="govuk-error-message lbh-error-message"
                                >
                                    <span className="govuk-visually-hidden">Error:</span> {errors.editablePostcode}
                                </span>
                                <Field id="editablePostcode" name="editablePostcode" className={!errors.editablePostcode ? "govuk-input lbh-input" : "govuk-input lbh-input govuk-input--error"} type="text" required />
                            </div>

                            <div className="form-actions">
                                <button className="govuk-button lbh-button" data-module="govuk-button" type="submit" id="submit-address-button">
                                    Update to this address
                                </button>

                                <RouterLink
                                    to={`/property/${assetId}`}
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
