import React from "react";

import { RelatedAsset } from "./related-asset";
import { RelatedAsset as IRelatedAsset } from "./utils";

export interface RelatedAssetGroupProps {
  assetType: string;
  relatedAssets: IRelatedAsset[];
}

export const RelatedAssetGroup = ({
  assetType,
  relatedAssets,
}: RelatedAssetGroupProps) => {
  const getAssetTypeHeading = () => {
    return assetType.charAt(assetType.length - 1).toLowerCase() === "s"
      ? assetType
      : `${assetType}s`;
  };

  return (
    <section>
      <p className="lbh-body-m">{getAssetTypeHeading()}</p>
      <div className="mtfh-card-list" data-testid="related-asset-items-group">
        {relatedAssets.map((relatedAsset) => (
          <RelatedAsset relatedAsset={relatedAsset} key={relatedAsset.id} />
        ))}
      </div>
    </section>
  );
};
