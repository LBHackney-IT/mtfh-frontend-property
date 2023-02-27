import React from "react";

import { Asset } from "@mtfh/common/lib/api/asset/v1";

export interface CurrentAddressProperties {
    assetDetails: Asset;
    heading: string;
    readonly: boolean;
}

export const AddressDetails = ({
    assetDetails,
    heading = 'Address details',
    readonly = false
}: CurrentAddressProperties): JSX.Element => {
    return (
        <>
            <h3 className="lbh-heading-h3">{heading}</h3>

            <p>{JSON.stringify(assetDetails)}</p>

            <p>{JSON.stringify(readonly)}</p>
        </>
    );
};
