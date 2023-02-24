import React from "react";

import { Asset } from "@mtfh/common/lib/api/asset/v1";

import { Link } from "@mtfh/common/lib/components";

export interface AssetEditViewProperties {
    assetDetails: Asset;
    setEditAddressModeEnabled(value: boolean): void;
}

export const AssetEditView = ({ assetDetails, setEditAddressModeEnabled }: AssetEditViewProperties): JSX.Element => {

    return (
        <>
            <Link onClick={() => setEditAddressModeEnabled(false)} variant="back-link">Back to asset view</Link>
            <h3>Asset Edit View</h3>
            <p>{JSON.stringify(assetDetails)}</p>
        </>
    );
};
