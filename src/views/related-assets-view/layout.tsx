import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mtfh/common/lib/components";
import { Asset, GetAssetRelationshipsResponse, ParentAsset } from "@mtfh/common/lib/api/asset/v1";
import { RelatedAssets } from "../../components/related-assets/related-assets";
import { RelatedAsset, getAllRelatedAssets } from "./utils";

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
    const [showError, setShowError] = useState<boolean>(false);
    const [errorHeading, setErrorHeading] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    useEffect(() => {
        setRelatedAssets(getAllRelatedAssets(parentAssets, childrenAssets));
    }, [parentAssets, childrenAssets]);

    return (
        <>
            <Link as={RouterLink} to="#" variant="back-link">
                Back
            </Link>
            <h1 className="lbh-heading-h1">Related assets</h1>
            <p className="govuk-caption-l lbh-caption">{asset.assetAddress.addressLine1} - {asset.assetAddress.postCode}</p>


            {/* SHOW ERROR IF:
            NO CHILDREN ASSETS RETRIEVED (REQ FAILS)
            NO CHILDREN ASSETS FOR THIS ASSET (EMPTY ARRAY RETURNED)
            NO PARENT ASSET FOR THIS ASSET (parentAssets IS AN EMPTY ARRAY)
            {showError && (
                <ErrorSummary
                    id="patch-asset-error"
                    title={errorHeading || ""}
                    description={errorDescription || undefined}
                />
            )} */}

            <section>
                <RelatedAssets />
            </section>
        </>
    );
};
