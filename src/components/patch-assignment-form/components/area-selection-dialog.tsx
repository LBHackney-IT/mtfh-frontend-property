import React, { Dispatch, SetStateAction } from "react";

import { Patch } from "@mtfh/common/lib/api/patch/v1";

interface AreaSelectionDialogProps {
  areas: Patch[];
  areaOption: string;
  setAreaOption: Dispatch<SetStateAction<string>>;
}

export const AreaSelectionDialog = ({
  areas,
  areaOption,
  setAreaOption,
}: AreaSelectionDialogProps) => {
  return (
    <>
      <label className="govuk-label lbh-label" htmlFor="searchQuery">
        Area
      </label>
      <select
        className="govuk-select"
        value={areaOption}
        onChange={(e) => setAreaOption(e.target.value)}
        name="areaOption"
        id=""
        style={{ marginTop: 0 }}
        data-testid="area-select"
      >
        <option key="all" value="all">
          All
        </option>
        {areas
          ?.sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((area) => (
            <option key={area.id} value={area.name}>
              {area.name}
            </option>
          ))}
      </select>
    </>
  );
};
