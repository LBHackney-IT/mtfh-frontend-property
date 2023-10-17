import React, { useState } from "react";
import { BrowserRouter, Link as RouterLink } from "react-router-dom";

import { PatchAssignmentForm } from "../../components/patch-assignment-form";

import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

export const ManagePatchesLayout = ({ assetId }: { assetId: string | undefined }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  return (
    <>
      <BrowserRouter>
        {assetId ? (
          <Link as={RouterLink} to={`/property/${assetId}`} variant="back-link">
            Back to property
          </Link>
        ) : (
          <Link as={RouterLink} to="/search" variant="back-link">
            Back to search
          </Link>
        )}
      </BrowserRouter>

      {showSuccess && assetId && (
        <StatusBox
          variant="success"
          // @ts-ignore No overload matches this call
          title={
            <span>
              The patches have been updated successfully.{" "}
              <Link as={RouterLink} to={`/property/${assetId}`} variant="back-link">
                Back to property
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
