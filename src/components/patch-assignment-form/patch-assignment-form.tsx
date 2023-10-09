import React, { useEffect, useState } from "react";

import { useBoilerHouseOptions } from "./hooks/useBoilerHouseOptions";
import { useSearchForBoilerHouse } from "./hooks/useSearchForBoilerHouse";

import { 
  Center, 
  Spinner,
  Table, 
  Tbody,
  Th,
  Thead,
  Tr,
 } from "@mtfh/common/lib/components";
import { Patch, getAllPatchesAndAreas } from "@mtfh/common/lib/api/patch/v1";

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const PatchAssignmentForm = ({ setShowSuccess, setRequestError }: Props) => {
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);

  const {
    boilerHouseOption,
    setBoilerHouseOption,
    boilerHouseOptionError,
    handleSubmit,
    resetForm: resetSelectBoilerHouseForm,
  } = useBoilerHouseOptions(setShowSuccess, setRequestError);

  const { handleSearch, touched, error, loading, total, searchResultsData } =
    useSearchForBoilerHouse(resetSelectBoilerHouseForm);

  useEffect(() => {
    setRequestError(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);


  // TODO: Fetch data from APIs
  useEffect(() => {
    getAllPatchesAndAreas().then((data) => {
      setPatchesAndAreas(data);
    })  
  }, []);
  
  // const patchGuid = uuidv4();

  // const areaGuid = uuidv4();

  // const housingOfficer = {
  //   id: uuidv4(),
  //   name: "FAKE_Marsha Madonna",
  //   responsibleType: "HousingOfficer",
  // };

  // const areaManager = {
  //   id: uuidv4(),
  //   name: "FAKE_Jane Madonna",
  //   responsibleType: "HousingOfficer",
  // };
  
  // const patchesAndAreas = [
  //   {
  //     id: patchGuid,
  //     domain: "MMH",
  //     name: "E2E",
  //     parentId: areaGuid,
  //     patchType: "patch",
  //     responsibleEntities: [
  //       housingOfficer,
  //     ],
  //     versionNumber: 2,
  //   },
  //   {
  //     id: areaGuid,
  //     domain: "MMH",
  //     name: "A1",
  //     parentId: null,
  //     patchType: "area",
  //     responsibleEntities: [
  //       areaManager,
  //     ],
  //     versionNumber: 2,
  //   },
  // ];

  const areas = patchesAndAreas.filter((patchOrArea) => patchOrArea.patchType === "area");

  console.log(areas);
  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="govuk-form-group">
          <label className="govuk-label lbh-label" htmlFor="searchQuery">
            Area
          </label>
          <select
            className="govuk-select"
            value={boilerHouseOption}
            onChange={(e) => setBoilerHouseOption(e.target.value)}
            name="boilerHouseOption"
            id=""
            style={{ marginTop: 0 }}
            data-testid="select"
          >
            <option value="" data-testid="all-patches">
              All
            </option>
            {areas?.map((area) => (
              <option key={area.id} value={area.id} data-testid="select-option">
                {area.name}
              </option>
            ))}
          </select>
          <Table>
          <Thead>
            <Tr>
              <Th>
                Patch
              </Th>
              <Th>
                Area
              </Th>
              <Th>
                Assigned Officer
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* {results.length === 0 ? (
              <tr className="govuk-table__row process-record">
                <td colSpan={6} className="process-record__no-item">
                  {locale.views.worktray.noWorktrayResults}
                </td>
              </tr>
            ) : (
              results.map((process) => {
                const processConfig =
                  processes[
                    Number.isInteger(process.processName)
                      ? ProcessName[process.processName]
                      : process.processName
                  ];
                const Result = processRecordComponents[process.targetType];
                return (
                  <Result
                    key={process.id}
                    process={process}
                    processConfig={processConfig}
                  />
                );
              })
            )} */}
          </Tbody>
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

      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          {touched && (
            <form onSubmit={handleSubmit}>
             
            </form>
          )}
        </>
      )} 
    </div>
  );
};
