import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mtfh/common/lib/components";
import { AssetAddress, GetAssetRelationshipsResponse, ParentAsset } from "@mtfh/common/lib/api/asset/v1";

export interface RelatedAssetsLayoutProperties {
    assetAddress: AssetAddress;
    parentAssets: ParentAsset[];
    childrenAssets: GetAssetRelationshipsResponse | undefined;
}

export const RelatedAssetsLayout = ({
    assetAddress,
    parentAssets,
    childrenAssets
}: RelatedAssetsLayoutProperties): JSX.Element => {
    const [showError, setShowError] = useState<boolean>(false);
    const [errorHeading, setErrorHeading] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    return (
        <>
            <Link as={RouterLink} to="#" variant="back-link">
                Back
            </Link>
            <h1 className="lbh-heading-h1">Related assets</h1>
            <h2 className="lbh-heading-h2">Property: {assetAddress.addressLine1} - {assetAddress.postCode}</h2>
        </>
    );
};
