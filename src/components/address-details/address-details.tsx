import React from "react";

import { Asset } from "@mtfh/common/lib/api/asset/v1";

export interface CurrentAddressProperties {
    assetDetails: Asset;
    heading: string;
    readOnly: boolean;
}

export const AddressDetails = ({
    assetDetails,
    heading = 'Address details',
    readOnly = false
}: CurrentAddressProperties): JSX.Element => {
    return (
        <>
            <h3 className="lbh-heading-h3">{heading}</h3>

            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="address-line-one">
                    Address line 1*
                </label>
                <input
                    className="govuk-input lbh-input"
                    id="address-line-one-input"
                    name="address-line-one"
                    type="text"
                    required
                    value={assetDetails.assetAddress.addressLine1}
                    disabled={readOnly}
                />
            </div>
            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="address-line-two">
                    Address line 2
                </label>
                <input
                    className="govuk-input lbh-input"
                    id="address-line-two-input"
                    name="address-line-two"
                    type="text"
                    value={assetDetails.assetAddress.addressLine2}
                    disabled={readOnly}
                />
            </div>
            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="address-line-three">
                    Address line 3
                </label>
                <input
                    className="govuk-input lbh-input"
                    id="address-line-three-input"
                    name="address-line-three"
                    type="text"
                    value={assetDetails.assetAddress.addressLine3}
                    disabled={readOnly}
                />
            </div>
            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="address-line-three">
                    Address line 4
                </label>
                <input
                    className="govuk-input lbh-input"
                    id="address-line-three-input"
                    name="address-line-three"
                    type="text"
                    value={assetDetails.assetAddress.addressLine4}
                    disabled={readOnly}
                />
            </div>
            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="town">
                    Town
                </label>
                <input
                    className="govuk-input lbh-input"
                    id="town-input"
                    name="town"
                    type="text"
                    required
                    disabled={readOnly}
                />
            </div>
            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="postcode">
                    Postcode
                </label>
                <input
                    className="govuk-input lbh-input"
                    id="postcode-input"
                    name="postcode"
                    type="text"
                    required
                    value={assetDetails.assetAddress.postCode}
                    disabled={readOnly}
                />
            </div>
        </>
    );
};
