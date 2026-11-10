import React, { FC } from "react";

import { warrantiesSpreadsheetUrl } from "../../services";

import { Heading, WarningIcon } from "@mtfh/common/lib/components";

import "./styles.scss";

interface WarrantyPropertyFlagProps {
  isUnderWarranty: boolean;
}

export const WarrantyPropertyFlag: FC<WarrantyPropertyFlagProps> = ({
  isUnderWarranty,
}) => {
  if (!isUnderWarranty) return null;

  return (
    <aside className="mtfh-cautionary-alerts mtfh-warranty-flag">
      <Heading
        variant="h2"
        className="lbh-heading lbh-heading-h3 mtfh-warranty-flag-heading"
      >
        <WarningIcon size="30" color="black" /> This property is under warranty
      </Heading>

      <p>
        Before raising a work order please check the{" "}
        {warrantiesSpreadsheetUrl ? (
          <a href={warrantiesSpreadsheetUrl} target="_blank" rel="noreferrer">
            New Property Warranties Spreadsheet
          </a>
        ) : (
          <strong>New Property Warranties Spreadsheet</strong>
        )}{" "}
        and contact the <strong>Regeneration Aftercare &amp; Defects Team</strong> by
        sending an email to{" "}
        <a href="mailto:aftercareanddefects@hackney.gov.uk">
          aftercareanddefects@hackney.gov.uk
        </a>{" "}
        or calling <strong>0208 356 1998</strong> to ensure eligibility
      </p>
    </aside>
  );
};
