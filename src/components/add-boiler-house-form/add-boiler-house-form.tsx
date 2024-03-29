import React, { useEffect } from "react";

import { useBoilerHouseOptions } from "./hooks/useBoilerHouseOptions";
import { useSearchForBoilerHouse } from "./hooks/useSearchForBoilerHouse";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Center, Spinner } from "@mtfh/common/lib/components";

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
  asset: Asset;
}

export const AddBoilerHouseForm = ({ setShowSuccess, setRequestError, asset }: Props) => {
  const {
    boilerHouseOption,
    setBoilerHouseOption,
    boilerHouseOptionError,
    handleSubmit,
    resetForm: resetSelectBoilerHouseForm,
  } = useBoilerHouseOptions(asset, setShowSuccess, setRequestError);

  const {
    searchQuery,
    setSearchQuery,
    searchQueryError,
    handleSearch,
    touched,
    error,
    loading,
    total,
    searchResultsData,
  } = useSearchForBoilerHouse(resetSelectBoilerHouseForm);

  useEffect(() => {
    setRequestError(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="govuk-form-group">
          <label className="govuk-label lbh-label" htmlFor="searchQuery">
            Search for a boiler house
          </label>
          <span
            className="govuk-error-message lbh-error-message"
            data-testid="boiler-house-search-error"
          >
            <span className="govuk-visually-hidden">Error: </span>
            {searchQueryError}
          </span>
          <input
            type="text"
            className="govuk-input lbh-input"
            name="searchQuery"
            value={searchQuery}
            data-testid="boiler-house-search-input"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
          <button
            className="govuk-button lbh-button"
            data-testid="boiler-house-search-submit"
            type="submit"
          >
            Search
          </button>
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
