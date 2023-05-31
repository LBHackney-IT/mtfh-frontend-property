import React, { useState, useReducer, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Field, Form, Formik } from "formik";

import "./styles.scss";

import { assetToCreateAssetAddressRequest } from "../../factories/requestFactory";
import { locale } from "../../services";
import {
  AssetType,
  assetHasFloorNo,
  assetHasFloors,
  assetIsOfDwellingType,
} from "../../utils/asset-type";
import { InlineAssetSearch } from "../inline-asset-search";
import { NewPropertyFormData, newPropertySchema } from "./schema";
import { renderAreaOfficeNamesOptions } from "./utils/area-office-names";
import { renderManagingOrganisationOptions } from "./utils/managing-organisations";

import { Center, Spinner, axiosInstance } from "@mtfh/common";
import { createAsset } from "@mtfh/common/lib/api/asset/v1";
import { CreateNewAssetRequest } from "@mtfh/common/lib/api/asset/v1/types";
import PropertyPatch from "../../utils/patch";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";

const initialPatchesState = {
  patches: [new PropertyPatch(1, "")],
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'add_patch':
      return {
        patches: [...state.patches, action.payload],
      }
    case 'remove_patch':
      return {
        patches: state.patches.filter(
          (patch: any) => patch.id !== action.payload.id
        ),
      }
    case 'patch_edit': {
      const patchIndex = state.patches.findIndex(
        (patch: any) => patch.id == action.payload.patchId
      )

      state.patches[patchIndex].value =
        action.payload.targetValue
      return { patches: state.patches }
    }
    default:
      return state
  }
}

