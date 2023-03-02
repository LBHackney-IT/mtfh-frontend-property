import React from "react";

import { AssetAddress } from "@mtfh/common/lib/api/asset/v1";

import "../styles.scss";

export interface ReferenceAddressProperties {
    assetAddressDetails: AssetAddress
}

export const ReferenceAddress = ({
    assetAddressDetails,
}: ReferenceAddressProperties): JSX.Element => {

    return (
        <>
            <h3 className="lbh-heading-h3">Current address</h3>

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
                    value={assetAddressDetails.addressLine1}
                    disabled={true}
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
                    value={assetAddressDetails.addressLine2}
                    disabled={true}
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
                    value={assetAddressDetails.addressLine3}
                    disabled={true}
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
                    value={assetAddressDetails.addressLine4}
                    disabled={true}
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
                    value={assetAddressDetails.postCode}
                    disabled={true}
                />
            </div>
        </>
    );
};
