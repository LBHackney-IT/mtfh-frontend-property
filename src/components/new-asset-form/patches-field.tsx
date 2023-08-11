import React from "react";

import { Field } from "formik";

import PropertyPatch from "../../utils/patch";

import { Spinner } from "@mtfh/common";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";

export interface PatchesFieldProps {
  patchesState: any;
  dispatch: any;
  patchesAndAreasData: Patch[];
}

export const PatchesField = ({
  patchesState,
  dispatch,
  patchesAndAreasData,
}: PatchesFieldProps) => {
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

  const renderPropertyPatches = () => {
    if (patchesAndAreasData.length) {
      const patches = patchesState.patches.map((patch: PropertyPatch) => {
        return (
          <React.Fragment key={patch.id}>
            <div className="patch">
              <Field
                as="select"
                id={`patch-dropdown-${patch.id}`}
                className="govuk-input lbh-input"
                data-testid={`patch-dropdown-${patch.id}`}
                value={patch.value}
                onChange={(e: any) => handlePatchEdit(e, patch.id)}
              >
                <option disabled value="">
                  {" "}
                  -- Select an option --{" "}
                </option>
                {renderPatchOptions()}
              </Field>
              <button
                className="lbh-link patch-remove-link"
                onClick={(e) => handleRemovePatch(e, patch.id)}
                data-testid={`patch-remove-link-${patch.id}`}
                id={`patch-remove-link-${patch.id}`}
              >
                Remove patch
              </button>
            </div>
          </React.Fragment>
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
