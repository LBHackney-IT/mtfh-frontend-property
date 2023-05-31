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
// @ts-ignore
import { PropertyTree } from "../../utils/property-tree"

export interface AssetLayoutProperties {
  assetDetails: Asset;
  assetchildren: Asset[] | undefined;
  assetparents: Asset[] | undefined;
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
  assetDetails: Asset;
  childAssets: Asset[] | undefined;
  parentAssets: Asset[] | undefined;
}

// interface RelatedAssets {
//   rootAsset: Asset | undefined;
//   parentAsset: Asset | undefined;
//   childAssets: Asset[] | undefined;
// }

const PropertyBody = ({ assetDetails, childAssets, parentAssets }: PropertyBodyProps): JSX.Element => {
  const hasRepairsList = useFeatureToggle("MMH.RepairsList");
  console.log(`My PropertyBody children details are: ${JSON.stringify(childAssets)}`)
  return (
    <>
      <div id="property-body-grid-container">
        <div id="new-process-grid-area">
          <Button variant="primary" as={RouterLink} to={`/processes/property/${assetDetails.id}`}>
            {locale.static.newProcess}
          </Button>
        </div>

        <div id="repairs-grid-area">
          {hasRepairsList && (
            <>
              <h2 className="lbh-heading-h2">{locale.repairs.heading}</h2>
              <WorkOrderList assetId={assetDetails.assetId} />
            </>
          )}
        </div>
        <PropertyTree asset={assetDetails} childAssets={childAssets} parentAssets={parentAssets} />
        <div id="comments-grid-area">
          <h2 className="lbh-heading-h2">{locale.comments.heading}</h2>
          <Button as={RouterLink} to={`/comment/property/${assetDetails.id}`}>
            {locale.comments.addComment}
          </Button>
          <div>
            <CommentList targetId={assetDetails.id} />
          </div>
        </div>
      </div >
    </>
  );
};

const tempAsset1 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ab",
  assetType: "BoosterPump",
  assetId: "001001",
  assetAddress: {
    addressLine1: "Booster Pump",
  }
}
const tempAsset2 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ac",
  assetType: "Block",
  assetId: "002002",
  assetAddress: {
    addressLine1: "Block Qwe",
  }
}
const tempAsset3 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ad",
  assetType: "Estate",
  assetId: "003003",
  assetAddress: {
    addressLine1: "Estate Asd",
  }
}
const tempAsset4 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ae",
  assetType: "Room",
  assetId: "004004",
  assetAddress: {
    addressLine1: "Bedroom 1",
  }
}
const tempAsset8 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ah",
  assetType: "Room",
  assetId: "008008",
  assetAddress: {
    addressLine1: "Bedroom 2",
  }
}
const tempAsset5 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9af",
  assetId: "005005",
  assetType: "CommunityHall",
  assetAddress: {
    addressLine1: "Community Hall",
  }
}
const tempAsset6 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ag",
  assetType: "Lift",
  assetId: "006006",
  assetAddress: {
    addressLine1: "Lift",
  }
}
const tempAsset7 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ah",
  assetType: "Anything Else (House/Flat/Dwelling etc)",
  assetId: "007007",
  assetAddress: {
    addressLine1: "Anything Else (House/Flat/Dwelling etc)",
  }
}

export const AssetLayout: FC<AssetLayoutProperties> = ({ assetDetails, assetchildren, assetparents }) => {
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
        side={<AssetSideBar assetDetails={assetDetails} alerts={alertsData.alerts} assetchildren={undefined} assetparents={undefined} />}
      >
        <PropertyBody assetDetails={assetDetails} childAssets={assetchildren} parentAssets={assetparents} />
      </Layout>
    </PageAnnouncementProvider>
  );
};
