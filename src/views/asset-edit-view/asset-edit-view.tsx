import React from "react";
import { useParams } from "react-router-dom";

import { locale } from "../../services";
import { Link as RouterLink } from "react-router-dom";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { useAddressLookupUprn } from "@mtfh/common/lib/api/address/v2";

import {
    Alert as AlertIcon,
    Button,
    Center,
    CommentList,
    ErrorSummary,
    Heading,
    Layout,
    Link,
    PageAnnouncement,
    PageAnnouncementProvider,
    SideBar, 
    SideBarProps,
    Spinner,
    WorkOrderList,
  } from "@mtfh/common/lib/components";

export const AssetEditView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: asset, ...assetRequest } = useAsset(assetId);
  const { data: addressLookup } = useAddressLookupUprn(asset?.assetAddress.uprn);

  if (assetRequest.error) {
    return (
      <ErrorSummary
        id="property-error"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!asset) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      {asset.assetType === "Dwelling" || asset.assetType === "LettableNonDwelling" ? (
       <div>
        <Layout
        backLink={
          <Link as={RouterLink} to={`/property/${asset.id}`} variant="back-link">
            Back
          </Link>
        }
        top={
          <Heading variant="h1">
            {locale.assetDetails.address(asset.assetAddress)}
          </Heading>
        }
        
      />
       </div>
      ) : (
        <h1>{locale.assetCouldNotBeLoaded}</h1>
      )}
    </>
  );
};
