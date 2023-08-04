import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { EditableAddress } from "../../components/edit-asset-address-form/editable-address";
import { ReferenceAddress } from "../../components/edit-asset-address-form/reference-address";
import { locale } from "../../services";

import { Address, getAddressViaUprn } from "@mtfh/common/lib/api/address/v1";
import { Asset, AssetAddress } from "@mtfh/common/lib/api/asset/v1";
import { Tenure } from "@mtfh/common/lib/api/tenure/v1";
import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

import "./styles.scss";

export interface AssetEditLayoutProps {
  assetDetails: Asset;
  tenureApiObject: Tenure | undefined;
}

export const AssetEditLayout = ({
  assetDetails,
  tenureApiObject,
}: AssetEditLayoutProps): JSX.Element => {
  const [currentAssetAddress, setCurrentAssetAddress] = useState<AssetAddress>(
    assetDetails.assetAddress,
  );
  const [llpgAddress, setLlpgAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorHeading, setErrorHeading] = useState<string | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);

  useEffect(() => {
    if (assetDetails.assetAddress.uprn) {
      setLoading(true)
      getAddressViaUprn(assetDetails.assetAddress.uprn)
        .then((searchAddressResponse) => {
          if (searchAddressResponse.addresses) {
            setLlpgAddress(searchAddressResponse.addresses[0]);
          }
        })
        .catch(() => {
          setErrorHeading("Unable to retrieve address suggestion from the Local Gazetteer");
          setErrorDescription(
            "Please refresh the page and try again, otherwise you are still able to edit the blank fields manually.",
          );
          setShowError(true);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetDetails]);

  const renderLlpgSubHeading = () => {
    if (assetDetails.assetAddress.uprn) {
      <span className="govuk-caption-m lbh-caption">
        Addresses are suggested from the Local Gazetteer to bring some
        standardisation.
      </span>
    }
  }

  const renderReferenceAddress = () => {
    if (assetDetails.assetAddress.uprn) {
      return (
        <section>
          <ReferenceAddress assetAddressDetails={currentAssetAddress} />
        </section>
      )
    }
  }

  return (
    <>
      <Link as={RouterLink} to={`/property/${assetDetails.id}`} variant="back-link">
        Back to asset
      </Link>
      <h1 className="lbh-heading-h1">Edit property address</h1>
      {renderLlpgSubHeading()}

      {showSuccess && (
        <StatusBox
          variant="success"
          title={locale.assets.patchAssetAddressSuccessMessage}
        />
      )}

      {showError && (
        <ErrorSummary
          id="patch-asset-error"
          title={errorHeading || ""}
          description={errorDescription || undefined}
        />
      )}

      <div className="mtfh-address-details">
        <section>
          <EditableAddress
            llpgAddress={llpgAddress ? llpgAddress : null}
            currentAddress={currentAssetAddress}
            assetHasUprn={!!assetDetails.assetAddress.uprn}
            loading={loading}
            assetDetails={assetDetails}
            setCurrentAssetAddress={setCurrentAssetAddress}
            setShowError={setShowError}
            setErrorHeading={setErrorHeading}
            setErrorDescription={setErrorDescription}
            setShowSuccess={setShowSuccess}
            tenureApiObject={tenureApiObject}
          />
        </section>
        {renderReferenceAddress()}
      </div>
    </>
  );
};
