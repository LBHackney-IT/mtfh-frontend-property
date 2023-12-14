import React, { useEffect, useState } from "react";

import { AreaSelectionDialog } from "./components/area-selection-dialog";
import { TableRow } from "./components/rows";

import { Patch, getAllPatchesAndAreas } from "@mtfh/common/lib/api/patch/v1";
import { Spinner, Table, Tbody, Th, Thead, Tr } from "@mtfh/common/lib/components";

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const PatchAssignmentForm = ({ setShowSuccess, setRequestError }: Props) => {
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);
  const [areaOption, setAreaOption] = useState<string>("all");
  const [showSpinner, setShowSpinner] = useState(false);
  const [reassigningPatch, setReassigningPatch] = useState<Patch | null>(null);

  useEffect(() => {
    setShowSpinner(true);
    getAllPatchesAndAreas().then((data) => {
      data = data.filter((patchOrArea) => !["E2E", "Hackney"].includes(patchOrArea.name));
      setPatchesAndAreas(data);
      setShowSpinner(false);
    });
  }, []);

  const areas = patchesAndAreas
    .filter((patchOrArea) => patchOrArea.patchType === "area")
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  // Returns the patches/areas that match the dropdown option and attaches parent area name
  const patchTableItems = patchesAndAreas
    .filter((patchOrArea) => {
      if (areaOption === "all" || areaOption === patchOrArea.name) return true;
      const parentArea = areas.find((area) => area.name === areaOption);
      return patchOrArea.parentId === parentArea?.id;
    })
    .map((patchOrArea) => {
      return {
        ...patchOrArea,
        parentAreaName: areas.find((area) => area.id === patchOrArea.parentId)?.name,
      };
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .sort((a, b) => (a.patchType !== "area" && b.patchType === "area" ? 1 : -1));

  function displaySubmissionStatus(success: boolean, patch: Patch, error?: Error) {
    if (success) {
      const matchingPatch = patchesAndAreas.find(
        (patchOrArea) => patchOrArea.id === patch.id,
      );
      if (!matchingPatch) return;
      matchingPatch.responsibleEntities[0] = patch.responsibleEntities[0];
      setPatchesAndAreas([...patchesAndAreas]);
      setShowSuccess(true);
      setReassigningPatch(null);
    } else {
      setRequestError(error?.message || "An error occurred");
    }
  }

  return (
    <div>
      <section className="lbh-page-announcement lbh-page-announcement--info">
        <h3 className="lbh-page-announcement__title">
          Each person should only be assigned to one patch or area
        </h3>
        <div className="lbh-page-announcement__content">
          <p>This ensures processes are correctly displayed on their worktray</p>
        </div>
      </section>
      <div className="govuk-form-group">
        <AreaSelectionDialog
          areas={areas}
          areaOption={areaOption}
          setAreaOption={setAreaOption}
        />
        <br />

        {showSpinner && <Spinner />}
        <Table>
          <Thead>
            <Tr>
              <Th>Patch</Th>
              <Th>Area</Th>
              <Th>Assigned Officer</Th>
              <Th>Contact</Th>
              <Th />
            </Tr>
          </Thead>

          <Tbody>
            {patchTableItems.map((areaOrPatchTableItem) => {
              const areaOrPatch = patchesAndAreas.find(
                (patchOrArea) => patchOrArea.id === areaOrPatchTableItem.id,
              );
              if (!areaOrPatch) return null;

              const reassigningThisPatch = reassigningPatch
                ? reassigningPatch.id === areaOrPatchTableItem.id
                : false;

              return (
                <>
                  <Tr
                    key={areaOrPatchTableItem.id}
                    data-testid={`${areaOrPatchTableItem.name}-row`}
                  >
                    <TableRow
                      areaOrPatch={areaOrPatchTableItem}
                      reassigningThisPatch={reassigningThisPatch}
                      setReassigningPatch={setReassigningPatch}
                      handleSubmission={displaySubmissionStatus}
                    />
                  </Tr>
                </>
              );
            })}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};
