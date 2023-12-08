import React, { useEffect, useState } from "react";

import { assetAdminAuthGroups } from "../../services/config/config";
import { AreaSelectionDialog } from "./components/area-selection-dialog";
import {
  CancelReassignmentButton,
  ConfirmReassignmentButton,
  ReassignButton,
} from "./components/form-buttons";

import {
  Patch,
  ResponsibleEntity,
  getAllPatchesAndAreas,
  replacePatchResponsibleEntities,
} from "@mtfh/common/lib/api/patch/v1";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@mtfh/common/lib/components";

interface PatchRow extends Patch {
  parentAreaName?: string;
}

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

  const ReadOnlyRow = ({
    officer,
    areaOrPatch,
  }: {
    officer: ResponsibleEntity;
    areaOrPatch: PatchRow;
  }): JSX.Element => {
    return (
      <>
        <Td>{areaOrPatch.name}</Td>
        <Td>{areaOrPatch.parentAreaName}</Td>
        <Td>{officer?.name}</Td>
        <Td>{officer?.contactDetails?.emailAddress?.toLowerCase()}</Td>
      </>
    );
  };

  const EditableRow = ({
    officer,
    areaOrPatch,
    reassigningThisPatch,
  }: {
    officer: ResponsibleEntity;
    areaOrPatch: PatchRow;
    reassigningThisPatch: boolean | null;
  }): JSX.Element => {
    return (
      <>
        {!reassigningThisPatch ? (
          <ReadOnlyRow officer={officer} areaOrPatch={areaOrPatch} />
        ) : (
          <>
            <Td>{areaOrPatch.name}</Td>
            <Td>{areaOrPatch.parentAreaName}</Td>
            <Td>
              <input
                className="govuk-input"
                type="text"
                name="officerName"
                id=""
                defaultValue={officer?.name}
                data-testid="officer-name-input"
              />
            </Td>
            <Td>
              <input
                className="govuk-input"
                type="text"
                name="officerEmail"
                id=""
                defaultValue={officer?.contactDetails?.emailAddress?.toLowerCase()}
                data-testid="officer-email-input"
              />
            </Td>
          </>
        )}
        <Td>
          {reassigningThisPatch && (
            <>
              <ConfirmReassignmentButton />
              <CancelReassignmentButton onClick={() => setReassigningPatch(null)} />
            </>
          )}
          {!reassigningPatch && (
            <ReassignButton onClick={() => setReassigningPatch(areaOrPatch)} />
          )}
        </Td>
      </>
    );
  };

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

  const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOfficerName = formData.get("officerName") as string;
    const newOfficerEmail = formData.get("officerEmail") as string;

    if (!reassigningPatch) return;
    const currentPatch = patchesAndAreas.find(
      (patch) => patch.id === reassigningPatch.id,
    );
    if (!currentPatch) return;

    const newResEnt: ResponsibleEntity = {
      ...reassigningPatch.responsibleEntities[0],
      name: newOfficerName,
      contactDetails: {
        emailAddress: newOfficerEmail,
      },
    };
    const currentVersionNumber = currentPatch?.versionNumber || 0;
    replacePatchResponsibleEntities(
      reassigningPatch.id,
      [newResEnt],
      currentVersionNumber,
    )
      .then((data) => {
        if (data.status === 200) setShowSuccess(true);
        currentPatch.responsibleEntities[0] = newResEnt;
        currentPatch.versionNumber = currentVersionNumber + 1;
      })
      .catch((error) => {
        setRequestError(error.message);
        setShowSuccess(false);
      })
      .finally(() => {
        setReassigningPatch(null);
      });
  };

  return (
    <div>
      <div className="govuk-form-group">
        <AreaSelectionDialog
          areas={areas}
          areaOption={areaOption}
          setAreaOption={setAreaOption}
        />
        <br />

        {showSpinner && <Spinner />}

        <form onSubmit={handleSubmission}>
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
                  <>
                    <Tr key={areaOrPatch.id} data-testid={`${areaOrPatch.name}-row`}>
                      {isAuthorisedForGroups(assetAdminAuthGroups) ? (
                        <EditableRow
                          officer={officer}
                          areaOrPatch={areaOrPatch}
                          reassigningThisPatch={reassigningThisPatch}
                        />
                      ) : (
                        <ReadOnlyRow officer={officer} areaOrPatch={areaOrPatch} />
                      )}
                    </Tr>
                  </>
                );
              })}
            </Tbody>
          </Table>
        </form>
      </div>
    </div>
  );
};
