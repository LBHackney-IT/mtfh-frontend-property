import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";

import { isAuthorisedForGroups } from "@mtfh/common";
import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Button, Heading, Text } from "@mtfh/common/lib/components";

interface LbhOwnershipInformationProps {
  asset: Asset;
}

export const LbhOwnershipInformation = ({ asset }: LbhOwnershipInformationProps) => {
  let displayMessage;
  if (!asset.assetManagement) {
    displayMessage = "No asset management data found";
  } else if (asset.assetManagement?.isCouncilProperty) {
    displayMessage = locale.lbhOwnershipInformation.ownedByLbh;
  } else {
    displayMessage = locale.lbhOwnershipInformation.notOwnedByLbh;
  }

  return (
    <aside className="mtfh-lbh-ownership-info">
      <Heading
        variant="h2"
        className="lbh-heading lbh-heading-h3"
        data-testid="ownership-info-heading"
      >
        {locale.lbhOwnershipInformation.sideBarHeading}
      </Heading>

      <Text size="sm" data-testid="ownership-info">
        {displayMessage}
      </Text>

      {isAuthorisedForGroups(assetAdminAuthGroups) && (
        <Button
          as={RouterLink}
          to={`/property/${asset.id}/edit-asset-ownership`}
          data-testid="edit-ownership-info-button"
        >
          {locale.lbhOwnershipInformation.editOwnershipButton}
        </Button>
      )}

      <hr className="lbh-horizontal-bar" />
    </aside>
  );
};
