import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";

import { isAuthorisedForGroups } from "@mtfh/common";
import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Button, Heading, Text } from "@mtfh/common/lib/components";

interface Props {
  asset: Asset;
}

export const LbhOwnershipInformation = ({ asset }: Props) => {
  return (
    <aside className="mtfh-lbh-ownership-info">
      <Heading
        variant="h2"
        className="lbh-heading lbh-heading-h3"
        data-testid="ownership-info-heading"
      >
        {locale.lbhOwnershipInformation.heading}
      </Heading>

      {asset.assetManagement.isCouncilProperty ? (
        <Text size="sm" data-testid="ownership-info">
          {locale.lbhOwnershipInformation.ownedByLbh}
        </Text>
      ) : (
        <Text size="sm" data-testid="ownership-info">
          {locale.lbhOwnershipInformation.notOwnedByLbh}
        </Text>
      )}

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