const getAllPatchesAndAreas = async (): Promise<Array<Patch>> => {
  return new Promise<Array<Patch>>((resolve, reject) => {
    axiosInstance
      .get<Array<Patch>>("https://2eqzdakhz2.execute-api.eu-west-2.amazonaws.com/development/api/v1/patch/all")
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export interface Props {
  setShowSuccess: (value: boolean) => void;
  setShowError: (value: boolean) => void;
  setErrorHeading: (error: string | null) => void;
  setErrorDescription: (error: string | null) => void;
  setNewProperty: (asset: CreateNewAssetRequest) => void;
}

export const NewAsset = ({
  setShowSuccess,
  setShowError,
  setErrorHeading,
  setErrorDescription,
  setNewProperty,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  // This state is used to manage the Patch field(s) in the form
  const [patchesState, dispatch] = useReducer(reducer, initialPatchesState);

  const [patchesAndAreasData, setPatchesAndAreasData] = useState<Patch[]>([]);

  useEffect(() => {
    getAllPatchesAndAreas().then(res => setPatchesAndAreasData(res));
  }, [])


  const renderAssetTypeOptions = (): JSX.Element[] => {
    return Object.keys(AssetType).map((key, index) => (
      <option key={index} value={key}>
        {key}
      </option>
    ));
  };

  const renderPatchOptions = (): JSX.Element[] | undefined => {
    if (patchesAndAreasData) {
      return patchesAndAreasData.map(({id, name}) => (
        <option key={id} value={id}>
          {name}
        </option>
      ));
    }
  };

  const generateNewPropertyPatchId = () => {
    const assignedIds = patchesState.patches.map((patch: any) => patch.id)

    // If there are no patches, there will be no assigned Ids,
    // so we start with ID 1, otherwise we pick the next higher/available one.
    return assignedIds.length == 0 ? 1 : Math.max(...assignedIds) + 1
  }

  const renderPropertyPatches = () => {
    const patches = patchesState.patches.map((patch: any) => {
      return (
        <>
          <div id="patch" key={patch.id}>
            <Field
              as="select"
              id="patches"
              name="patches"
              className="govuk-input lbh-input"
              data-testid="patches"
              value={patch.value}
            >
              <option disabled value="">
                {" "}
                -- Select an option --{" "}
              </option>
              {renderPatchOptions()}
            </Field>
            <button
              className="lbh-link"
              role="button"
              onClick={(e) => handleRemovePatch(e, patch)}
              data-testid="patch-remove-link"
              id="patch-remove-link"
              onChange={(e) =>
                handlePatchEdit(e, patch.id)
              }
            >
              Remove patch
            </button>
          </div>
        </>
      )
    })
    return patches;
  }

  const handleAddNewPatch = (e: any) => {
    e.preventDefault()
    dispatch({
      type: 'add_patch',
      payload: new PropertyPatch(generateNewPropertyPatchId()),
    })
  }

  const handleRemovePatch = (e: any, patch: any) => {
    e.preventDefault()
    dispatch({ type: 'remove_patch', payload: patch })
  }

  const handlePatchEdit = (e: any, patchId: any) => {
    dispatch({
      type: 'patch_edit',
      payload: {
        targetValue: e.target.value,
        patchId: patchId,
      },
    })
  }

  const handleSubmit = async (values: NewPropertyFormData) => {
    setShowSuccess(false);
    setShowError(false);
    setErrorHeading(null);
    setErrorDescription(null);

    const asset = assetToCreateAssetAddressRequest(values);

    setLoading(true);
    await createAsset(asset)
      .then(() => {
        setNewProperty(asset);
        setShowSuccess(true);
      })
      .catch(() => {
        setShowError(true);
        setErrorHeading(locale.errors.unableToCreateNewAsset);
        setErrorDescription(locale.errors.tryAgainOrContactSupport);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Formik<NewPropertyFormData>
        initialValues={{
          assetId: "",
          assetType: "",
          propertyEstate: "",
          propertyBlock: "",
          // propertySubBlock: "",
          floorNo: "",
          totalBlockFloors: undefined,
          uprn: "",
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          addressLine4: "",
          postcode: "",
          postPreamble: "",
          agent: "",
          areaOfficeName: "",
          isCouncilProperty: "",
          managingOrganisation: "London Borough of Hackney",
          isTMOManaged: "",
          numberOfBedrooms: undefined,
          numberOfLivingRooms: undefined,
          numberOfLifts: undefined,
          windowType: "",
          yearConstructed: undefined,
        }}
        validationSchema={newPropertySchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <div id="new-property-form">
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}

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
                  <span className="govuk-visually-hidden" data-testid="error-asset-id">
                    Error:
                  </span>
                  {errors.assetId}
                </span>
                <Field
                  id="asset-id"
                  name="assetId"
                  className={
                    errors.assetId && touched.assetId
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  type="text"
                  data-testid="asset-id"
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
                  <span className="govuk-visually-hidden" data-testid="error-asset-type">
                    Error:
                  </span>
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
                  <option disabled value="">
                    {" "}
                    -- Select an option --{" "}
                  </option>
                  {renderAssetTypeOptions()}
                </Field>
              </div>
              {values.assetType !== "Estate" && (
                <InlineAssetSearch
                  assetTypes={["Estate"]}
                  name="propertyEstate"
                  label="Estate this property is in"
                  onChange={handleChange}
                  setFieldValue={setFieldValue}
                  value={values.propertyEstate || ""}
                />
              )}
              {values.assetType !== "Block" && values.assetType !== "Estate" && (
                <InlineAssetSearch
                  assetTypes={["Block"]}
                  name="propertyBlock"
                  label="Block this property is in"
                  onChange={handleChange}
                  setFieldValue={setFieldValue}
                  value={values.propertyBlock || ""}
                />
              )}
              {/* {values.assetType !== "Block" && values.assetType !== "Estate" && (
                <>
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
                </>
              )} */}
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
                      <span
                        className="govuk-visually-hidden"
                        data-testid="error-total-block-floors"
                      >
                        Error:
                      </span>
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
              <label className="govuk-label lbh-label" htmlFor="post-preamble">
                Post preamble
              </label>
              <Field
                id="post-preamble"
                name="postPreamble"
                className="govuk-input lbh-input"
                data-testid="post-preamble"
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
                  <span
                    className="govuk-visually-hidden"
                    data-testid="error-address-line-1"
                  >
                    Error:
                  </span>
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
                  <span className="govuk-visually-hidden" data-testid="error-postcode">
                    Error:
                  </span>{" "}
                  {errors.postcode}
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
                as="select"
                id="area-office-name"
                name="areaOfficeName"
                className="govuk-input lbh-input"
                data-testid="area-office-name"
              >
                <option disabled value="">
                  {" "}
                  -- Select an option --{" "}
                </option>
                {renderAreaOfficeNamesOptions()}
              </Field>
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
                    <span
                      className="govuk-visually-hidden"
                      data-testid="error-is-council-property"
                    >
                      Error:
                    </span>{" "}
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
                        data-testid="is-council-property-yes"
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
                        data-testid="is-council-property-no"
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
                  <span
                    className="govuk-visually-hidden"
                    data-testid="error-managing-organisation"
                  >
                    Error:
                  </span>{" "}
                  {errors.managingOrganisation}
                </span>
                <Field
                  as="select"
                  id="managing-organisation"
                  name="managingOrganisation"
                  className={
                    errors.managingOrganisation && touched.managingOrganisation
                      ? "govuk-input lbh-input govuk-input--error"
                      : "govuk-input lbh-input"
                  }
                  data-testid="managing-organisation"
                >
                  <option disabled value="">
                    {" "}
                    -- Select an option --{" "}
                  </option>
                  {renderManagingOrganisationOptions()}
                </Field>
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
                    <span
                      className="govuk-visually-hidden"
                      data-testid="error-is-tmo-managed"
                    >
                      Error:
                    </span>{" "}
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
                        data-testid="is-tmo-managed-yes"
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
                        data-testid="is-tmo-managed-no"
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
              <label className="govuk-label lbh-label" htmlFor="patches">
                Patches
              </label>
              <div id="property-patches-container">
                {renderPropertyPatches()}
              </div>
              <div>
                {patchesState.patches.length == 0 ? (
                  <a
                    className="lbh-link"
                    href="#"
                    onClick={(e) => handleAddNewPatch(e)}
                    data-testid="add-patch-link"
                  >
                    Add a patch
                  </a>
                ) : (
                  <a
                    className="lbh-link"
                    href="#"
                    onClick={(e) => handleAddNewPatch(e)}
                    data-testid="add-patch-link"
                  >
                    Add another patch
                  </a>
                )}
              </div>
              <h2 className="lbh-heading-h2">Asset details</h2>
              {assetIsOfDwellingType(values.assetType) && (
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
                      <span
                        className="govuk-visually-hidden"
                        data-testid="error-no-of-bedrooms"
                      >
                        Error:
                      </span>
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
                      <span
                        className="govuk-visually-hidden"
                        data-testid="error-no-of-living-rooms"
                      >
                        Error:
                      </span>
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
              )}
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
                      Number of lifts{" "}
                    </label>
                    <span
                      id="no-of-lifts-input-error"
                      className="govuk-error-message lbh-error-message"
                    >
                      <span
                        className="govuk-visually-hidden"
                        data-testid="error-no-of-lifts"
                      >
                        Error:
                      </span>
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
                  <span className="govuk-visually-hidden" data-testid="year-constructed">
                    Error:
                  </span>
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
                // disabled={!submitEditEnabled}
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
