import React, { useState } from "react";
import { locale } from "../../services";
11;
import { usePatchOrArea } from "@mtfh/common/lib/api/patch/v1";
import { Heading, SummaryList, SummaryListItem } from "@mtfh/common/lib/components";

interface PatchDetailsProps {
  assetPk: string;
  initialPatchId: string;
  initialAreaId: string;
  neighbourhood: string | null;
  versionNumber?: number;
}

export const PatchDetails = ({
  initialPatchId,
  initialAreaId,
  neighbourhood,
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

        <p className="lbh-body-s" data-testid="patch-note">
          {locale.patchDetails.note}
        </p>
      </aside>
      <hr className="lbh-horizontal-bar" />
    </>
  );
};
