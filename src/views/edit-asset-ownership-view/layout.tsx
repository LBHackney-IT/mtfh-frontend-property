import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { EditAssetOwnershipForm } from "../../components/edit-asset-ownership-form";
import { locale } from "../../services";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

interface EditAssetOwnershipLayoutProps {
  asset: Asset;
}

export const EditAssetOwnershipLayout = ({ asset }: EditAssetOwnershipLayoutProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  return (
    <>
      <Link as={RouterLink} to={`/property/${asset.id}`} variant="back-link">
        Back to asset
      </Link>

      {showSuccess && (
        <StatusBox
          variant="success"
          data-testid="ownership-edit-success"
          // @ts-ignore No overload matches this call
          title={
            <span>
              {locale.lbhOwnershipInformation.editLbhOwnershipSuccessMessage}.{" "}
              <Link as={RouterLink} to={`/property/${asset.id}`}>
                View property
              </Link>
            </span>
          }
        />
      )}

      <h1 className="lbh-heading-h1">Edit asset ownership</h1>

      {requestError && (
        <ErrorSummary
          id="patch-asset-error"
          data-testid="ownership-edit-failure"
          title={locale.lbhOwnershipInformation.editOwnershipPatchError}
          description={locale.errors.tryAgainOrContactSupport}
        />
      )}

      <EditAssetOwnershipForm
        setShowSuccess={setShowSuccess}
        setRequestError={setRequestError}
        asset={asset}
      />
    </>
  );
};
