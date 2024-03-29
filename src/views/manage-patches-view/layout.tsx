import React, { useState } from "react";
import { BrowserRouter, Link as RouterLink } from "react-router-dom";

import { PatchAssignmentForm } from "../../components/patch-assignment-form";

import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

export const ManagePatchesLayout = ({ assetId }: { assetId: string | undefined }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const backLink = assetId ? `/property/${assetId}` : "/search";
  const backLinkText = assetId ? "Back to property" : "Back to search";

  return (
    <>
      <BrowserRouter>
        <Link as={RouterLink} to={backLink} variant="back-link" data-testid="back-link">
          {backLinkText}
        </Link>
      </BrowserRouter>
      {showSuccess && (
        <StatusBox variant="success" title="The update has completed successfully">
          <BrowserRouter>
            <Link as={RouterLink} to={backLink} variant="back-link">
              {backLinkText}
            </Link>
          </BrowserRouter>
        </StatusBox>
      )}

      <h1 className="lbh-heading-h1">Patches and areas</h1>

      {requestError && (
        <ErrorSummary
          id="patch-asset-error"
          title="Error"
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
