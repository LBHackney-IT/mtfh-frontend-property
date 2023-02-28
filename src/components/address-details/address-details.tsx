import React from "react";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Field, Form, Formik, useFormikContext } from "formik";
import { AddressDetailsFormData } from "./schema";

export interface AddressDetailsProperties {
    assetDetails: Asset;
    heading: string;
    readOnly: boolean;
}

export const AddressDetails = ({
    assetDetails,
    heading = 'Address details',
    readOnly = false
}: AddressDetailsProperties): JSX.Element => {
    return (
        <>
            <Formik<AddressDetailsFormData>
                initialValues={{
                    addressLine1: assetDetails.assetAddress.addressLine1,
                    addressLine2: assetDetails.assetAddress.addressLine2,
                    addressLine3: assetDetails.assetAddress.addressLine3,
                    addressLine4: assetDetails.assetAddress.addressLine4,
                    postcode: assetDetails.assetAddress.postCode
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    alert(JSON.stringify(values, null, 2));
                }}
            >
                <Form>
                    <h3 className="lbh-heading-h3">{heading}</h3>

                    <label className="govuk-label lbh-label" htmlFor="addressLine1">
                        Address line 1*
                    </label>
                    <Field id="addressLine1" name="addressLine1" className="govuk-input lbh-input" type="text" required disabled={readOnly} />
                    
                    <label className="govuk-label lbh-label" htmlFor="addressLine2">
                        Address line 2
                    </label>
                    <Field id="addressLine2" name="addressLine2" className="govuk-input lbh-input" type="text" required disabled={readOnly} />

                    <label className="govuk-label lbh-label" htmlFor="addressLine3">
                        Address line 3
                    </label>
                    <Field id="addressLine3" name="addressLine3" className="govuk-input lbh-input" type="text" required disabled={readOnly} />

                    <label className="govuk-label lbh-label" htmlFor="addressLine4">
                        Address line 4
                    </label>
                    <Field id="addressLine4" name="addressLine4" className="govuk-input lbh-input" type="text" required disabled={readOnly} />

                    <label className="govuk-label lbh-label" htmlFor="postcode">
                        Postcode
                    </label>
                    <Field id="postcode" name="postcode" className="govuk-input lbh-input" type="text" required disabled={readOnly} />                    
                </Form>
            </Formik>
        </>
    );
};
