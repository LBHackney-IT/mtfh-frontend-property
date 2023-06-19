import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetDetails, TenureDetails } from "../../components";
import { CautionaryAlertsDetails } from "../../components/cautionary-alerts-details/cautionary-alerts-details";
import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";

import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import {
  Button,
  Link,
  SideBar,
  SideBarProps,
} from "@mtfh/common/lib/components";
import { useFeatureToggle } from "@mtfh/common/lib/hooks";
import { isFutureDate } from "@mtfh/common/lib/utils";
import { Asset } from "@mtfh/common/lib/api/asset/v1";

interface Props extends Partial<SideBarProps> {
  alerts: Alert[];
  assetDetails: Asset;
}

export const AssetSideBar = ({ assetDetails, alerts, ...properties }: Props) => {
  const { assetAddress, assetId, assetType, tenure, id } = assetDetails;

  const showTenure = () => {
    return (
      !tenure || !tenure.isActive || !isFutureDate(tenure.endOfTenureDate) || !tenure.id
    );
  };

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

      {showTenure() && (
        <Button as={RouterLink} to={`/tenure/${id}/add`}>
          {locale.assets.assetDetails.newTenure}
        </Button>
      )}
    </div>
  );
};
