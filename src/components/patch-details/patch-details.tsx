import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Cookies from "js-cookie";

import { locale } from "../../services";

import { Patch, usePatchOrArea } from "@mtfh/common/lib/api/patch/v1";
import {
  Button,
  Heading,
  Spinner,
  SummaryList,
  SummaryListItem,
} from "@mtfh/common/lib/components";

const PatchDetailsTable = ({ assetPatch }: { assetPatch: Patch }) => {
  const { patchLabel, housingOfficerLabel, areaManagerLabel } = locale.patchDetails;

  const patch = usePatchOrArea(assetPatch.id).data;
  const parentArea = usePatchOrArea(assetPatch.parentId).data;
  if (!patch && !parentArea) return <Spinner />;

  const housingOfficerName = patch?.responsibleEntities[0].name;
  const areaManagerName = parentArea?.responsibleEntities[0].name;

  return (
    <SummaryList overrides={[2 / 3]}>
      <SummaryListItem title={patchLabel} data-testid="patch-name" key="patchName">
        {patch?.name}
      </SummaryListItem>
      <SummaryListItem
        title={housingOfficerLabel}
        data-testid="officer-name"
        key="officerName"
      >
        {housingOfficerName}
      </SummaryListItem>
      <SummaryListItem
        title={areaManagerLabel}
        data-testid="area-manager-name"
        key="areaManagerName"
      >
        {areaManagerName}
      </SummaryListItem>
    </SummaryList>
  );
};

interface PatchDetailsProps {
  assetPk: string;
  assetPatch?: Patch;
}

export const PatchDetails = ({ assetPk, assetPatch }: PatchDetailsProps) => {
  const { heading, noPatch } = locale.patchDetails;
  return (
    <>
      <aside className="mtfh-patch-details">
        <Heading variant="h2" className="lbh-heading lbh-heading-h3">
          {heading}
        </Heading>
        {assetPatch ? <PatchDetailsTable assetPatch={assetPatch} /> : <p>{noPatch}</p>}
        <Button
          as={RouterLink}
          to="/property/all-patches-and-areas"
          data-testid="all-patches-and-areas-button"
          onClick={() => Cookies.set("fromAssetId", assetPk)}
        >
          {locale.patchDetails.allPatchesAndAreas}
        </Button>
      </aside>
      <hr className="lbh-horizontal-bar" />
    </>
  );
};
