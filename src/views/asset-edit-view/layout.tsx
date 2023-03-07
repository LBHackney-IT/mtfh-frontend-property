import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { EditableAddress } from "../../components/edit-asset-address-form/editable-address";
import { ReferenceAddress } from "../../components/edit-asset-address-form/reference-address";
import { locale } from "../../services";

import { Address, getAddressViaUprn } from "@mtfh/common/lib/api/address/v1";
import { Asset, AssetAddress } from "@mtfh/common/lib/api/asset/v1";
import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

import "./styles.scss";

export interface AssetEditLayoutProperties {
  assetDetails: Asset;
}

export const AssetEditLayout = ({
  assetDetails,
}: AssetEditLayoutProperties): JSX.Element => {
  const [currentAssetAddress, setCurrentAssetAddress] = useState<AssetAddress>(
    assetDetails.assetAddress,
  );
  const [llpgAddress, setLlpgAddress] = useState<Address | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAddressViaUprn(assetDetails.assetAddress.uprn).then((searchAddressResponse) => {
      if (searchAddressResponse.addresses) {
        setLlpgAddress(searchAddressResponse.addresses[0]);
      }
    });
  }, []);

  return (
    <>
      <Link as={RouterLink} to={`/property/${assetDetails.id}`} variant="back-link">
        Back to asset
      </Link>
      <h1 className="lbh-heading-h1">Edit property address</h1>
      <span className="govuk-caption-m lbh-caption">
        New Addresses are suggested from the Local Gazetteer to bring some
        standardisation.
      </span>

      {showSuccess && (
        <StatusBox
          variant="success"
          title={locale.assets.patchAssetAddressSuccessMessage}
        />
      )}

      {showError && (
        <ErrorSummary
          id="patch-asset-error"
          title={locale.errors.unableToPatchAsset}
          description={errorMessage || undefined}
        />
      )}

      <div className="mtfh-address-details">
        <section>
          <EditableAddress
            llpgAddress={llpgAddress}
            assetDetails={assetDetails}
            setCurrentAssetAddress={setCurrentAssetAddress}
            setShowError={setShowError}
            setErrorMessage={setErrorMessage}
            setShowSuccess={setShowSuccess}
          />
        </section>
        <section>
          <ReferenceAddress assetAddressDetails={currentAssetAddress} />
        </section>
      </div>
    </>
  );
};
