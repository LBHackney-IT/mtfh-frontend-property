import React, { useEffect, useState } from "react";

import { Patch, getAllPatchesAndAreas } from "@mtfh/common/lib/api/patch/v1";
import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@mtfh/common/lib/components";


interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
}


export const PatchAssignmentForm = ({ setShowSuccess, setRequestError }: Props) => {
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);
  const [patchOption, setPatchOption] = useState<string>("");

  useEffect(() => {
    getAllPatchesAndAreas().then((data) => {
      setPatchesAndAreas(data);
    });
  }, []);

  const areas = patchesAndAreas.filter((patchOrArea) => patchOrArea.patchType === "area");

  const PatchTableHeader = (): JSX.Element => {
    return (
      <Thead>
        <Tr>
          <Th>Patch</Th>
          <Th>Area</Th>
          <Th>Assigned Officer</Th>
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
      return (
        <Spinner/>
      );
    }

    if (!patchOption) {
      setPatchOption(areas[0].id);
    }

    let selectedArea = areas.find((area) => area.id === patchOption);
    if (!selectedArea) {
      selectedArea = areas[0];
    }

    patches = patches.filter((patchOrArea) => patchOrArea.parentId === selectedArea?.id);
    console.log(`Patches 93: ${patches}`);

    patches = patches.sort((a, b) => a.name > b.name ? 1 : -1)
    const areaAndPatches = [selectedArea, ...patches];

    return (
      <Tbody>
        {areaAndPatches
          .map((aop) => {
          return (
            <>
              <Tr>
                <Td>{aop.name}</Td>
                <Td>{selectedArea?.name}</Td>
                <Td>{aop.responsibleEntities[0]?.name}</Td>
              </Tr>
            </>
          );
        })}
      </Tbody>
    );
  };

  console.log(areas);
  return (
    <div>
      <form onSubmit={() => {}}>
        <div className="govuk-form-group">
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
            {areas?.sort((a, b) => a.name > b.name ? 1 : -1)
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
              Add New Officer
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
