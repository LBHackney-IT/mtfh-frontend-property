import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetSideBar } from "../../components/asset-sidebar";
import { PropertyBody } from "../../components/property-body";
import { locale } from "../../services";
import { useCautionaryAlerts } from "./utils";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Alert as AlertIcon,
  Button,
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
  assetChildren: Asset[] | undefined;
  showTenureInformation: boolean;
  showCautionaryAlerts: boolean;
  enableNewProcesses: boolean;
}

export const AssetLayout: FC<Props> = ({
  assetDetails,
  assetChildren,
  showTenureInformation,
  showCautionaryAlerts,
  enableNewProcesses,
}) => {
  const { alertsData, isLoading: isLoadingCautionaryAlerts } = useCautionaryAlerts(
    assetDetails.assetId,
    showCautionaryAlerts,
  );

  const tenure = useTenure(assetDetails.tenure ? assetDetails.tenure.id : null).data;

  if (assetDetails.tenure && tenure && alertsData.length > 0) {
    const { householdMembers } = tenure;

    alertsData.forEach((alert) => {
      const matchingMember = householdMembers.find(
        (householdMember) =>
          alert.personName && alert.personName === householdMember.fullName,
      );

      if (matchingMember) {
        alert.personId = matchingMember.id;
      }
    });

  }


  if (isLoadingCautionaryAlerts) {
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
            {showCautionaryAlerts && alertsData.length > 0 && (
              <span data-test="cautionary-alerts-icon">
                <AlertIcon
                  viewBox="0 0 37 58"
                  width="28"
                  height="44"
                  style={{ margin: "-2px 4px 0 0" }}
                />
              </span>
            )}
            {locale.assets.assetDetails.address(assetDetails.assetAddress)}
          </Heading>
        }
        side={
          <AssetSideBar
            assetDetails={assetDetails}
            alerts={alertsData}
            showTenureInformation={showTenureInformation}
            showCautionaryAlerts={showCautionaryAlerts}
          />
        }
      >
        <PropertyBody
          assetDetails={assetDetails}
          childAssets={assetChildren}
          enableNewProcesses={enableNewProcesses}
          id={assetDetails.id}
        />
        
      </Layout>
    </PageAnnouncementProvider>
  );
};
