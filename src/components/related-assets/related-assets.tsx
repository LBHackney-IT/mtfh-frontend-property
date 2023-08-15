import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  RelatedAsset as IRelatedAsset,
  getAllRelatedAssets,
  organiseRelatedAssetsByType,
} from "./utils";

import { Asset, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, Link, LinkBox, LinkOverlay, Spinner } from "@mtfh/common/lib/components";
import { SearchCard } from "@mtfh/search";

interface RelatedAssetsProps {
  parentAssets: ParentAsset[];
  childrenAssets: Asset[];
  loading: boolean;
}

export const RelatedAssets = (props: RelatedAssetsProps) => {
  const { parentAssets, childrenAssets, loading } = props;

  const [relatedAssets, setRelatedAssets] = useState<IRelatedAsset[]>([]);
  const [relatedAssetsByType, setRelatedAssetsByType] = useState<any>(undefined);

  useEffect(() => {
    if (parentAssets?.length || childrenAssets) {
      setRelatedAssets(getAllRelatedAssets(parentAssets, childrenAssets));
    }
  }, [parentAssets, childrenAssets]);

  useEffect(() => {
    if (relatedAssets.length) {
      const assetsByType = organiseRelatedAssetsByType(relatedAssets);
      setRelatedAssetsByType(assetsByType);
    }
  }, [relatedAssets]);

  const assetHasRelatedAssets = (): boolean => {
    return !!relatedAssets.length;
  };

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  // If we have related assets and the relatedAssetsByType object we render RelatedAssets components for each Asset type
  if (assetHasRelatedAssets() && relatedAssetsByType) {
    return (
      <>
        {Object.keys(relatedAssetsByType).map((assetType) => (
          <section key={assetType}>
            <RelatedAssetGroup
              assetType={assetType}
              relatedAssets={relatedAssetsByType[assetType]}
            />
            <hr style={{ borderTop: "1px solid #e7eaec" }} />
          </section>
        ))}
      </>
    );
  }

  return (
    <p className="lbh-body-m" data-testid="no-related-assets-message">
      There are no related assets for this property.
    </p>
  );
};

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
