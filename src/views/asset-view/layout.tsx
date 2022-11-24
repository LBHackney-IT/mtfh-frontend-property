import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetDetails, TenureDetails } from "../../components";
import { CautionaryAlertsDetails } from "../../components/cautionary-alerts-details/cautionary-alerts-details";
import { locale } from "../../services";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { usePropertyDiscretionaryAlert } from "@mtfh/common/lib/api/discretionary-alerts/v1";
import { Alert } from "@mtfh/common/lib/api/discretionary-alerts/v1/types";
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
          <CautionaryAlertsDetails alerts={alerts} />
          <TenureDetails tenure={tenure} />
        </>
      </SideBar>
      {(!tenure ||
        !tenure.isActive ||
        !isFutureDate(tenure.endOfTenureDate) ||
        !tenure.id) && (
        <Button as={RouterLink} to={`/tenure/${id}/add`}>
          {locale.assetDetails.newTenure}
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
    <div>
      <Button variant="primary" as={RouterLink} to={`/processes/property/${propertyId}`}>
        {locale.static.newProcess}
      </Button>
      {hasRepairsList && (
        <>
          <h2 className="lbh-heading-h2">{locale.repairs.heading}</h2>
          <WorkOrderList assetId={assetId} />
        </>
      )}
      <h2 className="lbh-heading-h2">{locale.comments.heading}</h2>
      <Button as={RouterLink} to={`/comment/property/${propertyId}`}>
        {locale.comments.addComment}
      </Button>
      <div>
        <CommentList targetId={propertyId} />
      </div>
    </div>
  );
};

export const AssetLayout: FC<AssetLayoutProperties> = ({ assetDetails }) => {
  const { data } = usePropertyDiscretionaryAlert(assetDetails.assetId);

  if (!data) {
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
            {data.alerts?.length > 0 && (
              <AlertIcon
                viewBox="0 0 37 58"
                width="28"
                height="44"
                style={{ margin: "-2px 4px 0 0" }}
              />
            )}
            {locale.assetDetails.address(assetDetails.assetAddress)}
          </Heading>
        }
        side={<AssetSideBar assetDetails={assetDetails} alerts={data.alerts} />}
      >
        <PropertyBody assetId={assetDetails.assetId} propertyId={assetDetails.id} />
      </Layout>
    </PageAnnouncementProvider>
  );
};
