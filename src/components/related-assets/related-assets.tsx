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

    const getAssetTypeHeading = () => {
        return assetType.charAt(assetType.length - 1).toLowerCase() == "s" ?
            assetType : `${assetType}s`
    }

    const renderRelatedAssets = () => {
        return relatedAssets.map(((relatedAsset, index) => {
            return (
                <div key={index}>
                    {/* {JSON.stringify(relatedAsset)} */}
                    <LinkBox className="mtfh-search-box">
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
                </div>
            )
        }))
    }

    return (
        <>
            <p className="lbh-body-m">{getAssetTypeHeading()}</p>
            {renderRelatedAssets()}
        </>
    )
}