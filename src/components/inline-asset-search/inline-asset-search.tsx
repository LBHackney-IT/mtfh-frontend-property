import React, { useState } from "react";
import { useSearchResults } from "@mtfh/search";
import { Spinner, Field } from "@mtfh/common";
import { InlineSearchForm } from "../inline-search-form";
import { AssetType } from "@mtfh/common/lib/api/asset/v1";

interface Props {
  assetTypes: AssetType[];
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
  value: string;
}

export const InlineAssetSearch = ({
  assetTypes,
  label,
  name,
  value,
  onChange,
  setFieldValue,
}: Props) => {
  const [touched, setTouched] = useState<boolean>(false);
  const { fetchResults, error, total, searchResultsData, loading } =
    useSearchResults(assetTypes);

  const options = [
    { value: "", label: "-- Select an option --" },
    ...(searchResultsData?.map((x) => ({
      value: x.id,
      label: x.assetAddress.addressLine1,
    })) || []),
  ];

  return (
    <div
      style={{
        borderLeft: "5px solid #0b0c0c",
        paddingLeft: "30px",
        width: "500px",
        boxSizing: "border-box",
      }}
    >
      <label className="govuk-label lbh-label" htmlFor={name}>
        {label}
      </label>

      <InlineSearchForm
        loading={loading}
        onSubmit={(searchText) => {
          console.log({ searchText });

          if (touched) {
            // set field to ""
            setFieldValue(name, "", false);
          }

          setTouched(true);

          fetchResults(searchText);
        }}
      />

      {loading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <>
          {touched && <p>{total || "0"} results found</p>}

          <div className="govuk-form-group lbh-form-group">
            <Field
               // @ts-ignore: it works fine
              as="select"
              disabled={!touched || !total}
              id={name}
              name={name}
              className="govuk-input lbh-input"
              data-testid={name}
              style={{ maxWidth: "100%" }}
              value={value}
              onChange={onChange}
            >
              <>
                {options.map((x, i) => (
                  <option key={i} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </>
            </Field>
          </div>
        </>
      )}
    </div>
  );
};
