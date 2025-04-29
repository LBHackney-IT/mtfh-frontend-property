import React, { useEffect, useState } from "react";

import { locale } from "../../services";
import { patchAdminAuthGroups } from "../../services/config/config";
import {
  CancelReassignmentButton,
  ConfirmReassignmentButton,
  EditAssignmentButton,
} from "../patch-assignment-form/components/form-buttons";

import {
  UpdatePropertyPatchRequest,
  updatePropertyPatch,
} from "@mtfh/common/lib/api/asset/v1";
import {
  Patch,
  getAllPatchesAndAreas,
  getByPatchName,
} from "@mtfh/common/lib/api/patch/v1";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";

interface Props {
  assetPk: string;
  versionNumber?: number;
  patchName: string;
  onEdit: CallableFunction;
}

export const buildUpdatePropertyPatchRequest = (
  patchId: string,
  areaId: string,
): UpdatePropertyPatchRequest => ({
  patchId,
  areaId,
});

export const PatchEdit = ({ assetPk, versionNumber, patchName, onEdit }: Props) => {
  const [isEditingPatchName, setIsEditingPatchName] = useState<boolean>(false);
  const [newPatchName, setNewPatchName] = useState<string>();
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllPatchesAndAreas().then((data) => {
      data = data.filter(
        (patchOrArea) =>
          ![
            "Hackney",
            "CL Area",
            "CP Area",
            "HN1 Area",
            "HN2 Area",
            "SD Area",
            "SH Area",
            "SN Area",
          ].includes(patchOrArea.name),
      );
      setPatchesAndAreas(data);
    });
  }, []);
  const updatePropertyPatchCall = (
    request: UpdatePropertyPatchRequest,
    assetPk: string,
    versionNumber: string,
  ) => {
    updatePropertyPatch(assetPk, request, versionNumber?.toString() ?? "")
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .then(() => {
        setLoading(true);
        if (!assetPk) {
          setLoading(false);
          setError(true);
        }
        setLoading(false);
        setError(false);
        onEdit(request.patchId, request.areaId);
        setIsEditingPatchName(false);
      });
  };
  const getbyPatchNameCall = (patchName: string) => {
    getByPatchName(patchName)
      .then((data) => {
        setLoading(true);
        const id = JSON.stringify(data).match(/"id":"(.*?)"/);
        const parentId = JSON.stringify(data).match(/"parentId":"(.*?)"/);
        // Extract the id and parentId from the data which will always be the second item in the array as the first item is a json object
        // whereas the  second item is a string value
        if (!id?.[1] || !parentId?.[1]) {
          throw new Error("Invalid patch data: id or parentId is undefined");
        }
        const request = buildUpdatePropertyPatchRequest(id[1], parentId[1]);
        updatePropertyPatchCall(request, assetPk, versionNumber?.toString() ?? "");
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  };
  const handleEdit = () => {
    if (newPatchName) {
      getbyPatchNameCall(newPatchName);
    }
  };

  return (
    <>
      <aside className="mtfh-edit-patch-details">
        {isAuthorisedForGroups(patchAdminAuthGroups) &&
          (!isEditingPatchName ? (
            <EditAssignmentButton onClick={() => setIsEditingPatchName(true)} />
          ) : (
            <select
              id="patch-dropdown-options"
              className="govuk-input lbh-input"
              data-testid="patch-dropdown-options"
              value={newPatchName}
              onChange={(e) => setNewPatchName(e.target.value)}
            >
              <option disabled value="">
                {" "}
                -- Select an option --{" "}
              </option>
              <option selected>{patchName}</option>
              {patchesAndAreas
                .filter((patchOrArea) => patchOrArea.patchType === "patch")
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
            </select>
          ))}
        {isAuthorisedForGroups(patchAdminAuthGroups) && isEditingPatchName && (
          <ConfirmReassignmentButton onClick={handleEdit} enabled />
        )}
        {isAuthorisedForGroups(patchAdminAuthGroups) && isEditingPatchName && (
          <CancelReassignmentButton onClick={() => setIsEditingPatchName(false)} />
        )}
        {error && (
          <ErrorSummary
            id="mtfh-property-patch"
            title={locale.errors.unableToFetchRecord}
            description={locale.errors.tryAgainOrContactSupport}
          />
        )}
        {loading && (
          <Center>
            <Spinner />
          </Center>
        )}
      </aside>
      <hr className="lbh-horizontal-bar" />
    </>
  );
};
