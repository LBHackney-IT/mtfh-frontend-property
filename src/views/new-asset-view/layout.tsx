import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { NewAsset } from "../../components/new-asset-form";
import { locale } from "../../services";

import { CreateNewAssetRequest } from "@mtfh/common/lib/api/asset/v1";
import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

export const NewPropertyLayout = (): JSX.Element => {
  const [newProperty, setNewProperty] = useState<CreateNewAssetRequest | null>();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorHeading, setErrorHeading] = useState<string | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);

  return (
    <>
      <Link as={RouterLink} to="#" variant="back-link">
        Back
      </Link>
      <h1 className="lbh-heading-h1">New property</h1>
      <span
        id="new-property-disclaimer"
        className="govuk-hint lbh-hint"
        data-testid="new-property-disclaimer"
      >
        A new property will immediately be available for users of Manage My Home.
        Information is validated in most fields, but all protections are not in place, so
        some selections may result in mismatched information. It is recommended to
        thoroughly check the submission before adding the new asset.{" "}
      </span>
      {showSuccess && (
        <StatusBox variant="success" title={locale.assets.newPropertyAddedSuccessMessage}>
          <div>
            {" "}
            <Link as={RouterLink} to={`/property/${newProperty?.id}`}>
              View property
            </Link>{" "}
          </div>
        </StatusBox>
      )}

      {showError && (
        <ErrorSummary
          id="patch-asset-error"
          title={errorHeading || ""}
          description={errorDescription || undefined}
        />
      )}

      <section>
        <NewAsset
          setShowError={setShowError}
          setErrorHeading={setErrorHeading}
          setErrorDescription={setErrorDescription}
          setShowSuccess={setShowSuccess}
          setNewProperty={setNewProperty}
        />
      </section>
    </>
  );
};
