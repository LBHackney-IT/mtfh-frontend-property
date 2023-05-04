import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetDetails, TenureDetails } from "../../components";
import { CautionaryAlertsDetails } from "../../components/cautionary-alerts-details/cautionary-alerts-details";
import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { usePropertyCautionaryAlert } from "@mtfh/common/lib/api/cautionary-alerts/v1";
import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import { HouseholdMember } from "@mtfh/common/lib/api/tenure/v1/types";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import {
  Alert as AlertIcon,
  Button,
  Center,
  CommentList,
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
import { useFeatureToggle } from "@mtfh/common/lib/hooks";
import { isFutureDate } from "@mtfh/common/lib/utils";
import "./styles.scss";

export interface AssetLayoutProperties {
  assetDetails: Asset;
}

interface AssetSideBarProperties extends Partial<SideBarProps>, AssetLayoutProperties {
  alerts: Alert[];
}

const AssetSideBar = ({
  assetDetails,
  alerts,
  ...properties
}: AssetSideBarProperties) => {
  const { assetAddress, assetId, assetType, tenure, id } = assetDetails;
  return (
    <div className="mtfh-asset-sidebar">
      <SideBar id="property-view-sidebar" {...properties}>
        <>
          <AssetDetails
            assetAddress={assetAddress}
            assetType={assetType}
            assetReference={assetId}
          />
          {isAuthorisedForGroups(assetAdminAuthGroups) && (
            <Button
              as={RouterLink}
              to={assetAddress.uprn ? `/property/edit/${id}` : "#"}
              isDisabled={!assetAddress.uprn}
              data-testid="edit-address-button"
            >
              {assetAddress.uprn ? "Edit address details" : "Cannot edit: UPRN missing"}
            </Button>
          )}
          <CautionaryAlertsDetails alerts={alerts} />
          <TenureDetails tenure={tenure} />
        </>
      </SideBar>
      {(!tenure ||
        !tenure.isActive ||
        !isFutureDate(tenure.endOfTenureDate) ||
        !tenure.id) && (
          <Button as={RouterLink} to={`/tenure/${id}/add`}>
            {locale.assets.assetDetails.newTenure}
          </Button>
        )}
    </div>
  );
};

interface PropertyBodyProps {
  propertyId: string;
  assetId: string;
}

const PropertyBody = ({ propertyId, assetId }: PropertyBodyProps): JSX.Element => {
  const hasRepairsList = useFeatureToggle("MMH.RepairsList");

  return (
    <>
      <div id="property-body-grid-container">
        <div id="new-process-grid-area">
          <Button variant="primary" as={RouterLink} to={`/processes/property/${propertyId}`}>
            {locale.static.newProcess}
          </Button>
        </div>
        <div id="property-hierarchy-grid-area">
          <h1>TREE VIEW</h1>
          <div id="property-hierarchy-container">
    <div>
      <h3>Primary Property</h3>
    </div>
    <ul>
      <li>
        <h4>Secondary Property 1</h4>
        <ul>
          <li>
            <h5>Child Property 1</h5>
          </li>
          <li>
            <h5>Child Property 2</h5>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        <h4>Secondary Property 2</h4>
        <ul>
          <li>
            <h5>Child Property 3</h5>
          </li>
          <li>
            <h5>Child Property 4</h5>
          </li>
        </ul>
      </li>
      <li>
        <h4>Secondary Property 3</h4>
      </li>
      <li>
        <h4>Secondary Property 4</h4>
        <ul>
          <li>
            <h5>Child Property 6</h5>
          </li>
        </ul>
      </li>
    </ul>
  </div>
        </div>
        <div id="repairs-grid-area">
          {hasRepairsList && (
            <>
              <h2 className="lbh-heading-h2">{locale.repairs.heading}</h2>
              <WorkOrderList assetId={assetId} />
            </>
          )}
        </div>
        <div id="comments-grid-area">
          <h2 className="lbh-heading-h2">{locale.comments.heading}</h2>
          <Button as={RouterLink} to={`/comment/property/${propertyId}`}>
            {locale.comments.addComment}
          </Button>
          <div>
            <CommentList targetId={propertyId} />
          </div>
        </div>
      </div>
    </>
  );
};

export const AssetLayout: FC<AssetLayoutProperties> = ({ assetDetails }) => {
  const alertsData = usePropertyCautionaryAlert(assetDetails.assetId).data;
  const cautionaryAlerts = alertsData?.alerts;
  const tenure = useTenure(assetDetails.tenure ? assetDetails.tenure.id : null).data;
  if (assetDetails.tenure) {
    if (tenure && cautionaryAlerts) {
      const householdMembers: HouseholdMember[] = tenure.householdMembers;
      cautionaryAlerts.forEach((alert) => {
        householdMembers.forEach((householdMember) => {
          if (alert.personName) {
            if (alert.personName === householdMember.fullName) {
              alert.personId = householdMember.id;
            }
          }
        });
      });
    }
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
        side={<AssetSideBar assetDetails={assetDetails} alerts={alertsData.alerts} />}
      >
        <PropertyBody assetId={assetDetails.assetId} propertyId={assetDetails.id} />
      </Layout>
    </PageAnnouncementProvider>
  );
};
