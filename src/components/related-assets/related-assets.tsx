import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Link, LinkBox, LinkOverlay } from "@mtfh/common/lib/components";
import { SearchCard } from "@mtfh/search";

import { RelatedAsset as IRelatedAsset } from "views/related-assets-view/utils";

export interface RelatedAssetsProps {
  assetType: string;
  relatedAssets: IRelatedAsset[];
}

export const RelatedAssets = ({ assetType, relatedAssets }: RelatedAssetsProps) => {
  const getAssetTypeHeading = () => {
    if (assetType.charAt(assetType.length - 1).toLowerCase() === "s") {
      return assetType;
    }
    if (assetType === "NA") {
      return "N/A";
    }
    return `${assetType}s`;
  };

  const renderRelatedAssets = () => {
    return relatedAssets.map((relatedAsset) => {
      return <RelatedAsset relatedAsset={relatedAsset} key={relatedAsset.id} />;
    });
  };

  return (
    <section>
      <p className="lbh-body-m">{getAssetTypeHeading()}</p>
      <div className="mtfh-card-list" data-testid="related-asset-items-group">
        {renderRelatedAssets()}
      </div>
    </section>
  );
};

export interface RelatedAssetProps {
  relatedAsset: IRelatedAsset;
}

export const RelatedAsset = ({ relatedAsset }: RelatedAssetProps) => {
  return (
    <LinkBox data-testid="related-asset">
      <SearchCard>
        <LinkOverlay>
          <Link
            className="mtfh-search-tenure__title"
            as={RouterLink}
            to={`/property/${relatedAsset.id}`}
            variant="text-colour"
          >
            {relatedAsset.name}
          </Link>
        </LinkOverlay>
      </SearchCard>
    </LinkBox>
  );
};
