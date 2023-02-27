import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { locale } from "../../services";

import { Link } from "@mtfh/common/lib/components";

export interface AssetEditLayoutProperties {
    assetDetails: Asset;
}

export const AssetEditLayout = ({ assetDetails }: AssetEditLayoutProperties): JSX.Element => {

    return (
        <>
            <Link as={RouterLink} to={`/property/${assetDetails.id}`} variant="back-link">
                {locale.asset}
            </Link>
            <h3>Asset Edit View</h3>
            <p>{JSON.stringify(assetDetails)}</p>
        </>
    );
};
