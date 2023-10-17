import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Cookies from "js-cookie";

import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";

import { isAuthorisedForGroups } from "@mtfh/common";
import { Asset } from "@mtfh/common/lib/api/asset/v1";
import {
  Button,
  Heading,
  SummaryList,
  SummaryListItem,
  Text,
} from "@mtfh/common/lib/components";

const PatchTable = ({ patches }: { patches: Patch[] }) => {
  const assetPatch = patches.find((patch) => patch.patchType === "patch");
  const assetArea = patches.find((patch) => patch.patchType === "area");

  const patchName = assetPatch?.name;
  const housingOfficerName = assetPatch?.responsibleEntities[0]?.name;
  const areaManagerName = assetArea?.responsibleEntities[0]?.name;

  const { patchLabel, housingOfficerLabel, areaManagerLabel } = locale.patchDetails;
  return (
    <SummaryList overrides={[2 / 3]}>
      <SummaryListItem title={patchLabel} data-testid="patch-name" key="P">
        {patchName}
      </SummaryListItem>
      <SummaryListItem title={housingOfficerLabel} data-testid="officer-name" key="O">
        {housingOfficerName}
      </SummaryListItem>
      <SummaryListItem title={areaManagerLabel} data-testid="area-manager-name" key="M">
        {areaManagerName}
      </SummaryListItem>
    </SummaryList>
  );
};

interface PatchDetailsProps {
  asset: Asset;
}

export const PatchDetails = ({ asset }: PatchDetailsProps) => {
  return (
    <aside className="mtfh-patch-details">
      <Heading variant="h2" className="lbh-heading lbh-heading-h3">
        {locale.patchDetails.heading}
      </Heading>
      {asset.patches && asset.patches.length > 0 ? (
        <PatchTable patches={asset.patches} />
      ) : (
        <Text size="sm">{locale.patchDetails.noPatch}</Text>
      )}
      {isAuthorisedForGroups(assetAdminAuthGroups) && (
        <Button
          as={RouterLink}
          to="/property/manage-patches"
          data-testid="manage-patches-button"
          onClick={() => {
            // Set cookie to allow redirecting back to this asset
            Cookies.set("fromAssetId", asset.id);
          }}
        >
          {locale.patchDetails.managePatches}
        </Button>
      )}
      <hr className="lbh-horizontal-bar" />
    </aside>
  );
};
