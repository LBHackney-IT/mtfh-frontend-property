import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { SearchCard } from "../../search/components/search-card";
import { RelatedAsset as IRelatedAsset } from "./utils";

import { Link, LinkBox, LinkOverlay } from "@mtfh/common/lib/components";

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
