import React from "react";

import { warrantiesSpreadsheetUrl } from "../../services";

import { WarrantyStatus } from "@mtfh/common/lib/api/asset/v1";
import { Heading, WarningIcon } from "@mtfh/common/lib/components";

import "./styles.scss";

export interface WarrantyStatusFlagProps {
  status: WarrantyStatus;
}

export const WarrantyStatusFlag = ({ status }: WarrantyStatusFlagProps) => {
  const normalizedStatus = status?.toUpperCase().trim();

  if (!normalizedStatus) {
    return null;
  }

  let heading;
  let content;

  if (normalizedStatus === "DEFECTS") {
    heading = "Property under defects period";
    content = (
      <p>
        This property is currently under a defects period and is not eligible for standard
        repairs. <br /> For more information please contact the{" "}
        <strong>Regeneration Aftercare &amp; Defects Team</strong> by sending an email to{" "}
        <a href="mailto:aftercareanddefects@hackney.gov.uk">
          aftercareanddefects@hackney.gov.uk
        </a>{" "}
        or calling <strong>0208 356 1998</strong>
      </p>
    );
  } else if (normalizedStatus === "WARRANTIES") {
    heading = "Property under warranty period";
    content = (
      <p>
        This property is currently under a warranty period which may cover certain
        repairs. <br />
        Before raising a work order please check if the repair is covered under warranty
        by reviewing the{" "}
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
        or calling <strong>0208 356 1998</strong>
      </p>
    );
  } else {
    heading = "Error: Invalid Defects & Warranties Status";
    content = (
      <p>
        Invalid status: '{status}'. Please contact support to rectify. <br /> Valid
        statuses are 'DEFECTS' or 'WARRANTIES'.
      </p>
    );
  }

  return (
    <aside className="mtfh-cautionary-alerts mtfh-warranty-flag">
      <Heading
        variant="h2"
        className="lbh-heading lbh-heading-h3 mtfh-warranty-flag-heading"
      >
        <WarningIcon size="30" color="black" /> {heading}
      </Heading>

      {content}
    </aside>
  );
};
