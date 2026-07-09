import React from "react";

import { locale } from "../../services";

import { Heading } from "@mtfh/common/lib/components";

export const PatchDetails = () => {
  const { heading } = locale.patchDetails;

  return (
    <>
      <aside className="mtfh-patch-details">
        <Heading variant="h2" className="lbh-heading lbh-heading-h3">
          {heading}
        </Heading>
        <p className="lbh-body-s" data-testid="patch-note">
          {locale.patchDetails.note}
        </p>
      </aside>
      <hr className="lbh-horizontal-bar" />
    </>
  );
};
