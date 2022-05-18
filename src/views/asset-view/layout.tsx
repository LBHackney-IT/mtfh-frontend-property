import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetDetails, TenureDetails } from "../../components";
import { locale } from "../../services";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { usePropertyDiscretionaryAlert } from "@mtfh/common/lib/api/discretionary-alerts/v1";
import {
  Accordion,
  AccordionItem,
  Button,
  CommentList,
  Heading,
  Layout,
  Link,
  PageAnnouncement,
  PageAnnouncementProvider,
  SideBar,
  SideBarProps,
  SideBarSection,
  WorkOrderList,
} from "@mtfh/common/lib/components";
import { useFeatureToggle } from "@mtfh/common/lib/hooks";
import { isFutureDate } from "@mtfh/common/lib/utils";

import "./styles.scss";

export interface AssetLayoutProperties {
  assetDetails: Asset;
}

interface AssetSideBarProperties extends Partial<SideBarProps>, AssetLayoutProperties {}

const AssetSideBar = ({ assetDetails, ...properties }: AssetSideBarProperties) => {
  const { assetAddress, assetId, assetType, tenure, id } = assetDetails;

  const { data } = usePropertyDiscretionaryAlert(assetId);
  const isAlert = data && data.alerts?.length > 0;

  return (
    <div className="mtfh-asset-sidebar">
      <SideBar id="property-view-sidebar" {...properties}>
        <>
          {isAlert && (
            <Accordion id="contact-details">
              <>
                {data?.alerts.map((alert, index) => {
                  return (
                    <AccordionItem
                      key={`${index}-${alert.alertCode}`}
                      id="discretion-alert"
                      title={locale.tenureDetails.discretionaryAlerts}
                    >
                      <Heading as="h2" variant="h4">
                        {alert.description}
                      </Heading>
                      <p style={{ fontSize: "16px", lineHeight: "20px", margin: 0 }}>
                        {alert.reason}
                      </p>
                    </AccordionItem>
                  );
                })}
              </>
            </Accordion>
          )}
          <AssetDetails
            assetAddress={assetAddress}
            assetType={assetType}
            assetReference={assetId}
          />
          <SideBarSection
            id="tenure-details"
            title={locale.tenureDetails.expandedTenureSection}
          >
            <TenureDetails tenure={tenure} />
          </SideBarSection>
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
          <h1 className="heading">
            {locale.assetDetails.address(assetDetails.assetAddress)}
          </h1>
        }
        side={<AssetSideBar assetDetails={assetDetails} />}
      >
        <PropertyBody assetId={assetDetails.assetId} propertyId={assetDetails.id} />
      </Layout>
    </PageAnnouncementProvider>
  );
};
