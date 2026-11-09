import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetSideBar } from "../../components/asset-sidebar";
import { PropertyBody } from "../../components/property-body";
import { locale, warrantiesSpreadsheetUrl } from "../../services";
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
  WarningIcon,
} from "@mtfh/common/lib/components";

import "./styles.scss";

export interface Props {
  assetDetails: Asset;
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
    <aside className="mtfh-cautionary-alerts mtfh-warranty-flag">
      <Heading
        variant="h2"
        className="lbh-heading lbh-heading-h3 mtfh-warranty-flag-heading"
      >
        <WarningIcon size="30" color="black" /> This property is under warranty
      </Heading>

      <p>
        Before raising a work order please check the{" "}
        {warrantiesSpreadsheetUrl ? (
          <a href={warrantiesSpreadsheetUrl} target="_blank" rel="noreferrer">
            New Property Warranties Spreadsheet
          </a>
        ) : (
          <strong>New Property Warranties Spreadsheet</strong>
        )}{" "}
        and contact the <strong>Regeneration Aftercare &amp; Defects Team</strong> by
        sending an email to{" "}
        <a href="mailto:aftercareanddefects@hackney.gov.uk">
          aftercareanddefects@hackney.gov.uk
        </a>{" "}
        or calling <strong>0208 356 1998</strong> to ensure eligibility
      </p>
    </aside>
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
