import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { RelatedAssets } from "../../components/related-assets/related-assets";
import { RelatedAsset, getAllRelatedAssets, organiseRelatedAssetsByType } from "./utils";
import { Asset, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { Link } from "@mtfh/common/lib/components";
import { Center, Spinner } from "@mtfh/common/lib/components";


interface RelatedAssetsLayoutProps {
  asset: Asset;
  parentAssets: ParentAsset[];
  childrenAssets: Asset[] | undefined;
  loading: boolean
}

export const RelatedAssetsLayout = ({
  asset,
  parentAssets,
  childrenAssets,
  loading
}: RelatedAssetsLayoutProps): JSX.Element => {
  const [relatedAssets, setRelatedAssets] = useState<RelatedAsset[]>([]);
  const [relatedAssetsByType, setRelatedAssetsByType] = useState<any>(undefined);

  useEffect(() => {
    if (parentAssets && parentAssets.length && childrenAssets) {
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

  const renderRelatedAssets = () => {
    if (loading) {
      return (
        <Center>
          <Spinner />
        </Center>
      );
    }

    // If we have related assets and the relatedAssetsByType object we render RelatedAssets components for each Asset type
    if (assetHasRelatedAssets() && relatedAssetsByType) {
      return Object.keys(relatedAssetsByType).map((assetType) => {
        return (
          <React.Fragment key={assetType}>
            <RelatedAssets
              assetType={assetType}
              relatedAssets={relatedAssetsByType[assetType]}
            />
            <hr style={{ borderTop: "1px solid #e7eaec" }} />
          </React.Fragment>
        );
      });
    }
  };

  return (
    <>
      <Link as={RouterLink} to={`/property/${asset.id}`} variant="back-link">
        Back to asset view
      </Link>
      <h1 className="lbh-heading-h1">Related assets</h1>
      <h2 className="lbh-heading-h2">
        Property: {asset.assetAddress.addressLine1} - {asset.assetAddress.postCode}
      </h2>
      <hr style={{ borderTop: "1px solid #e7eaec" }} />

      {renderRelatedAssets()}
    </>
  );
};
