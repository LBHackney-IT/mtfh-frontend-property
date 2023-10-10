import React, { useEffect, useState } from "react";

import {
  Patch,
  getAllPatchesAndAreas,
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
import { config } from "@mtfh/common/lib/config";
import { axiosInstance } from "@mtfh/common/lib/http";

enum ResponsibleType {
  HousingOfficer = "HousingOfficer",
  HousingAreaManager = "HousingAreaManager",
}

interface UpdatePatchesAndAreasRequest {
  id: string;
  name: string;
  responsibleType: ResponsibleType;
}

//TODO: Move to common MFE
//TODO: Call when confirmation button in dialog pressed
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const updatePatchesAndAreasResponsibilities = async (
  patchId: string,
  responsibleEntityId: string,
  request: UpdatePatchesAndAreasRequest,
): Promise<Array<Patch>> => {
  return new Promise<Array<Patch>>((resolve, reject) => {
    axiosInstance
      .patch<Array<Patch>>(
        `${config.patchesAndAreasApiUrlV1}/patch/${patchId}/responsibleEntity/${responsibleEntityId}`,
        {
          headers: {
            "skip-x-correlation-id": true,
          },
          data: request,
        },
      )
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PatchAssignmentForm = ({ setShowSuccess, setRequestError }: Props) => {
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);
  const [patchOption, setPatchOption] = useState<string>("all");
  const [reassigningPatch, setReassigningPatch] = useState<Patch | null>(null);
  const [dialogActive, setDialogActive] = useState(false);

  useEffect(() => {
    getAllPatchesAndAreas().then((data) => {
      setPatchesAndAreas(data);
    });
  }, []);

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

  const PatchTableBody = ({
    patchesAndAreas,
  }: {
    patchesAndAreas: Patch[];
  }): JSX.Element => {
    let patches = patchesAndAreas.filter(
      (patchOrArea) => patchOrArea.patchType === "patch" && patchOrArea.name !== "E2E",
    );
    const areas = patchesAndAreas.filter(
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
      patchTableItems = patchesAndAreas as PatchTableItem[];
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
            setReassigningPatch(areaOrPatch as Patch);
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
          style={{ marginTop: 0, width: "10em" }}
          onClick={(e) => {
            e.preventDefault();
            setPatchOption("all");
            setReassigningPatch(areaOrPatch);
            setDialogActive(true);
          }}
        >
          Assign {officerFirstName}
        </button>
      );
    };

    const DisplayedButton = ({patchBeingReassigned: patchBeingReassigned}: {patchBeingReassigned: Patch | null}, {patch: patch}: {patch: Patch}) => {
      //TODO: Fix
      if (!reassigningPatch) {
        return <ReassignButton areaOrPatch={reassigningPatch} />;
      }
      const reassigningThisEntity =
        patch.responsibleEntities[0]?.name === patchBeingReassigned.name;
      if (reassigningThisEntity) {
        return <AssignButton areaOrPatch={patchBeingReassigned} />;
      }
      return <ReassignButton areaOrPatch={patchBeingReassigned} />;
    };

    return (
      <Tbody>
        {patchTableItems.map((areaOrPatch) => {
          return (
            <>
              <Tr>
                <Td>{areaOrPatch.name}</Td>
                <Td>{areaOrPatch.parentAreaName}</Td>
                <Td>{areaOrPatch.responsibleEntities[0]?.name}</Td>
                <Td>
                  <DisplayedButton patchBeingReassigned={reassigningPatch} patch={areaOrPatch} />
                </Td>
              </Tr>
            </>
          );
        })}
      </Tbody>
    );
  };

  const ConfirmReassignmentDialog = (): JSX.Element => {
    return (
      <Dialog
        isOpen={dialogActive}
        onDismiss={() => {
          setDialogActive(false);
        }}
        title="Switch assignment"
      >
        <p>Reassigning officer A to patch B'</p>
        <p>Reassigning officer B to patch A'</p>

        <DialogActions>
          <Button
            onClick={() => {
              console.log("hello");
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
            <PatchTableBody patchesAndAreas={patchesAndAreas} />
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
