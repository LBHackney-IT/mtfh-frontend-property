import React from "react";

import { locale } from "../../services";

import { Heading, SummaryList, SummaryListItem } from "@mtfh/common/lib/components";

interface Props {
  neighbourhood: string | null;
}

export const PatchDetails = ({ neighbourhood }: Props) => {
  const { heading, neighbourhoodAreaLabel, noNeighbourhoodArea } = locale.patchDetails;

  return (
    <>
      <aside className="mtfh-patch-details">
        <Heading variant="h2" className="lbh-heading lbh-heading-h3">
          {heading}
        </Heading>

        {neighbourhood ? (
          <SummaryList overrides={[2 / 3]}>
            <SummaryListItem
              title={neighbourhoodAreaLabel}
              data-testid="neighbourhood-name"
              key="neighbourhoodName"
            >
              {neighbourhood}
            </SummaryListItem>
          </SummaryList>
        ) : (
          <p data-testid="no-neighbourhood">{noNeighbourhoodArea}</p>
        )}

        <p className="lbh-body-s" data-testid="patch-note">
          {locale.patchDetails.note}
        </p>
      </aside>
      <hr className="lbh-horizontal-bar" />
    </>
  );
};
