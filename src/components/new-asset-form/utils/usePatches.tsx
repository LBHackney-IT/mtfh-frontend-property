import React, { useEffect, useReducer, useState } from "react";
import PropertyPatch from "../../../utils/patch"
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";
import { Field } from "formik";
import { Spinner } from "@mtfh/common";
import { getAllPatchesAndAreas } from "@mtfh/common/lib/api/patch/v1";

const initialPatchesState = {
    patches: [new PropertyPatch(1)],
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

            state.patches[patchIndex].value = action.payload.targetValue
            return { patches: state.patches }
        }
        default:
            return state
    }
}

export const usePatches = () => {

    // This state is used to manage the Patch field(s) in the New Asset form
    const [patchesState, dispatch] = useReducer(reducer, initialPatchesState);

    // Data from API request
    const [patchesAndAreasData, setPatchesAndAreasData] = useState<Patch[]>([]);

    useEffect(() => {
        getAllPatchesAndAreas().then(res => setPatchesAndAreasData(res));
    }, [])

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
        const assignedIds = patchesState.patches.map((patch: any) => patch.id)

        // If there are no patches, there will be no assigned Ids,
        // so we start with ID 1, otherwise we pick the next higher/available one.
        return assignedIds.length == 0 ? 1 : Math.max(...assignedIds) + 1
    }

    const getFullPatchData = (patchesState: any) => {
        // Get patches GUIDs from patchesState
        const patchesGuids = patchesState.patches.map((patch: PropertyPatch) => patch.value);

        // Return full patch objects with the above GUIDs in patchesAndAreasData
        return patchesAndAreasData.filter((patchObject: Patch) => patchesGuids.includes(patchObject.id))
    }

    const renderPatchFormField = () => {
        return (
            <>
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
            </>
        )
    }

    const renderPropertyPatches = () => {
        if (patchesAndAreasData.length) {
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
                                onChange={(e: any) =>
                                    handlePatchEdit(e, patch.id)
                                }
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
                            >
                                Remove patch
                            </button>
                        </div>
                    </>
                )
            })
            return patches;
        } else {
            return (
                <div>
                    <Spinner />
                </div>
            )
        }
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

    return {
        getFullPatchData,
        patchesState,
        renderPatchFormField,
    }
}