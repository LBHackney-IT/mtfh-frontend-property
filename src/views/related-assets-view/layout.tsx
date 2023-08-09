import React, { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Link } from "@mtfh/common/lib/components";

import "./styles.scss";

interface RelatedAssetsLayoutProps {
  asset: Asset;
  children: ReactNode;
}

export const RelatedAssetsLayout = (props: RelatedAssetsLayoutProps): JSX.Element => {
  const { asset, children } = props;

  return (
    <>
      <Link as={RouterLink} to={`/property/${asset.id}`} variant="back-link">
        Back to asset view
      </Link>
      <h1 className="lbh-heading-h1" data-testid="related-assets-heading">
        Related assets
      </h1>
      <p className="lbh-body-m" data-testid="property-asset-type">
        {asset.assetType}
      </p>
      <h2 className="lbh-heading-h2 margin-top-10" data-testid="property-address">
        {asset.assetAddress.addressLine1} - {asset.assetAddress.postCode}
      </h2>
      <hr style={{ borderTop: "1px solid #e7eaec" }} />

      {children}
    </>
  );
};
