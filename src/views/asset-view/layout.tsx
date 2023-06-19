import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetSideBar } from "../../components/asset-sidebar";
import { PropertyBody } from "../../components/property-body";
import { locale } from "../../services";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { usePropertyCautionaryAlert } from "@mtfh/common/lib/api/cautionary-alerts/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import { HouseholdMember } from "@mtfh/common/lib/api/tenure/v1/types";
import {
  Alert as AlertIcon,
  Center,
  Heading,
  Layout,
  Link,
  PageAnnouncement,
  PageAnnouncementProvider,
  Spinner,
} from "@mtfh/common/lib/components";

import "./styles.scss";

export interface Props {
  assetDetails: Asset;
  assetchildren: Asset[] | undefined;
}

export const AssetLayout: FC<Props> = ({ assetDetails, assetchildren }) => {
  const alertsData = usePropertyCautionaryAlert(assetDetails.assetId).data;
  const cautionaryAlerts = alertsData?.alerts;

  const tenure = useTenure(assetDetails.tenure ? assetDetails.tenure.id : null).data;

  if (assetDetails.tenure && tenure && cautionaryAlerts) {
    const householdMembers: HouseholdMember[] = tenure.householdMembers;

    cautionaryAlerts.forEach((alert) => {
      householdMembers.forEach((householdMember) => {
        if (alert.personName && alert.personName === householdMember.fullName) {
          alert.personId = householdMember.id;
        }
      });
    });
  }

  if (!alertsData) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <PageAnnouncementProvider sessionKey="asset">
      <PageAnnouncement />
      <Layout
        backLink={
          <Link as={RouterLink} to="/search" variant="back-link">
            {locale.backToSearch}
          </Link>
        }
        top={
          <Heading variant="h1">
            {alertsData.alerts?.length > 0 && (
              <AlertIcon
                viewBox="0 0 37 58"
                width="28"
                height="44"
                style={{ margin: "-2px 4px 0 0" }}
              />
            )}
            {locale.assets.assetDetails.address(assetDetails.assetAddress)}
          </Heading>
        }
        side={
          <AssetSideBar
            assetDetails={assetDetails}
            alerts={alertsData.alerts}
            assetchildren={undefined}
          />
        }
      >
        <PropertyBody assetDetails={assetDetails} childAssets={assetchildren} />
      </Layout>
    </PageAnnouncementProvider>
  );
};
