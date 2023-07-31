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
                    <LinkBox>
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
        <section id="related-assets-by-type" data-testid="related-assets-by-type">
            <p className="lbh-body-m">{getAssetTypeHeading()}</p>
            <div className="mtfh-card-list" data-testid="related-asset-items">
                {renderRelatedAssets()}
            </div>
        </section>
    )
}