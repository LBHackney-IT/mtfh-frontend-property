import React, { useEffect, useReducer, useState } from "react";

import { Field } from "formik";

import PropertyPatch from "../../../utils/patch";

import { Spinner } from "@mtfh/common";
import { getAllPatchesAndAreas } from "@mtfh/common/lib/api/patch/v1";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";

const initialPatchesState = {
  patches: [new PropertyPatch(1)],
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "add_patch":
      return {
        patches: [...state.patches, action.payload],
      };
    case "remove_patch":
      return {
        patches: state.patches.filter(
          (patch: PropertyPatch) => patch.id !== action.payload,
        ),
      };
    case "patch_edit": {
      const patchIndex = state.patches.findIndex(
        (patch: PropertyPatch) => patch.id === action.payload.patchId,
      );

      state.patches[patchIndex].value = action.payload.targetValue;
      return { patches: state.patches };
    }
    default:
      return state;
  }
}

export const usePatches = () => {
  // This state is used to manage the Patch field(s) in the New Asset form
  const [patchesState, dispatch] = useReducer(reducer, initialPatchesState);

  // Data from API request
  const [patchesAndAreasData, setPatchesAndAreasData] = useState<Patch[]>([]);

  useEffect(() => {
    getAllPatchesAndAreas().then((res) => setPatchesAndAreasData(res));
  }, []);

  const renderPatchOptions = (): JSX.Element[] | undefined => {
    if (patchesAndAreasData) {
      return patchesAndAreasData.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ));
    }
  };

  const generateNewPropertyPatchId = () => {
    const assignedIds = patchesState.patches.map((patch: PropertyPatch) => patch.id);

    // If there are no patches, there will be no assigned Ids,
    // so we start with ID 1, otherwise we pick the next higher/available one.
    return assignedIds.length === 0 ? 1 : Math.max(...assignedIds) + 1;
  };

  const getFullPatchData = (patchesState: any) => {
    // Get patches GUIDs from patchesState
    const patchesGuids = patchesState.patches.map((patch: PropertyPatch) => patch.value);

    // Return full patch objects with the above GUIDs in patchesAndAreasData
    return patchesAndAreasData.filter((patchObject: Patch) =>
      patchesGuids.includes(patchObject.id),
    );
  };

  const renderPatchFormField = () => {
    return (
      <>
        <label className="govuk-label lbh-label" htmlFor="patches">
          Patches
        </label>
        <div id="property-patches-container">{renderPropertyPatches()}</div>
        <div>
          {patchesState.patches.length === 0 ? (
            <button
              className="lbh-link"
              onClick={(e) => handleAddNewPatch(e)}
              data-testid="patch-add-link"
              id="patch-add-link"
            >
              Add a patch
            </button>
          ) : (
            <button
              className="lbh-link"
              onClick={(e) => handleAddNewPatch(e)}
              data-testid="patch-add-link"
              id="patch-add-link"
            >
              Add another patch
            </button>
          )}
        </div>
      </>
    );
  };

  const renderPropertyPatches = () => {
    if (patchesAndAreasData.length) {
      const patches = patchesState.patches.map((patch: PropertyPatch) => {
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
                key={patch.id}
                onChange={(e: any) => handlePatchEdit(e, patch.id)}
              >
                <option disabled value="">
                  {" "}
                  -- Select an option --{" "}
                </option>
                {renderPatchOptions()}
              </Field>
              <button
                className="lbh-link"
                onClick={(e) => handleRemovePatch(e, patch.id)}
                data-testid="patch-remove-link"
                id="patch-remove-link"
              >
                Remove patch
              </button>
            </div>
          </>
        );
      });
      return patches;
    }
    return (
      <div>
        <Spinner />
      </div>
    );
  };

  const handleAddNewPatch = (e: any) => {
    e.preventDefault();
    dispatch({
      type: "add_patch",
      payload: new PropertyPatch(generateNewPropertyPatchId()),
    });
  };

  const handleRemovePatch = (e: any, patchId: number) => {
    e.preventDefault();
    dispatch({ type: "remove_patch", payload: patchId });
  };

  const handlePatchEdit = (e: any, patchId: number) => {
    dispatch({
      type: "patch_edit",
      payload: {
        targetValue: e.target.value,
        patchId,
      },
    });
  };

  return {
    getFullPatchData,
    patchesState,
    renderPatchFormField,
  };
};
