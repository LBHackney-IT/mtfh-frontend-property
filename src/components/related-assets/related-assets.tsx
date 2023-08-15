import React, { useEffect, useState } from "react";

import { RelatedAssetGroup } from "./related-asset-group";
import { RelatedAsset, getAllRelatedAssets, organiseRelatedAssetsByType } from "./utils";

import { Asset, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, Spinner } from "@mtfh/common/lib/components";

interface RelatedAssetsProps {
  parentAssets: ParentAsset[];
  childrenAssets: Asset[];
  loading: boolean;
}

export const RelatedAssets = (props: RelatedAssetsProps) => {
  const { parentAssets, childrenAssets, loading } = props;

  const [relatedAssets, setRelatedAssets] = useState<RelatedAsset[]>([]);
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
