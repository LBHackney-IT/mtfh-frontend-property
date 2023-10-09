import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { PatchAssignmentForm } from "../../components/patch-assignment-form";

import { Asset, useAsset } from "@mtfh/common/lib/api/asset/v1";
import {
  Center,
  ErrorSummary,
  Link,
  Spinner,
  StatusBox,
} from "@mtfh/common/lib/components";

export const ManagePatchesLayout = ({ asset }: { asset: Asset | undefined }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Get assetId from cookie "fromAssetId"

  return (
    <>
      {asset ? (
        <Link as={RouterLink} to={`/property/${asset.id}`} variant="back-link">
          Back to asset
        </Link>
      ) : (
        <Link as={RouterLink} to="/search" variant="back-link">
          Back to search
        </Link>
      )}

      {showSuccess && asset && (
        <StatusBox
          variant="success"
          // @ts-ignore No overload matches this call
          title={
            <span>
              The boiler house has been added successfully.{" "}
              <Link as={RouterLink} to={`/property/${asset.id}`}>
                View property
              </Link>
            </span>
          }
        />
      )}

      <h1 className="lbh-heading-h1">Patch reassignment</h1>

      {requestError && (
        <ErrorSummary
          id="patch-asset-error"
          title="Unexpected error"
          description={requestError || undefined}
        />
      )}

      <PatchAssignmentForm
        setShowSuccess={setShowSuccess}
        setRequestError={setRequestError}
      />
    </>
  );
};
