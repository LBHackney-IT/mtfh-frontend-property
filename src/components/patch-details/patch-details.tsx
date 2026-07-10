import React, { useState } from "react";

import { locale } from "../../services";
import { patchAdminAuthGroups } from "../../services/config/config";
import { PatchEdit } from "./patch-edit";

import { usePatchOrArea } from "@mtfh/common/lib/api/patch/v1";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { Heading, SummaryList, SummaryListItem } from "@mtfh/common/lib/components";

interface PatchDetailsProps {
  assetPk: string;
  initialPatchId: string;
  initialAreaId: string;
  neighbourhood: string | null;
  versionNumber?: number;
}

export const PatchDetails = ({
  assetPk,
  initialPatchId,
  initialAreaId,
  neighbourhood,
  versionNumber,
}: PatchDetailsProps) => {
  const [patchId, setPatchId] = useState(initialPatchId);
  const [areaId, setAreaId] = useState(initialAreaId);

  const { data: assetPatch, mutate: mutatePatch } = usePatchOrArea(patchId);
  const { mutate: mutateArea } = usePatchOrArea(areaId);

  const { heading } = locale.patchDetails;

  const { housingManagementAreaLabel, noHousingManagementArea } = locale.patchDetails;

  const onEdit = (patchId: string, areaId: string) => {
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

        {neighbourhood ? (
          <SummaryList overrides={[2 / 3]}>
            <SummaryListItem
              title={housingManagementAreaLabel}
              data-testid="neighbourhood-name"
              key="neighbourhoodName"
            >
              {neighbourhood}
            </SummaryListItem>
          </SummaryList>
        ) : (
          <p data-testid="no-neighbourhood">{noHousingManagementArea}</p>
        )}

        {isAuthorisedForGroups(patchAdminAuthGroups) && (
          <PatchEdit
            assetPk={assetPk}
            patchName={assetPatch?.name || ""}
            versionNumber={versionNumber}
            onEdit={onEdit}
          />
        )}
        <p className="lbh-body-s" data-testid="patch-note">
          {locale.patchDetails.note}
        </p>
      </aside>
      <hr className="lbh-horizontal-bar" />
    </>
  );
};
