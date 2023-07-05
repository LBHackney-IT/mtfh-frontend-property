import React, { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { AddBoilerHouseForm } from "../../components/add-boiler-house-form";

import { Asset, useAsset } from "@mtfh/common/lib/api/asset/v1";
import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

interface Props {
  assetId: string;
  asset: Asset;
}

export const AddBoilerHouseLayout = ({ assetId, asset }: Props) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  return (
    <>
      <Link as={RouterLink} to={`/property/${assetId}`} variant="back-link">
        Back to asset
      </Link>

      {showSuccess && (
        <StatusBox
          variant="success"
          title={
            <span>
              The boiler house has been added successfully.{" "}
              <Link as={RouterLink} to={`/property/${assetId}`}>
                Return to property
              </Link>
            </span>
          }
        />
      )}

      <h1 className="lbh-heading-h1">Add boiler house to property</h1>
      <span className="govuk-caption-m lbh-caption">Some subtitle text</span>

      {requestError && (
        <ErrorSummary
          id="patch-asset-error"
          title="Unexpected error"
          description={requestError || undefined}
        />
      )}

      <AddBoilerHouseForm
        setShowSuccess={setShowSuccess}
        setRequestError={setRequestError}
        asset={asset}
        assetId={assetId}
      />
    </>
  );
};
