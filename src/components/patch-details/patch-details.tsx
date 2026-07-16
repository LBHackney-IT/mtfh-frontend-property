import React from "react";

import { locale } from "../../services";

import { Patch } from "@mtfh/common/lib/api/patch/v1/types";
import { Heading, SummaryList, SummaryListItem } from "@mtfh/common/lib/components";
import { config } from "@mtfh/common/lib/config";
import { useAxiosSWR } from "@mtfh/common/lib/http";

const usePatchOrArea = (id: string | null) =>
  useAxiosSWR<Patch>(id ? `${config.patchesAndAreasApiUrlV1}/patch/${id}` : null);

interface Props {
  neighbourhood: string | null;
  patchId?: string | null;
  areaId?: string | null;
}

const PatchInfo = ({ children }: { children: React.ReactNode }) => (
  <>
    <aside className="mtfh-patch-details">
      <Heading variant="h2" className="lbh-heading lbh-heading-h3">
        {locale.patchDetails.heading}
      </Heading>
      {children}
    </aside>
    <hr className="lbh-horizontal-bar" />
  </>
);

export const PatchDetails = ({ neighbourhood, patchId, areaId }: Props) => {
  const { data: assetPatch } = usePatchOrArea(patchId ?? null);
  const { data: assetArea } = usePatchOrArea(areaId ?? null);

  const { patchLabel, housingOfficerLabel, areaManagerLabel } = locale.patchDetails;

  const housingOfficerName = assetPatch?.responsibleEntities?.[0]?.name;
  const areaManagerName = assetArea?.responsibleEntities?.[0]?.name;

  const isTmo = assetPatch?.patchType === "tmoPatch";

  if (isTmo) {
    return (
      <PatchInfo>
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
      </PatchInfo>
    );
  }

  const { neighbourhoodAreaLabel, noNeighbourhoodArea } = locale.patchDetails;
  return (
    <PatchInfo>
      {neighbourhood ? (
        <>
          <SummaryList overrides={[2 / 3]}>
            <SummaryListItem
              title={neighbourhoodAreaLabel}
              data-testid="neighbourhood-name"
              key="neighbourhoodName"
            >
              {neighbourhood}
            </SummaryListItem>
          </SummaryList>
          <p className="lbh-body-s" data-testid="patch-note">
            {locale.patchDetails.note}
          </p>
        </>
      ) : (
        <p data-testid="no-neighbourhood">{noNeighbourhoodArea}</p>
      )}
    </PatchInfo>
  );
};
