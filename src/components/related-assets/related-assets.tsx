import React, { useEffect, useState } from "react";

import { RelatedAssetGroup } from "./related-asset-group";
import { RelatedAsset } from "./types";
import { getAllRelatedAssets, organiseRelatedAssetsByType } from "./utils";

import { Asset, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { Center, Spinner } from "@mtfh/common/lib/components";

interface RelatedAssetsProps {
  parentAssets: ParentAsset[];
  childrenAssets: Asset[] | undefined;
  loading: boolean;
}

export const RelatedAssets = (props: RelatedAssetsProps) => {
  const { parentAssets, childrenAssets, loading } = props;

  const [relatedAssets, setRelatedAssets] = useState<RelatedAsset[]>([]);
  const [relatedAssetsByType, setRelatedAssetsByType] = useState<any>(undefined);

  useEffect(() => {
    if (parentAssets?.length && childrenAssets) {
      setRelatedAssets(getAllRelatedAssets(parentAssets, childrenAssets));
    }
  }, [parentAssets, childrenAssets]);

  useEffect(() => {
    if (relatedAssets.length) {
      const assetsByType = organiseRelatedAssetsByType(relatedAssets);

      setRelatedAssetsByType(assetsByType);
    }
  }, [relatedAssets]);


  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (relatedAssets.length || !relatedAssetsByType) {
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
