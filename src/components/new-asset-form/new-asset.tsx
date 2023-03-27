import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Field, Form, Formik, useFormikContext } from "formik";

import { NewPropertyFormData, newPropertySchema } from "./schema";
import "./styles.scss";
import { AssetType, assetHasFloorNo, assetHasFloors, assetsCanHaveMultipleBedroomsAndLivingRooms } from "../../utils/asset-type";
import { InlineAssetSearch } from "../inline-asset-search";

export const NewAsset = (): JSX.Element => {
  const [submitEditEnabled, setSubmitEditEnabled] = useState<boolean>(true);

  const renderAssetTypeOptions = (): JSX.Element[] => {
    return Object.keys(AssetType).map((key, index) => (
      <option key={index} value={key}>
        {key}
      </option>
    ));
  };

  const handleSubmit = (values: NewPropertyFormData) => {
    console.log(values);
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <>
      <Formik<NewPropertyFormData>
        initialValues={{
          assetId: "",
          assetType: "",
          propertyEstate: "",
          propertyBlock: "",
          propertySubBlock: "",
          floorNo: "",
          totalBlockFloors: null,
          uprn: "",
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          addressLine4: "",
          postcode: "",
          agent: "",
          areaOfficeName: "",
          isCouncilProperty: "",
          managingOrganisation: "",
          isTMOManaged: "",
          numberOfBedrooms: null,
          numberOfLivingRooms: null,
          numberOfLifts: null,
          windowType: "",
          yearConstructed: null,
        }}
        validationSchema={newPropertySchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <div id="new-property-form">

              <pre>{JSON.stringify(values, null, 2)}</pre>

            <Form>
              <div
                className={
                  errors.assetId && touched.assetId
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="assetId">
                  Asset ID
                </label>
                <span
                  id="assetId-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span>
                  {errors.assetId}
                </span>
                <Field
                  id="assetId"
                  name="assetId"
                  className={
                    errors.assetId && touched.assetId
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="assetId"
                />
              </div>
              <div
                className={
                  errors.assetType && touched.assetType
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="assetType">
                  Asset Type
                </label>
                <span
                  id="assetType-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span>
                  {errors.assetType}
                </span>
                <Field
                  as="select"
                  id="asset-type"
                  name="assetType"
                  className={
                    errors.assetType && touched.assetType
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  data-testid="asset-type"
                >
                  <option disabled selected value="">
                    {" "}
                    -- Select an option --{" "}
                  </option>
                  {renderAssetTypeOptions()}
                </Field>
              </div>

              <InlineAssetSearch
                  assetTypes={["Estate"]}
                  name="propertyEstate"
                  label="Estate this property is in"
                  onChange={handleChange}
                  setFieldValue={setFieldValue}
                  value={values.propertyEstate || ""}
              />
         
              <InlineAssetSearch
                  assetTypes={["Block"]}
                  name="propertyBlock"
                  label="Block this property is in"
                  onChange={handleChange}
                  setFieldValue={setFieldValue}
                  value={values.propertyBlock || ""}
              />

              <label className="govuk-label lbh-label" htmlFor="property-sub-block">
                Sub-block this property is in
              </label>
              <Field
                id="property-sub-block"
                name="propertySubBlock"
                className={
                  errors.propertySubBlock && touched.propertySubBlock
                    ? "govuk-input lbh-input govuk-input--error"
                    : "govuk-input lbh-input"
                }
                type="text"
                data-testid="property-sub-block"
              />
              {assetHasFloorNo(values.assetType) && (
                <>
                  <label className="govuk-label lbh-label" htmlFor="floor-no">
                    Floor this property is on
                  </label>
                  <Field
                    id="floor-no"
                    name="floorNo"
                    className="govuk-input lbh-input"
                    data-testid="floor-no"
                  />
                </>
              )}
              {assetHasFloors(values.assetType) && (
                <>
                  <div
                    className={
                      errors.totalBlockFloors && touched.totalBlockFloors
                        ? "govuk-form-group govuk-form-group--error lbh-form-group"
                        : "govuk-form-group lbh-form-group"
                    }
                  >
                    <label className="govuk-label lbh-label" htmlFor="total-block-floors">
                      Number of floors in block
                    </label>
                    <span
                      id="total-block-floors-input-error"
                      className="govuk-error-message lbh-error-message"
                    >
                      <span className="govuk-visually-hidden">Error:</span>
                      {errors.totalBlockFloors}
                    </span>
                    <Field
                      id="total-block-floors"
                      name="totalBlockFloors"
                      className={
                        errors.totalBlockFloors && touched.totalBlockFloors
                          ? "govuk-input lbh-input govuk-input--error"
                          : "govuk-input lbh-input"
                      }
                      type="text"
                      data-testid="total-block-floors"
                    />
                  </div>
                </>
              )}
              <h2 className="lbh-heading-h2">Address</h2>
              <label className="govuk-label lbh-label" htmlFor="uprn">
                UPRN
              </label>
              <Field
                id="uprn"
                name="uprn"
                className="govuk-input lbh-input"
                data-testid="uprn"
              />
              <div
                className={
                  errors.addressLine1 && touched.addressLine1
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="address-line-1">
                  Address line 1
                </label>
                <span
                  id="address-line-1-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span>
                  {errors.addressLine1}
                </span>
                <Field
                  id="address-line-1"
                  name="addressLine1"
                  className={
                    errors.addressLine1 && touched.addressLine1
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="address-line-1"
                />
              </div>
              <label className="govuk-label lbh-label" htmlFor="address-line-2">
                Address line 2
              </label>
              <Field
                id="address-line-2"
                name="addressLine2"
                className="govuk-input lbh-input"
                data-testid="address-line-2"
              />
              <label className="govuk-label lbh-label" htmlFor="address-line-3">
                Address line 3
              </label>
              <Field
                id="address-line-3"
                name="addressLine3"
                className="govuk-input lbh-input"
                data-testid="address-line-3"
              />
              <label className="govuk-label lbh-label" htmlFor="address-line-4">
                Address line 4
              </label>
              <Field
                id="address-line-4"
                name="addressLine4"
                className="govuk-input lbh-input"
                data-testid="address-line-4"
              />
              <div
                className={
                  errors.postcode && touched.postcode
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="postcode">
                  Postcode*
                </label>
                <span
                  id="postcode-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span> {errors.postcode}
                </span>
                <Field
                  id="postcode"
                  name="postcode"
                  className={
                    errors.postcode && touched.postcode
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="postcode"
                />
              </div>
              <h2 className="lbh-heading-h2">Property management</h2>
              <label className="govuk-label lbh-label" htmlFor="agent">
                Agent
              </label>
              <Field
                id="agent"
                name="agent"
                className="govuk-input lbh-input"
                data-testid="agent"
              />
              <label className="govuk-label lbh-label" htmlFor="area-office-name">
                Area office name
              </label>
              <Field
                id="area-office-name"
                name="areaOfficeName"
                className="govuk-input lbh-input"
                data-testid="area-office-name"
              />
              <div
                className={
                  errors.isCouncilProperty && touched.isCouncilProperty
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-label lbh-label">Is LBH property?</legend>
                  <span
                    id="is-lbh-property-error"
                    className="govuk-error-message lbh-error-message"
                  >
                    <span className="govuk-visually-hidden">Error:</span>{" "}
                    {errors.isCouncilProperty}
                  </span>
                  <div className="govuk-radios lbh-radios">
                    <div className="govuk-radios__item">
                      <Field
                        className="govuk-radios__input"
                        id="is-council-property-yes"
                        name="isCouncilProperty"
                        type="radio"
                        value="Yes"
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor="is-council-property-yes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="govuk-radios__item">
                      <Field
                        className="govuk-radios__input"
                        id="is-council-property-no"
                        name="isCouncilProperty"
                        type="radio"
                        value="No"
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor="is-council-property-no"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div
                className={
                  errors.managingOrganisation && touched.managingOrganisation
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="managing-organisation">
                  Managing organisation
                </label>
                <span
                  id="managing-organisation-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span>{" "}
                  {errors.managingOrganisation}
                </span>
                <Field
                  id="managing-organisation"
                  name="managingOrganisation"
                  className={
                    errors.managingOrganisation && touched.managingOrganisation
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="managing-organisation"
                />
              </div>
              <div
                className={
                  errors.isTMOManaged && touched.isTMOManaged
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-label lbh-label">Is TMO managed?</legend>
                  <span
                    id="is-tmo-managed-error"
                    className="govuk-error-message lbh-error-message"
                  >
                    <span className="govuk-visually-hidden">Error:</span>{" "}
                    {errors.isTMOManaged}
                  </span>
                  <div className="govuk-radios lbh-radios">
                    <div className="govuk-radios__item">
                      <Field
                        className="govuk-radios__input"
                        id="is-tmo-managed-yes"
                        name="isTMOManaged"
                        type="radio"
                        value="Yes"
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor="is-tmo-managed-yes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="govuk-radios__item">
                      <Field
                        className="govuk-radios__input"
                        id="is-tmo-managed-no"
                        name="isTMOManaged"
                        type="radio"
                        value="No"
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor="is-tmo-managed-no"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <h2 className="lbh-heading-h2">Asset details</h2>
              {assetsCanHaveMultipleBedroomsAndLivingRooms(values.assetType) &&
                <>
<div
                className={
                  errors.numberOfBedrooms && touched.numberOfBedrooms
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="no-of-bedrooms">
                  Number of bedrooms
                </label>
                <span
                  id="no-of-bedrooms-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span>
                  {errors.numberOfBedrooms}
                </span>
                <Field
                  id="no-of-bedrooms"
                  name="numberOfBedrooms"
                  className={
                    errors.numberOfBedrooms && touched.numberOfBedrooms
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="no-of-bedrooms"
                />
              </div>
              <div
                className={
                  errors.numberOfLivingRooms && touched.numberOfLivingRooms
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="no-of-living-rooms">
                  Number of living rooms
                </label>
                <span
                  id="no-of-living-rooms-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span>
                  {errors.numberOfLivingRooms}
                </span>
                <Field
                  id="no-of-living-rooms"
                  name="numberOfLivingRooms"
                  className={
                    errors.numberOfLivingRooms && touched.numberOfLivingRooms
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="no-of-living-rooms"
                />
              </div>
                </>
              }
              {assetHasFloors(values.assetType) && (
                <>
                  <div
                    className={
                      errors.numberOfLifts && touched.numberOfLifts
                        ? "govuk-form-group govuk-form-group--error lbh-form-group"
                        : "govuk-form-group lbh-form-group"
                    }
                  >
                    <label className="govuk-label lbh-label" htmlFor="no-of-lifts">
                      Number of lifts                </label>
                    <span
                      id="no-of-lifts-input-error"
                      className="govuk-error-message lbh-error-message"
                    >
                      <span className="govuk-visually-hidden">Error:</span>
                      {errors.numberOfLifts}
                    </span>
                    <Field
                      id="no-of-lifts"
                      name="numberOfLifts"
                      className={
                        errors.numberOfLifts && touched.numberOfLifts
                          ? "govuk-input lbh-input govuk-input--error"
                          : "govuk-input lbh-input"
                      }
                      type="text"
                      data-testid="no-of-lifts"
                    />
                  </div>
                </>
              )}
              <label className="govuk-label lbh-label" htmlFor="window-type">
                Window type
              </label>
              <Field
                id="window-type"
                name="windowType"
                className="govuk-input lbh-input"
                data-testid="window-type"
              />
              <div
                className={
                  errors.yearConstructed && touched.yearConstructed
                    ? "govuk-form-group govuk-form-group--error lbh-form-group"
                    : "govuk-form-group lbh-form-group"
                }
              >
                <label className="govuk-label lbh-label" htmlFor="year-constructed">
                  Year constructed
                </label>
                <span
                  id="year-constructed-input-error"
                  className="govuk-error-message lbh-error-message"
                >
                  <span className="govuk-visually-hidden">Error:</span>
                  {errors.yearConstructed}
                </span>
                <Field
                  id="year-constructed"
                  name="yearConstructed"
                  className={
                    errors.yearConstructed && touched.yearConstructed
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="year-constructed"
                />
              </div>
              <div className="new-property-form-actions">
                <button
                  className="govuk-button lbh-button"
                  data-module="govuk-button"
                  type="submit"
                  id="submit-new-property-button"
                  disabled={!submitEditEnabled}
                >
                  Create new property
                </button>

                <RouterLink
                  to="#"
                  className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
                  id="cancel-new-property-button"
                >
                  Cancel
                </RouterLink>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};
