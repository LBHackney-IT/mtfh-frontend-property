import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetDetails, TenureDetails } from "../../components";
import { locale } from "../../services";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import {
  Button,
  CommentList,
  Layout,
  Link,
  PageAnnouncement,
  PageAnnouncementProvider,
  SideBar,
  SideBarProps,
  SideBarSection,
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

  const hasCreateTenure = useFeatureToggle("MMH.CreateTenure");

  return (
    <div className="mtfh-asset-sidebar">
      <SideBar id="property-view-sidebar" {...properties}>
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
      </SideBar>
      {hasCreateTenure &&
        (!tenure || !tenure.isActive || !isFutureDate(tenure.endOfTenureDate)) && (
          <Button as={RouterLink} to={`/tenure/${id}/add`}>
            {locale.assetDetails.newTenure}
          </Button>
        )}
    </div>
  );
};

interface PropertyBodyProps {
  propertyId: string;
}

const PropertyBody = ({ propertyId }: PropertyBodyProps) => {
  const hasEnhancedPropertyComments = useFeatureToggle("MMH.EnhancedPropertyComments");
  const hasProcessMenuButton = useFeatureToggle("MMH.ProcessMenuButton");

  return (
    <div>
      {hasProcessMenuButton && (
        <Button
          variant="primary"
          as={RouterLink}
          to={`/processes/property/${propertyId}`}
        >
          {locale.static.newProcess}
        </Button>
      )}
      {hasEnhancedPropertyComments && (
        <>
          <h2 className="lbh-heading-h2">{locale.comments.heading}</h2>
          <Button as={RouterLink} to={`/comment/property/${propertyId}`}>
            {locale.comments.addComment}
          </Button>
          <div>
            <CommentList targetId={propertyId} />
          </div>
        </>
      )}
    </div>
  );
};

export const AssetLayout: FC<AssetLayoutProperties> = ({ assetDetails }) => {
  return (
    <PageAnnouncementProvider sessionKey="asset">
      <PageAnnouncement />
      <Layout
        top={
          <>
            <Link as={RouterLink} to="/search" variant="back-link">
              {locale.backToSearch}
            </Link>
            <h1 className="heading">
              {locale.assetDetails.address(assetDetails.assetAddress)}
            </h1>
          </>
        }
        side={<AssetSideBar assetDetails={assetDetails} />}
      >
        <PropertyBody propertyId={assetDetails.id} />
      </Layout>
    </PageAnnouncementProvider>
  );
};
