import React, { useEffect, useState } from "react";

import { Patch, getAllPatchesAndAreas, ResponsibleEntity } from "@mtfh/common/lib/api/patch/v1";
import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@mtfh/common/lib/components";


interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
}


export const PatchAssignmentForm = ({ setShowSuccess, setRequestError }: Props) => {
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);

  const [patchOption, setPatchOption] = useState<string>("all");

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
          <Th></Th>
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

    const housingOfficers: ResponsibleEntity[] = patchesAndAreas
    .filter((patch) => patch.patchType === "patch")
    .map(patch => patch.responsibleEntities.filter(officer => officer.responsibleType == "HousingOfficer")[0])

    const officerNames: string[] = housingOfficers.map((officer) => officer.name)
    

    if (areas.length === 0) {
      return (
        <Spinner/>
      );
    }

    interface PatchTableItem extends Patch {
      parentAreaName: string | undefined
    }

    var patchTableItems: PatchTableItem[] = []; 
    if(patchOption == "all")
    {
      console.log(`patchesandAreas: ${patchesAndAreas}`)
      patchTableItems = (patchesAndAreas as PatchTableItem[])
    }
    else 
    {
      var selectedArea = areas.find((area) => area.id === patchOption);
  
      patches = patches.filter(
        (patch) => patch.parentId === selectedArea?.id);
      console.log(`Patches 93: ${patches}`);
      console.log(`selectedArea: ${selectedArea}`)
      patchTableItems.push((selectedArea as PatchTableItem))
      patches.forEach((patch) => {
        patchTableItems.push((patch as PatchTableItem))
      })
    }
    
    patches = patches.sort((a, b) => a.name > b.name ? 1 : -1)
   
    patches.forEach((patch) => {
      let patchListItem = (patch as PatchTableItem);
      let parentArea = areas.filter(area => area.id == patch.parentId)[0];
      patchListItem.parentAreaName = parentArea.name;
      console.log(`patchListItem: ${patchListItem}`)
    });
    patchTableItems
    // .sort((a, b) => {return a.name > b.name ? 1:-1})
    .sort((a,b) => {return a.patchType !== "area" && b.patchType === "area" ? 1: -1});
    
    console.log(patchTableItems)
    // 

    return (
      <Tbody>
        {patchTableItems
          .map((areaOrPatch) => {
          return (
            <>
              <Tr>
                <Td>{areaOrPatch.name}</Td>
                <Td>{areaOrPatch.parentAreaName}</Td>
                <Td>{
                  areaOrPatch.responsibleEntities[0]?.name}
                </Td>
                <Td>
                <button
                  className="govuk-button lbh-button"
                  type="submit"
                  data-testid="submit-button"
                >
                  Reassign
                </button>
                </Td>

              </Tr>
            </>
          );
        })}
      </Tbody>
    );
  };
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
            <option key={"all"} value={"all"} data-testid="select-option">
              All
            </option>
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
