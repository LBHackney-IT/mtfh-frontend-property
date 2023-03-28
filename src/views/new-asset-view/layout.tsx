import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { NewAsset } from "../../components/new-asset-form";
import { locale } from "../../services";
import { useUserFeedback } from "../../services/hooks/useUserFeedback";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

// import "./styles.scss";

export const NewPropertyLayout = (): JSX.Element => {
  const [newProperty, setNewProperty] = useState<Asset | null>();

  const {
    showSuccess,
    setShowSuccess,
    showError,
    setShowError,
    errorHeading,
    setErrorHeading,
    errorDescription,
    setErrorDescription,
  } = useUserFeedback();

  return (
    <>
      <Link as={RouterLink} to="#" variant="back-link">
        Back
      </Link>
      <h1 className="lbh-heading-h1">New property</h1>

      {showSuccess && (
        <StatusBox variant="success" title={locale.assets.newPropertyAddedSuccessMessage}>
          {
            // Only include link if visible on MMH
            (newProperty?.assetType === "Dwelling" ||
              newProperty?.assetType === "LettableNonDwelling") && (
              <div>
                {" "}
                <Link as={RouterLink} to={`/property/${newProperty?.id}`}>
                  View property
                </Link>{" "}
              </div>
            )
          }
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
