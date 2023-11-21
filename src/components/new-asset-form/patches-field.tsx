import React from "react";

import { Field } from "formik";

import PropertyPatch from "../../utils/patch";

import { Spinner } from "@mtfh/common";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";

export interface PatchesFieldProps {
  patchesState: any;
  dispatch: any;
  patchesData: Patch[];
  areasData: Patch[]; //this is to seperate the areas from the patch
}

export const PatchesField = ({
  patchesState,
  dispatch,
  patchesData,
  areasData,
}: PatchesFieldProps) => {
  const renderAreaOptions = (): JSX.Element[] | undefined => {
    if (areasData) {
      console.log(`${areasData}areas data`);
      return areasData.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ));
    }
  };

  const renderPatchOptions = (): JSX.Element[] | undefined => {
    if (patchesData) {
      console.log(`${patchesData}patches data`);
      return patchesData.map(({ id, name }) => (
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
    if (patchesData.length) {
      const patches = patchesState.patches.map((patch: PropertyPatch) => {
        return (
          <div className="patch" key={patch.id}>
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

  const renderPropertyAreas = () => {
    if (patchesData.length) {
      const areas = patchesState.patches.map((area: PropertyPatch) => {
        return (
          <div className="area" key={area.id}>
            <Field
              as="select"
              id={`patch-dropdown-${area.id}`}
              className="govuk-input lbh-input"
              data-testid={`patch-dropdown-${area.id}`}
              value={area.value}
              onChange={(e: any) => handlePatchEdit(e, area.id)}
            >
              <option disabled value="">
                {" "}
                -- Select an option --{" "}
              </option>
              {renderAreaOptions()}
            </Field>
            <button
              className="lbh-link patch-remove-link"
              onClick={(e) => handleRemovePatch(e, area.id)}
              data-testid={`patch-remove-link-${area.id}`}
              id={`patch-remove-link-${area.id}`}
            >
              Remove area
            </button>
          </div>
        );
      });
      return [areas];
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
      <label className="govuk-label lbh-label" htmlFor="area">
        Area
      </label>
      <div id="property-patches-container">{renderPropertyAreas()}</div>
      <label className="govuk-label lbh-label" htmlFor="patches">
        Patch
      </label>
      <div id="property-patches-container">{renderPropertyPatches()}</div>
      <div>
        {patchesState.patches.length === 0 && (
          <button
            className="lbh-link"
            onClick={(e) => handleAddNewPatch(e)}
            data-testid="patch-add-link"
            id="patch-add-link"
          >
            Add a patch
          </button>
        )}
      </div>
    </>
  );
};
