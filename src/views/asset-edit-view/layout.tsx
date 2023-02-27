import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { locale } from "../../services";

import { Link } from "@mtfh/common/lib/components";
import { AddressDetails } from "../../components/address-details";
export interface AssetEditLayoutProperties {
    assetDetails: Asset;
}

export const AssetEditLayout = ({ assetDetails }: AssetEditLayoutProperties): JSX.Element => {

    return (
        <>
            <Link as={RouterLink} to={`/property/${assetDetails.id}`} variant="back-link">
                {locale.asset}
            </Link>
            <h1 className="lbh-heading-h1">Edit property address</h1>
            <span className="govuk-caption-m lbh-caption">New Addresses are suggested from the Local Gazetteer to bring some standardisation.</span>
            <AddressDetails assetDetails={assetDetails} heading="Suggestion from the Local Gazetteer" readonly={false}/>
            <AddressDetails assetDetails={assetDetails} heading="Current address" readonly={true}/>
        </>
    );
};
