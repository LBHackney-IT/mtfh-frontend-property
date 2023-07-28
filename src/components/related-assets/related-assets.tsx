import React from "react";
import { Link, LinkBox, LinkOverlay } from "@mtfh/common/lib/components";
import { Link as RouterLink } from "react-router-dom";
import { SearchCard } from "@mtfh/search";
import { RelatedAsset } from "views/related-assets-view/utils";

export interface RelatedAssetsProps {
    assetType: string;
    relatedAssets: RelatedAsset[];
}

export const RelatedAssets = ({
    assetType,
    relatedAssets
}: RelatedAssetsProps) => {

    const renderRelatedAssets = () => {
        relatedAssets.map((relatedAsset => {
            return (
                <>
                    {JSON.stringify(relatedAsset)}
                </>
            )
        }))
    }

    return (
        <>
            <p className="lbh-body-m">Assets of type {assetType}</p>
            {/* {renderRelatedAssets()} */}
            {JSON.stringify(relatedAssets)}
        </>
    )
}