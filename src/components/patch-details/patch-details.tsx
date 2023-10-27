import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Cookies from "js-cookie";

import { locale } from "../../services";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Patch, usePatchOrArea } from "@mtfh/common/lib/api/patch/v1";
import {
  Button,
  Heading,
  SummaryList,
  SummaryListItem,
  Text,
} from "@mtfh/common/lib/components";

const PatchTable = ({ patches }: { patches: Patch[] }) => {
  const assetPatch = patches.find((patch) => patch.patchType === "patch");
  const parentId = assetPatch?.parentId || "";
  const parentAreaReq = usePatchOrArea(parentId);
  const parentArea = parentAreaReq.data;
  if (!assetPatch) return <h1>Error: Not found</h1>;

  const housingOfficerName = assetPatch?.responsibleEntities[0]?.name;

  const { patchLabel, housingOfficerLabel, areaManagerLabel } = locale.patchDetails;
  return (
    <SummaryList overrides={[2 / 3]}>
      <SummaryListItem title={patchLabel} data-testid="patch-name" key="P">
        {assetPatch?.name}
      </SummaryListItem>
      <SummaryListItem title={housingOfficerLabel} data-testid="officer-name" key="O">
        {housingOfficerName}
      </SummaryListItem>
      <SummaryListItem title={areaManagerLabel} data-testid="area-manager-name" key="M">
        {parentArea?.responsibleEntities[0]?.name}
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

      <Button
        as={RouterLink}
        to="/property/all-patches-and-areas"
        data-testid="manage-patches-button"
        onClick={() => {
          // Set cookie to allow redirecting back to this asset
          Cookies.set("fromAssetId", asset.id);
        }}
      >
        {locale.patchDetails.allPatchesAndAreas}
      </Button>

      <hr className="lbh-horizontal-bar" />
    </aside>
  );
};
