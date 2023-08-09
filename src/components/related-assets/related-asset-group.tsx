import React from "react";

import { RelatedAsset } from "./related-asset";
import { RelatedAsset as IRelatedAsset } from "./types";

interface RelatedAssetGroupProps {
  assetType: string;
  relatedAssets: IRelatedAsset[];
}

export const RelatedAssetGroup = (props: RelatedAssetGroupProps) => {
  const { assetType, relatedAssets } = props;

  const headingIsPlural = assetType.charAt(assetType.length - 1).toLowerCase() === "s";

  return (
    <section>
      <p className="lbh-body-m">{headingIsPlural ? assetType : `${assetType}s`}</p>
      <div className="mtfh-card-list" data-testid="related-asset-items-group">
        <>
          {relatedAssets.map((relatedAsset) => (
            <RelatedAsset relatedAsset={relatedAsset} key={relatedAsset.id} />
          ))}
        </>
      </div>
    </section>
  );
};
