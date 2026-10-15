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
  Center,
  Heading,
  Layout,
  Link,
  PageAnnouncement,
  PageAnnouncementProvider,
  Spinner,
} from "@mtfh/common/lib/components";

import "./styles.scss";

type AssetWithWarranty = Omit<Asset, "assetCharacteristics"> & {
  assetCharacteristics: Asset["assetCharacteristics"] & {
    isUnderWarranty?: boolean;
  };
};

export interface Props {
  assetDetails: AssetWithWarranty;
  assetChildren: Asset[] | undefined;
  showTenureInformation: boolean;
  showCautionaryAlerts: boolean;
}

interface WarrantyPropertyFlagProps {
  isUnderWarranty: boolean;
}

const WarrantyPropertyFlag: FC<WarrantyPropertyFlagProps> = ({ isUnderWarranty }) => {
  if (!isUnderWarranty) return null;

  return (
    <div
      role="note"
      aria-label="Property under warranty status"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        backgroundColor: "#eae8f8",
        borderLeft: "10px solid #005a36",
        padding: "20px",
        maxWidth: 720,
        marginBottom: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          minWidth: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: "#0b0c0c",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 20,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        !
      </span>

      <div style={{ flexGrow: 1 }}>
        <h3
          style={{
            margin: "0 0 10px",
            fontSize: 20,
            fontWeight: 700,
            color: "#0b0c0c",
            lineHeight: 1.2,
          }}
        >
          Property under warranty
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.5,
            color: "#0b0c0c",
          }}
        >
          This property is under warranty.
        </p>
      </div>
    </div>
  );
};

export const AssetLayout: FC<Props> = ({
  assetDetails,
  assetChildren,
  showTenureInformation,
  showCautionaryAlerts,
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
        <WarrantyPropertyFlag
          isUnderWarranty={assetDetails.assetCharacteristics.isUnderWarranty === true}
        />
        <PropertyBody
          assetDetails={assetDetails}
          childAssets={assetChildren}
          id={assetDetails.id}
        />
      </Layout>
    </PageAnnouncementProvider>
  );
};
