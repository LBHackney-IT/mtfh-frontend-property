import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { locale } from "../../services";

import { Link } from "@mtfh/common/lib/components";
import { EditableAddress } from "../../components/edit-asset-address-form/editable-address";
import { ReferenceAddress } from "../../components/edit-asset-address-form/reference-address";
import { Address, getAddressViaUprn } from "@mtfh/common/lib/api/address/v1";

import "./styles.scss";



export interface AssetEditLayoutProperties {
    assetDetails: Asset;
}


export const AssetEditLayout = ({ assetDetails }: AssetEditLayoutProperties): JSX.Element => {

    // Call addresses API, pass UPRN of address (assetDetails.assetAddress.uprn) and pass into editable (non readOnly) AddressDetails component
    const [llpgAddress, setLlpgAddress] = useState<Address | null>(null);

    useEffect(() => {
        getAddressViaUprn(assetDetails.assetAddress.uprn).then((searchAddressResponse) => {
            if (searchAddressResponse.addresses) {
                setLlpgAddress(searchAddressResponse.addresses[0])
            }
        })
    }, []);

    return (
        <>
            <Link as={RouterLink} to={`/property/${assetDetails.id}`} variant="back-link">
                {locale.asset}
            </Link>
            <h1 className="lbh-heading-h1">Edit property address</h1>
            <span className="govuk-caption-m lbh-caption">New Addresses are suggested from the Local Gazetteer to bring some standardisation.</span>
            <div className="mtfh-address-details">
                <section><EditableAddress llpgAddress={llpgAddress} assetId={assetDetails.id} /></section>
                <section><ReferenceAddress assetAddressDetails={assetDetails.assetAddress} /></section>
            </div>
        </>
    );
};
