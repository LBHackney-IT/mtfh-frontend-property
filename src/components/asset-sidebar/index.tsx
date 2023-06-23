import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetDetails, PropertySpecification, TenureDetails } from "..";
import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";
import { CautionaryAlertsDetails } from "../cautionary-alerts-details/cautionary-alerts-details";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { Button, SideBar, SideBarProps } from "@mtfh/common/lib/components";
import { isFutureDate } from "@mtfh/common/lib/utils";

interface Props extends Partial<SideBarProps> {
  alerts: Alert[];
  assetDetails: Asset;
}

export const AssetSideBar = ({ assetDetails, alerts, ...properties }: Props) => {
  const { assetAddress, assetId, assetType, tenure, id, assetCharacteristics } =
    assetDetails;

  // only show button when there is no active tenure on the asset
  const showAddTenureButton = () =>
    !tenure || !tenure.isActive || !isFutureDate(tenure.endOfTenureDate) || !tenure.id;

  return (
    <div className="mtfh-asset-sidebar">
      <SideBar id="property-view-sidebar" {...properties}>
        <>
          <AssetDetails
            assetAddress={assetAddress}
            assetType={assetType}
            assetReference={assetId}
          />
          <PropertySpecification assetCharacteristics={assetCharacteristics} />
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

      {showAddTenureButton() && (
        <Button as={RouterLink} to={`/tenure/${id}/add`}>
          {locale.assets.assetDetails.newTenure}
        </Button>
      )}
    </div>
  );
};
