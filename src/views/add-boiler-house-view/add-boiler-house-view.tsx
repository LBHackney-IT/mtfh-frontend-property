import React, { useEffect, useState } from "react";

import {
  Center,
  ErrorSummary,
  Link,
  Spinner,
  StatusBox,
} from "@mtfh/common/lib/components";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useSearchResults } from "@mtfh/search";
import { axiosInstance } from "@mtfh/common";
import { config } from "@mtfh/common/lib/config";
import { useAsset } from "@mtfh/common/lib/api/asset/v1";

interface Props {
  assetId: string;
}

interface PatchAssetRequest {
  boilerHouseId: string;
}

const patchAsset = async (
  id: string,
  request: PatchAssetRequest,
  assetVersion: string | null,
) => {
  return new Promise<void>((resolve, reject) => {
    axiosInstance
      .patch(`${config.assetApiUrlV1}/assets/${id}`, request, {
        headers: {
          "If-Match": assetVersion,
        },
      })
      .then(() => resolve())
      .catch(() => reject());
  });
};

enum Steps {
  SearchForBoilerHouse,
  SelectBoilerHouse
}

const AddBoilerHouseLayout = ({ assetId }: Props) => {
  const { data: asset } = useAsset(assetId);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryError, setSearchQueryError] = useState<string | null>(null);

  const [boilerHouseOption, setBoilerHouseOption] = useState<string>("");
  const [boilerHouseOptionError, setBoilerHouseOptionError] = useState<string | null>(null);

  const [touched, setTouched] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false)

  // const [currentStep, setCurrentStep] = useState<Steps>(Steps.SearchForBoilerHouse)

  const { fetchResults, total, searchResultsData, loading, error } = useSearchResults([
    "BoilerHouse",
  ]);

  const handleSearch = (e) => {
    e.preventDefault()

    // reset boilerHouse related fields/errors
    setBoilerHouseOptionError(null)
    setBoilerHouseOption("")

    if (searchQuery === "" || searchQuery.length < 2) {
      setSearchQueryError("Search text must be at least 2 characters");
      return;
    }

    setSearchQueryError(null);
    setTouched(true)

    // setCurrentStep(Steps.SelectBoilerHouse)
    fetchResults(searchQuery);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(e.target.boilerHouseOption);


    if (boilerHouseOption === "") {
      setBoilerHouseOptionError("You must select a boiler house")
      return
    }

    setBoilerHouseOptionError(null)
    

    // patchAsset

    const request: PatchAssetRequest = {
      boilerHouseId: boilerHouseOption,
    };

    patchAsset(assetId, request, asset?.versionNumber?.toString() || "")
      .then((res) => {
        console.log({ res });
        setShowSuccess(true)
      })
      .catch((err) => {
        console.error({ err });
      });
  };

  // useEffect(() => {
  //   if (total > 0 && error === null) {
  //     setTouched(true);
  //   }
  // }, [error, total]);

  if (asset === undefined) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Link as={RouterLink} to={`/property/${assetId}`} variant="back-link">
        Back to asset
      </Link>

      {/* <pre>{JSON.stringify(error, null, 2)}</pre> */}

      <p>Option: {boilerHouseOption}</p>

     { showSuccess&&  <StatusBox
        variant="success"
        title={
          <span>
            The boiler house has been added successfully.{" "}
            <Link as={RouterLink} to={`/property/${assetId}`}>
              Return to property
            </Link>
          </span>
        }
      />}

      <h1 className="lbh-heading-h1">Add boiler house to property</h1>
      <span className="govuk-caption-m lbh-caption">Some subtitle text</span>

      {error && (
        <ErrorSummary
          id="patch-asset-error"
          title={error || ""}
          description={error || undefined}
        />
      )}


         <form onSubmit={handleSearch}>
              <div className="govuk-form-group">
            <label className="govuk-label lbh-label" htmlFor="searchQuery">
              Search for a boiler house
            </label>
            <span
              // id="address-line-1-input-error"
              className="govuk-error-message lbh-error-message"
            >
              <span className="govuk-visually-hidden">Error:</span>
              {searchQueryError}
            </span>
            <input
              type="text"
              className="govuk-input lbh-input"
              name="searchQuery"
              value={searchQuery}
              onInput={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="govuk-button lbh-button"
              type="submit"
            >
              Search
            </button>
          </div>
         </form>
  

        {touched && (
            <form onSubmit={handleSubmit}>
      

            {loading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <>
              
              {/* <Link as={RouterLink} to={`/property/${assetId}`} variant="back-link">
          Back to asset
        </Link> */}
  
        {/* <button type="button" className="govuk-back-link lbh-back-link" style={{ background: "none"}}>Change query</button> */}
  
             
                    <div className="govuk-form-group">
                      <label
                        className="govuk-label lbh-label"
                        htmlFor="boilerHouseOption"
                      >
                        Select a boiler house
                      </label>
                      <span
                // id="address-line-1-input-error"
                className="govuk-error-message lbh-error-message"
              >
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
         
              </>
            )}
          </form>
        )}

    
    </>
  );
};

export const AddBoilerHouseView = (): JSX.Element => {
  const { assetId } = useParams<{ assetId: string }>();

  return <AddBoilerHouseLayout assetId={assetId} />;
};
