import React, { useEffect, useState } from "react";

import {
  Patch,
  ResponsibleEntity,
  getAllPatchesAndAreas,
  replacePatchResponsibleEntities,
} from "@mtfh/common/lib/api/patch/v1";
import {
  Button,
  Dialog,
  DialogActions,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@mtfh/common/lib/components";

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PatchAssignmentForm = ({ setShowSuccess, setRequestError }: Props) => {
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);
  const [patchOption, setPatchOption] = useState<string>("all");
  const [dialogActive, setDialogActive] = useState(false);

  const [reassigningPatch, setReassigningPatch] = useState<Patch | null>(null);
  const [switchingWithPatch, setSwitchingWithPatch] = useState<Patch | null>(null);

  useEffect(() => {
    getAllPatchesAndAreas().then((data) => {
      setPatchesAndAreas(data);
    });
  }, []);

  /**
   * Switches the first assigned responsible entity (housing officer or area manager) of two patches / areas
   * @param patchA - A patch or area to switch first assigned officer with patchB
   * @param patchB - A patch or area to switch first assigned officer with patchA
   * @returns bool for whether the update was successful
   */
  function switchPatchAssignments(patchA: Patch, patchB: Patch): boolean {
    if (!patchA.versionNumber) patchA.versionNumber = 0;
    if (!patchB.versionNumber) patchB.versionNumber = 0;
    if (!patchA || !patchB) return false;

    const patchAResEnts = patchA.responsibleEntities;
    const patchBResEnts = patchB.responsibleEntities;

    const patches = [patchA, patchB];
    patches.forEach((patch: Patch) => {
      const otherPatchResEnts = patch === patchA ? patchBResEnts : patchAResEnts;

      const request: ResponsibleEntity[] = [...otherPatchResEnts];
      if (!patch.versionNumber) patch.versionNumber = 0;
      replacePatchResponsibleEntities(patch.id, request, patch.versionNumber)
        .then((res) => {
          if (res.status !== 204) {
            throw new Error(`${res.data.message}`);
          }
          patch.versionNumber = patch.versionNumber ? patch.versionNumber + 1 : 1;
          patch.responsibleEntities = otherPatchResEnts;
        })
        .then(() => {
          setDialogActive(false);
        })
        .catch((err) => {
          setRequestError(
            `Error switching patch assignments for ${patchA.name} and ${patchB.name}: Status ${err.response.status}, Message ${err.message}`,
          );
          return false;
        });
    });
    patchA.responsibleEntities = patchBResEnts;
    patchB.responsibleEntities = patchAResEnts;
    setShowSuccess(true);
    setReassigningPatch(null);
    setSwitchingWithPatch(null);
    return true;
  }

  const areas = patchesAndAreas
    .filter((patchOrArea) => patchOrArea.patchType === "area")
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const CancelReassignmentButton = (): JSX.Element => {
    return (
      <button
        className="govuk-button lbh-button"
        style={{ marginTop: 0 }}
        onClick={(e) => {
          e.preventDefault();
          setReassigningPatch(null);
        }}
      >
        Cancel
      </button>
    );
  };

  const PatchTableHeader = (): JSX.Element => {
    return (
      <Thead>
        <Tr>
          <Th>Patch</Th>
          <Th>Area</Th>
          <Th>Assigned Officer</Th>
          <Th />
        </Tr>
      </Thead>
    );
  };

  const PatchTableBody = ({ tableItems }: { tableItems: Patch[] }): JSX.Element => {
    let patches = tableItems.filter(
      (patchOrArea) => patchOrArea.patchType === "patch" && patchOrArea.name !== "E2E",
    );
    const areas = tableItems.filter(
      (patchOrArea) => patchOrArea.patchType === "area" && patchOrArea.name !== "E2E",
    );

    if (areas.length === 0) {
      return <Spinner />;
    }

    interface PatchTableItem extends Patch {
      parentAreaName: string | undefined;
    }

    let patchTableItems: PatchTableItem[] = [];
    if (patchOption === "all") {
      patchTableItems = tableItems as PatchTableItem[];
    } else {
      const selectedArea = areas.find((area) => area.id === patchOption);

      patches = patches.filter((patch) => patch.parentId === selectedArea?.id);
      patchTableItems.push(selectedArea as PatchTableItem);
      patches.forEach((patch) => {
        patchTableItems.push(patch as PatchTableItem);
      });
    }

    patches.forEach((patch) => {
      const patchListItem = patch as PatchTableItem;
      const parentArea = areas.filter((area) => area.id === patch.parentId)[0];
      patchListItem.parentAreaName = parentArea.name;
    });

    patchTableItems = patchTableItems.sort((a, b) => (a.name > b.name ? 1 : -1));

    patchTableItems.sort((a, b) => {
      return a.patchType !== "area" && b.patchType === "area" ? 1 : -1;
    });

    const ReassignButton = ({
      areaOrPatch,
    }: {
      areaOrPatch: PatchTableItem | Patch;
    }): JSX.Element => {
      return (
        <button
          className="govuk-button lbh-button"
          style={{ marginTop: 0, width: "10em" }}
          onClick={(e) => {
            e.preventDefault();
            setPatchOption("all");
            setReassigningPatch(areaOrPatch);
          }}
        >
          Reassign
        </button>
      );
    };

    const AssignButton = ({
      areaOrPatch,
    }: {
      areaOrPatch: PatchTableItem | Patch;
    }): JSX.Element => {
      const reassigningOfficer = reassigningPatch?.responsibleEntities[0];
      const officerFirstName = reassigningOfficer?.name.split(" ")[0];
      return (
        <button
          className="govuk-button lbh-button"
          style={{ marginTop: 0, maxHeight: "2.5em" }}
          onClick={(e) => {
            e.preventDefault();
            setSwitchingWithPatch(areaOrPatch);
            setDialogActive(true);
          }}
        >
          Assign {officerFirstName}
        </button>
      );
    };

    const DisplayedButton = ({ patch }: { patch: Patch }) => {
      if (!reassigningPatch) {
        return <ReassignButton areaOrPatch={patch} />;
      }
      const reassigningThisEntity = patch.id === reassigningPatch.id;
      if (reassigningThisEntity) {
        return <CancelReassignmentButton />;
      }
      return <AssignButton areaOrPatch={patch} />;
    };

    return (
      <Tbody>
        {patchTableItems.map((areaOrPatch) => {
          return (
            <>
              <Tr key={areaOrPatch.id}>
                <Td>{areaOrPatch.name}</Td>
                <Td>{areaOrPatch.parentAreaName}</Td>
                <Td>{areaOrPatch.responsibleEntities[0]?.name}</Td>
                <Td>
                  <DisplayedButton patch={areaOrPatch} />
                </Td>
              </Tr>
            </>
          );
        })}
      </Tbody>
    );
  };

  const ConfirmReassignmentDialog = (): JSX.Element => {
    if (!reassigningPatch || !switchingWithPatch) return <></>;
    return (
      <Dialog
        isOpen={dialogActive}
        onDismiss={() => {
          setDialogActive(false);
        }}
        title="Switch assignment"
      >
        <p>
          Reassigning <strong>{reassigningPatch?.responsibleEntities[0].name}</strong> to{" "}
          <strong>{switchingWithPatch?.name}</strong>
        </p>
        <p>
          Reassigning <strong>{switchingWithPatch?.responsibleEntities[0].name}</strong>{" "}
          to <strong>{reassigningPatch?.name}</strong>
        </p>

        <DialogActions>
          <Button
            onClick={() => {
              if (!reassigningPatch || !switchingWithPatch) return;
              switchPatchAssignments(reassigningPatch, switchingWithPatch);
            }}
          >
            Confirm
          </Button>

          <Link
            as="button"
            onClick={() => {
              setDialogActive(false);
            }}
          >
            Cancel
          </Link>
        </DialogActions>
      </Dialog>
    );
  };

  const ReassignmentOfficerOptions = ({ patch }: { patch: Patch }): JSX.Element => {
    const officer = patch.responsibleEntities[0];
    return (
      <>
        <h2>
          Reassigning {officer.name} from patch {patch.name}
        </h2>

        <div>
          <CancelReassignmentButton />
        </div>
      </>
    );
  };

  return (
    <div>
      <ConfirmReassignmentDialog />
      <form onSubmit={() => {}}>
        <div className="govuk-form-group">
          {reassigningPatch && <ReassignmentOfficerOptions patch={reassigningPatch} />}

          <label className="govuk-label lbh-label" htmlFor="searchQuery">
            Area
          </label>
          <select
            className="govuk-select"
            value={patchOption}
            onChange={(e) => setPatchOption(e.target.value)}
            name="boilerHouseOption"
            id=""
            style={{ marginTop: 0 }}
            data-testid="select"
          >
            <option key="all" value="all" data-testid="select-option">
              All
            </option>
            {areas
              ?.sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((area) => (
                <option key={area.id} value={area.id} data-testid="select-option">
                  {area.name}
                </option>
              ))}
          </select>

          <Table>
            <PatchTableHeader />
            <PatchTableBody tableItems={patchesAndAreas} />
          </Table>

          <div>
            <button
              className="govuk-button lbh-button"
              type="button"
              data-testid="new-officer-button"
            >
              Replace Officer
            </button>
          </div>
          <div>
            <button
              className="govuk-button lbh-button"
              type="submit"
              data-testid="submit-button"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
