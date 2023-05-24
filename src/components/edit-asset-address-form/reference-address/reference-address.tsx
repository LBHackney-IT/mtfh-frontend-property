import React from "react";

import { AssetAddress } from "@mtfh/common/lib/api/asset/v1";

import "../styles.scss";

export interface ReferenceAddressProperties {
  assetAddressDetails: AssetAddress;
}

export const ReferenceAddress = ({
  assetAddressDetails,
}: ReferenceAddressProperties): JSX.Element => {
  return (
    <>
      <h3 className="lbh-heading-h3">Current address</h3>

      <div className="govuk-form-group lbh-form-group">
        <label
          className="govuk-label lbh-label grey-text"
          htmlFor="asset-post-preamble-input"
        >
          Post preamble
        </label>
        <input
          className="govuk-input lbh-input"
          id="asset-post-preamble-input"
          name="asset-post-preamble"
          type="text"
          value={assetAddressDetails.postPreamble}
          data-testid="asset-post-preamble"
          disabled
        />
      </div>
      <div className="govuk-form-group lbh-form-group">
        <label
          className="govuk-label lbh-label grey-text"
          htmlFor="asset-address-line-one-input"
        >
          Address line 1
        </label>
        <input
          className="govuk-input lbh-input"
          id="asset-address-line-one-input"
          name="asset-address-line-one"
          type="text"
          value={assetAddressDetails.addressLine1}
          data-testid="asset-address-line-one"
          disabled
        />
      </div>
      <div className="govuk-form-group lbh-form-group">
        <label
          className="govuk-label lbh-label grey-text"
          htmlFor="asset-address-line-two-input"
        >
          Address line 2
        </label>
        <input
          className="govuk-input lbh-input"
          id="asset-address-line-two-input"
          name="asset-address-line-two"
          type="text"
          value={assetAddressDetails.addressLine2}
          data-testid="asset-address-line-two"
          disabled
        />
      </div>
      <div className="govuk-form-group lbh-form-group">
        <label
          className="govuk-label lbh-label grey-text"
          htmlFor="asset-address-line-three"
        >
          Address line 3
        </label>
        <input
          className="govuk-input lbh-input"
          id="asset-address-line-three-input"
          name="asset-address-line-three"
          type="text"
          value={assetAddressDetails.addressLine3}
          data-testid="asset-address-line-three"
          disabled
        />
      </div>
      <div className="govuk-form-group lbh-form-group">
        <label
          className="govuk-label lbh-label grey-text"
          htmlFor="asset-address-line-four-input"
        >
          Address line 4
        </label>
        <input
          className="govuk-input lbh-input"
          id="asset-address-line-four-input"
          name="asset-address-line-four"
          type="text"
          value={assetAddressDetails.addressLine4}
          data-testid="asset-address-line-four"
          disabled
        />
      </div>
      <div className="govuk-form-group lbh-form-group">
        <label className="govuk-label lbh-label grey-text" htmlFor="asset-postcode-input">
          Postcode
        </label>
        <input
          className="govuk-input lbh-input"
          id="asset-postcode-input"
          name="asset-postcode"
          type="text"
          value={assetAddressDetails.postCode}
          data-testid="asset-postcode"
          disabled
        />
      </div>
    </>
  );
};
