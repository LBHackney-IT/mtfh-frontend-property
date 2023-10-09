import React, { useEffect } from "react";

import { useBoilerHouseOptions } from "./hooks/useBoilerHouseOptions";
import { useSearchForBoilerHouse } from "./hooks/useSearchForBoilerHouse";

import { Center, Spinner } from "@mtfh/common/lib/components";

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const PatchAssignmentForm = ({ setShowSuccess, setRequestError }: Props) => {
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

  const patchGuid = uuidv4();

  // TODO: Fetch data from APIs
  const patchesAndAreas = [
    {
      id: patchGuid,
      domain: "MMH",
      name: "E2E",
      parentId: "c55661e6-34ed-4102-982e-c39b893e9312",
      patchType: "patch",
      responsibleEntities: [
        {
          id: "77835428-616d-475f-a947-794774ed028b",
          name: "FAKE_Marsha Madonna",
          responsibleType: "HousingOfficer",
        },
      ],
      versionNumber: 2,
    },
    {
      id: "c55661e6-34ed-4102-982e-c39b893e9312",
      domain: "MMH",
      name: "A1",
      parentId: "00000000-0000-0000-0000-000000000000",
      patchType: "area",
      responsibleEntities: [
        {
          id: "77835428-616d-475f-a947-794774ed028b",
          name: "FAKE_Marsha Madonna",
          responsibleType: "HousingOfficer",
        },
      ],
      versionNumber: 2,
    },
  ];
  const areas = patchesAndAreas.filter((patch) => patch.patchType === "area");

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
              <div className="govuk-form-group">
                <label className="govuk-label lbh-label" htmlFor="boilerHouseOption">
                  Select a boiler house
                </label>
                <span
                  className="govuk-error-message lbh-error-message"
                  data-testid="boiler-house-submit-error"
                >
                  <span className="govuk-visually-hidden">Error: </span>
                  {boilerHouseOptionError}
                </span>
                <select
                  className="govuk-select"
                  value={boilerHouseOption}
                  onChange={(e) => setBoilerHouseOption(e.target.value)}
                  name="boilerHouseOption"
                  id=""
                  style={{ marginTop: 0 }}
                  data-testid="select"
                >
                  <option value="" data-testid="boiler-house-search-results-total">
                    {total ?? 0} result{total !== 1 && "s"} found
                  </option>
                  {searchResultsData?.map(({ id, assetAddress }) => (
                    <option key={id} value={id} data-testid="select-option">
                      {assetAddress.addressLine1}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="govuk-button lbh-button"
                type="submit"
                data-testid="boiler-house-submit-button"
              >
                Add boiler house
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};
