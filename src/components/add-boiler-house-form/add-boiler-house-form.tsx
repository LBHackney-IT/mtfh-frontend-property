import React, { SyntheticEvent, useEffect, useState } from "react";

import { Center, Spinner } from "@mtfh/common/lib/components";
import { useSearchResults } from "@mtfh/search";
import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { PatchAssetRequest, patchAsset } from "./utils";

interface Props {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>;
  assetId: string;
  asset: Asset;
}

export const AddBoilerHouseForm = ({
  setShowSuccess,
  setRequestError,
  assetId,
  asset,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryError, setSearchQueryError] = useState<string | null>(null);

  const [boilerHouseOption, setBoilerHouseOption] = useState<string>("");
  const [boilerHouseOptionError, setBoilerHouseOptionError] = useState<string | null>(
    null,
  );

  const [touched, setTouched] = useState(false);

  const { fetchResults, total, searchResultsData, loading, error } = useSearchResults([
    "BoilerHouse",
  ]);

  useEffect(() => {
    setRequestError(error);
  }, [error]);

  const handleSearch = (e: SyntheticEvent) => {
    e.preventDefault();

    // reset boilerHouse related fields/errors
    setBoilerHouseOptionError(null);
    setBoilerHouseOption("");

    if (searchQuery === "" || searchQuery.length < 2) {
      setSearchQueryError("Search text must be at least 2 characters");
      return;
    }

    setSearchQueryError(null);
    setTouched(true);

    fetchResults(searchQuery);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (boilerHouseOption === "") {
      setBoilerHouseOptionError("You must select a boiler house");
      return;
    }

    setBoilerHouseOptionError(null);
    setRequestError(null);

    const request: PatchAssetRequest = {
      boilerHouseId: boilerHouseOption,
    };

    patchAsset(assetId, request, asset?.versionNumber?.toString() || "")
      .then((res) => {
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error({ err });
        setRequestError(err.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="govuk-form-group">
          <label className="govuk-label lbh-label" htmlFor="searchQuery">
            Search for a boiler house
          </label>
          <span className="govuk-error-message lbh-error-message">
            <span className="govuk-visually-hidden">Error:</span>
            {searchQueryError}
          </span>
          <input
            type="text"
            className="govuk-input lbh-input"
            name="searchQuery"
            value={searchQuery}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
          <button className="govuk-button lbh-button" type="submit">
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
                <span className="govuk-error-message lbh-error-message">
                  <span className="govuk-visually-hidden">Error:</span>
                  {boilerHouseOptionError}
                </span>
                <select
                  className="govuk-select"
                  value={boilerHouseOption}
                  onChange={(e) => setBoilerHouseOption(e.target.value)}
                  name="boilerHouseOption"
                  id=""
                  style={{ marginTop: 0 }}
                >
                  <option value="">
                    {total || 0} result{total !== 1 && "s"} found
                  </option>
                  {searchResultsData?.map(({ id, assetAddress }, i) => (
                    <option key={i} value={id}>
                      {assetAddress.addressLine1}
                    </option>
                  ))}
                </select>
              </div>
              <button className="govuk-button lbh-button" type="submit">
                Add boiler house
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};
