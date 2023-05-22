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

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import { hierarchyStylesOverride } from "./utils/hierarchyStylesOverride";
import { renderTreeViewItem } from "./utils/treeViewItems";
import { usePropertyHierarchy } from "./utils/usePropertyHierarchy";

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
  assetDetails: Asset;
  relatedAssetResponse: any; // type to be changed to RelatedAssetResponse eventually
}

const tempAsset1 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ab",
  assetType: "BoosterPump",
  assetAddress: {
    addressLine1: "Booster Pump",
  }
}
const tempAsset2 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ac",
  assetType: "Block",
  assetAddress: {
    addressLine1: "Block",
  }
}
const tempAsset3 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ad",
  assetType: "Estate",
  assetAddress: {
    addressLine1: "Estate",
  }
}
const tempAsset4 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ae",
  assetType: "CombinedHeatAndPowerUnit",
  assetAddress: {
    addressLine1: "Combined Heat And Power Unit",
  }
}
const tempAsset5 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9af",
  assetType: "CommunityHall",
  assetAddress: {
    addressLine1: "Community Hall",
  }
}
const tempAsset6 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ag",
  assetType: "Lift",
  assetAddress: {
    addressLine1: "Lift",
  }
}
const tempAsset7 = {
  id: "15adc44b-6fde-46e8-af9c-e18b1495c9ah",
  assetType: "Anything Else (House/Flat/Dwelling etc)",
  assetAddress: {
    addressLine1: "Anything Else (House/Flat/Dwelling etc)",
  }
}


const PropertyBody = ({ assetDetails, relatedAssetResponse }: PropertyBodyProps): JSX.Element => {
  const hasRepairsList = useFeatureToggle("MMH.RepairsList");
  const propertyHierarchy = usePropertyHierarchy(relatedAssetResponse, assetDetails)

  return (
    <>
      <div id="property-body-grid-container">
        <div id="new-process-grid-area">
          <Button variant="primary" as={RouterLink} to={`/processes/property/${assetDetails.id}`}>
            {locale.static.newProcess}
          </Button>
        </div>
        <div id="property-hierarchy-grid-area">
          <h2 className="lbh-heading-h2">{locale.propertyHierarchy.heading}</h2>
          <div id="property-hierarchy-container">
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{
                ".MuiTreeItem-root": {
                  ".Mui-selected, .Mui-focused.Mui-selected, .Mui-focused:not(.Mui-selected)": hierarchyStylesOverride["hierarchy-item-selected"]
                }
              }}>
              {/* <TreeItem nodeId="1" label="Bridge Road Estate">
                <TreeItem nodeId="2" label="Block 3A">
                  {renderTreeViewItem(tempAsset1)}
                  {renderTreeViewItem(tempAsset2)}
                  {renderTreeViewItem(tempAsset3)}
                  {renderTreeViewItem(tempAsset4)}
                  {renderTreeViewItem(tempAsset5)}
                  {renderTreeViewItem(tempAsset6)}
                  {renderTreeViewItem(tempAsset7)}
                </TreeItem>
              </TreeItem> */}
              {propertyHierarchy}
            </TreeView>
          </div>
        </div>
        <div id="repairs-grid-area">
          {hasRepairsList && (
            <>
              <h2 className="lbh-heading-h2">{locale.repairs.heading}</h2>
              <WorkOrderList assetId={assetDetails.assetId} />
            </>
          )}
        </div>
        <div id="comments-grid-area">
          <h2 className="lbh-heading-h2">{locale.comments.heading}</h2>
          <Button as={RouterLink} to={`/comment/property/${assetDetails.id}`}>
            {locale.comments.addComment}
          </Button>
          <div>
            <CommentList targetId={assetDetails.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export const AssetLayout: FC<AssetLayoutProperties> = ({ assetDetails }) => {
  const alertsData = usePropertyCautionaryAlert(assetDetails.assetId).data;
  const cautionaryAlerts = alertsData?.alerts;

  // API call to retrieve related assets, by sending assetDetails.id to GetRelatedAsset new endpoint
  const relatedAssetResponse = {
    assetId: "0001234",
    rootAsset: tempAsset3,
    parentAssets: [tempAsset2, tempAsset3],
    childrenAssets: [tempAsset4]
  }

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
        <PropertyBody assetDetails={assetDetails} relatedAssetResponse={relatedAssetResponse} />
      </Layout>
    </PageAnnouncementProvider>
  );
};
