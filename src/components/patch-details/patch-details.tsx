import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Cookies from "js-cookie";

import { locale } from "../../services";

import { Patch } from "@mtfh/common/lib/api/patch/v1";
import {
  Button,
  Heading,
  SummaryList,
  SummaryListItem,
} from "@mtfh/common/lib/components";

interface PatchDetailsProps {
  assetPk: string;
  assetPatch?: Patch;
  assetArea?: Patch;
}

export const PatchDetails = ({ assetPk, assetPatch, assetArea }: PatchDetailsProps) => {
  const { heading } = locale.patchDetails;

  const { patchLabel, housingOfficerLabel, areaManagerLabel } = locale.patchDetails;

  const patchOrAreaDefined = assetPatch || assetArea;
  const housingOfficerName = assetPatch?.responsibleEntities[0]?.name;
  const areaManagerName = assetArea?.responsibleEntities[0]?.name;

  return (
    <>
      <aside className="mtfh-patch-details">
        <Heading variant="h2" className="lbh-heading lbh-heading-h3">
          {heading}
        </Heading>

        {patchOrAreaDefined ? (
          <SummaryList overrides={[2 / 3]}>
            <SummaryListItem title={patchLabel} data-testid="patch-name" key="patchName">
              {assetPatch?.name}
            </SummaryListItem>
            <SummaryListItem
              title={housingOfficerLabel}
              data-testid="officer-name"
              key="officerName"
            >
              {housingOfficerName || "N/A"}
            </SummaryListItem>
            <SummaryListItem
              title={areaManagerLabel}
              data-testid="area-manager-name"
              key="areaManagerName"
            >
              {areaManagerName || "N/A"}
            </SummaryListItem>
          </SummaryList>
        ) : (
          <p>{locale.patchDetails.noPatch}</p>
        )}
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
