import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { AssetDetails, PropertySpecification, TenureDetails } from "..";
import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";
import { BoilerHouseDetails } from "../boiler-house-details/boiler-house-details";
import { CautionaryAlertsDetails } from "../cautionary-alerts-details/cautionary-alerts-details";
import { LbhOwnershipInformation } from "../lbh-ownership-information/lbh-ownership-information";
import { PatchDetails } from "../patch-details/patch-details";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Alert } from "@mtfh/common/lib/api/cautionary-alerts/v1/types";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { Button, SideBar, SideBarProps } from "@mtfh/common/lib/components";
import { isFutureDate } from "@mtfh/common/lib/utils";

interface Props extends Partial<SideBarProps> {
  alerts: Alert[];
  assetDetails: Asset;
  showTenureInformation: boolean;
  showCautionaryAlerts: boolean;
}

const boilerHouseAssetTypes = new Set<string>([
  "Dwelling",
  "LettableNonDwelling",
  "AdministrativeBuilding",
  "CommunityHall",
  "Room",
  "House",
  "SelfContainedBedsit",
  "Maisonette",
]);

export const AssetSideBar = ({
  assetDetails,
  alerts,
  showTenureInformation,
  showCautionaryAlerts,
  ...properties
}: Props) => {
  const {
    assetAddress,
    assetId,
    assetType,
    tenure,
    id,
    assetCharacteristics,
    patchId,
    areaId,
  } = assetDetails;

  // only show button when there is no active tenure on the asset
  const showAddTenureButton = () =>
    !tenure || !tenure.isActive || !isFutureDate(tenure.endOfTenureDate) || !tenure.id;

  const showBoilerHouseInformation = () => {
    return boilerHouseAssetTypes.has(assetType);
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
          <PropertySpecification assetCharacteristics={assetCharacteristics} />
          {isAuthorisedForGroups(assetAdminAuthGroups) && (
            <Button
              as={RouterLink}
              to={`/property/edit/${id}`}
              data-testid="edit-address-button"
            >
              Edit address details
            </Button>
          )}
          <hr className="lbh-horizontal-bar" />

          {showCautionaryAlerts && <CautionaryAlertsDetails alerts={alerts} />}
          <PatchDetails
            assetPk={id}
            initialPatchId={patchId}
            initialAreaId={areaId}
            versionNumber={assetDetails?.versionNumber}
          />
          <LbhOwnershipInformation asset={assetDetails} />
          {showBoilerHouseInformation() && <BoilerHouseDetails asset={assetDetails} />}
          {showTenureInformation && (
            <>
              <TenureDetails tenure={tenure} />
              {showAddTenureButton() && (
                <Button as={RouterLink} to={`/tenure/${id}/add`}>
                  {locale.assets.assetDetails.newTenure}
                </Button>
              )}
            </>
          )}
        </>
      </SideBar>
    </div>
  );
};
