import React, { useEffect, useState } from "react";

import { Center, Spinner } from "@mtfh/common/lib/components";
import { Asset, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { getAllRelatedAssets, organiseRelatedAssetsByType } from "./utils";
import { RelatedAssetGroup } from "./related-asset-group";
import { RelatedAsset } from "./types";

interface RelatedAssetsProps {
  parentAssets: ParentAsset[];
  childrenAssets: Asset[] | undefined;
  loading: boolean;
}

export const RelatedAssets = (props: RelatedAssetsProps) => {
  const { parentAssets, childrenAssets, loading } = props;

  const [relatedAssets, setRelatedAssets] = useState<RelatedAsset[]>([]);
  const [relatedAssetsByType, setRelatedAssetsByType] = useState<any>(undefined);

  const updateRelatedAssets = React.useCallback(() => {
    if (relatedAssets.length) {
      const assetsByType = organiseRelatedAssetsByType(relatedAssets);

      setRelatedAssetsByType(assetsByType);
    }
  }, [relatedAssets]);

  useEffect(() => {
    if (parentAssets && parentAssets.length && childrenAssets) {
      setRelatedAssets(getAllRelatedAssets(parentAssets, childrenAssets));
    }
  }, [parentAssets, childrenAssets]);

  useEffect(() => {
    updateRelatedAssets();
  }, [relatedAssets]);

  const assetHasRelatedAssets = !!relatedAssets.length;

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!assetHasRelatedAssets || !relatedAssetsByType) {
    return (
      <p className="lbh-body-m" data-testid="no-related-assets-message">
        There are no related assets for this property.
      </p>
    );
  }

  return (
    <>
      {Object.keys(relatedAssetsByType).map((assetType) => (
        <React.Fragment key={assetType}>
          <RelatedAssetGroup
            assetType={assetType}
            relatedAssets={relatedAssetsByType[assetType]}
          />
          <hr style={{ borderTop: "1px solid #e7eaec" }} />
        </React.Fragment>
      ))}
    </>
  );
};
