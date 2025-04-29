import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Cookies from "js-cookie";

import { locale } from "../../services";
import { patchAdminAuthGroups } from "../../services/config/config";
import { PatchEdit } from "./patch-edit";

import { usePatchOrArea } from "@mtfh/common/lib/api/patch/v1";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import {
  Button,
  Heading,
  SummaryList,
  SummaryListItem,
} from "@mtfh/common/lib/components";

interface PatchDetailsProps {
  assetPk: string;
  initialPatchId: string;
  initialAreaId: string;
  versionNumber?: number;
}

export const PatchDetails = ({
  assetPk,
  initialPatchId,
  initialAreaId,
  versionNumber,
}: PatchDetailsProps) => {
  const [patchId, setPatchId] = useState(initialPatchId);
  const [areaId, setAreaId] = useState(initialAreaId);

  const { data: assetPatch, mutate: mutatePatch } = usePatchOrArea(patchId);
  const { data: assetArea, mutate: mutateArea } = usePatchOrArea(areaId);

  const { heading } = locale.patchDetails;

  const { patchLabel, housingOfficerLabel, areaManagerLabel } = locale.patchDetails;

  const patchOrAreaDefined = assetPatch || assetArea;
  const housingOfficerName = assetPatch?.responsibleEntities[0]?.name;
  const areaManagerName = assetArea?.responsibleEntities[0]?.name;

  const onEdit = (patchId: string, areaId: string) => {
    console.log("On edit!");
    setPatchId(patchId);
    setAreaId(areaId);
    mutatePatch();
    mutateArea();
  };

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
        {isAuthorisedForGroups(patchAdminAuthGroups) && (
          <PatchEdit
            assetPk={assetPk}
            patchName={assetPatch?.name || ""}
            versionNumber={versionNumber}
            onEdit={onEdit}
          />
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
