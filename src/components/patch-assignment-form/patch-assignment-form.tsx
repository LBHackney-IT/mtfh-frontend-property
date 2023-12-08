import React, { useEffect, useState } from "react";

import { assetAdminAuthGroups } from "../../services/config/config";
import { ConfirmReassignmentDialog } from "./components/confirm-reassignment-dialog";
import {
  AssignButton,
  CancelReassignmentButton,
  ReassignButton,
} from "./components/form-buttons";

import { Patch, getAllPatchesAndAreas } from "@mtfh/common/lib/api/patch/v1";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@mtfh/common/lib/components";

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const PatchAssignmentForm = ({ setShowSuccess, setRequestError }: Props) => {
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);
  const [areaOption, setAreaOption] = useState<string>("all");
  const [dialogActive, setDialogActive] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [reassigningPatch, setReassigningPatch] = useState<Patch | null>(null);
  const [switchingWithPatch, setSwitchingWithPatch] = useState<Patch | null>(null);

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

  const onAssignButtonClick = (patch: Patch) => {
    setSwitchingWithPatch(patch);
    setDialogActive(true);
  };

  return (
    <div>
      {!!reassigningPatch && !!switchingWithPatch && (
        <ConfirmReassignmentDialog
          onSuccess={() => {
            setDialogActive(false);
            setShowSuccess(true);
            setReassigningPatch(null);
            setSwitchingWithPatch(null);
          }}
          onDialogCancel={() => setDialogActive(false)}
          setRequestError={setRequestError}
          isOpen={dialogActive}
          reassigningPatch={reassigningPatch}
          switchingWithPatch={switchingWithPatch}
        />
      )}
      <form>
        <div className="govuk-form-group">
          {reassigningPatch && (
            <>
              <h2>
                Reassigning {reassigningPatch?.responsibleEntities[0]?.name} from patch{" "}
                {reassigningPatch.name}
              </h2>
              <CancelReassignmentButton onClick={() => setReassigningPatch(null)} />
            </>
          )}

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
              {patchTableItems.map((areaOrPatch) => {
                const officer = areaOrPatch.responsibleEntities[0];
                const reassigningThisPatch =
                  reassigningPatch && reassigningPatch.id === areaOrPatch.id;
                return (
                  <Tr key={areaOrPatch.id} data-testid={`${areaOrPatch.name}-row`}>
                    <Td>{areaOrPatch.name}</Td>
                    <Td>{areaOrPatch.parentAreaName}</Td>
                    <Td>{officer?.name}</Td>
                    <Td>{officer?.contactDetails?.emailAddress?.toLowerCase()}</Td>
                    {isAuthorisedForGroups(assetAdminAuthGroups) && (
                      <Td>
                        {reassigningThisPatch && (
                          <CancelReassignmentButton
                            onClick={() => setReassigningPatch(null)}
                          />
                        )}
                        {reassigningPatch && !reassigningThisPatch && (
                          <AssignButton
                            reassigningPatch={reassigningPatch as Patch}
                            onClick={() => onAssignButtonClick(areaOrPatch)}
                          />
                        )}
                        {!reassigningPatch && (
                          <ReassignButton
                            onClick={() => setReassigningPatch(areaOrPatch)}
                          />
                        )}
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      </form>
    </div>
  );
};
