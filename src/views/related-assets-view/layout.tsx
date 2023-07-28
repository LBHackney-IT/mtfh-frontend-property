import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mtfh/common/lib/components";
import { Asset, GetAssetRelationshipsResponse, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { RelatedAssets } from "../../components/related-assets/related-assets";
import { RelatedAsset, getAllRelatedAssets, organiseRelatedAssetsByType } from "./utils";

interface RelatedAssetsLayoutProps {
    asset: Asset;
    parentAssets: ParentAsset[];
    childrenAssets: Asset[] | undefined;
}

export const RelatedAssetsLayout = ({
    asset,
    parentAssets,
    childrenAssets
}: RelatedAssetsLayoutProps): JSX.Element => {
    const [relatedAssets, setRelatedAssets] = useState<RelatedAsset[]>([]);
    const [relatedAssetsByType, setRelatedAssetsByType] = useState<any>(undefined);
    const [showError, setShowError] = useState<boolean>(false);
    const [errorHeading, setErrorHeading] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    useEffect(() => {
        if (parentAssets && parentAssets.length && childrenAssets) {
            setRelatedAssets(getAllRelatedAssets(parentAssets, childrenAssets));
        }
    }, [parentAssets, childrenAssets]);

    useEffect(() => {
        if (relatedAssets.length) {
            let assetsByType = organiseRelatedAssetsByType(relatedAssets)
            setRelatedAssetsByType(assetsByType)
            console.log({ assetsByType });
        }
    }, [relatedAssets]);

    const renderRelatedAssetsByType = () => {
        return Object.keys(relatedAssetsByType).map((assetType, index) => {
            return (
                <RelatedAssets
                    assetType={assetType}
                    relatedAssets={relatedAssetsByType[assetType]}
                    key={index}
                />
            )
        })
    }

    // {/* SHOW ERROR IF:
    //         NO CHILDREN ASSETS RETRIEVED (REQ FAILS)
    //         NO CHILDREN ASSETS FOR THIS ASSET (EMPTY ARRAY RETURNED)
    //         NO PARENT ASSET FOR THIS ASSET (parentAssets IS AN EMPTY ARRAY)
    //         {showError && (
    //             <ErrorSummary
    //                 id="patch-asset-error"
    //                 title={errorHeading || ""}
    //                 description={errorDescription || undefined}
    //             />
    //         )} */}

    return (
        <>
            <Link as={RouterLink} to="#" variant="back-link">
                Back
            </Link>
            <h1 className="lbh-heading-h1">Related assets</h1>
            <h2 className="lbh-heading-h2">Property: {asset.assetAddress.addressLine1} - {asset.assetAddress.postCode}</h2>


            {relatedAssetsByType &&
                <>
                    {renderRelatedAssetsByType()}
                </>
            }

        </>
    );
};
