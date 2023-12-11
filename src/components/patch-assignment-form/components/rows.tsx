import React, { useState } from "react";

import { assetAdminAuthGroups } from "../../../services/config/config";
import { editPatchAssignment } from "../utils/edit-patch-assignment";
import {
  CancelReassignmentButton,
  ConfirmReassignmentButton,
  EditAssignmentButton,
} from "./form-buttons";

import { Td, isAuthorisedForGroups } from "@mtfh/common";
import { Patch, ResponsibleEntity } from "@mtfh/common/lib/api/patch/v1";

interface PatchRow extends Patch {
  parentAreaName?: string;
}

const ReadOnlyRow = ({
  officer,
  areaOrPatch,
}: {
  officer: ResponsibleEntity;
  areaOrPatch: PatchRow;
}): JSX.Element => {
  return (
    <>
      <Td>{areaOrPatch.name}</Td>
      <Td>{areaOrPatch.parentAreaName}</Td>
      <Td>{officer?.name}</Td>
      <Td>{officer?.contactDetails?.emailAddress?.toLowerCase()}</Td>
    </>
  );
};

interface TableRowProps {
  areaOrPatch: PatchRow;
  reassigningThisPatch: boolean;
  setReassigningPatch: Function;
  handleSubmission: Function;
}
export const TableRow = ({
  areaOrPatch,
  reassigningThisPatch,
  setReassigningPatch,
  handleSubmission,
}: TableRowProps): JSX.Element => {
  const officer = areaOrPatch.responsibleEntities[0];
  const [newOfficerName, setNewOfficerName] = useState<string>(officer?.name || "");
  const [newOfficerEmail, setNewOfficerEmail] = useState<string>(
    officer?.contactDetails?.emailAddress?.toLowerCase() || "",
  );

  function onConfirmButtonClick() {
    editPatchAssignment(areaOrPatch, newOfficerName, newOfficerEmail, handleSubmission);
  }

  if (!isAuthorisedForGroups(assetAdminAuthGroups)) {
    return (
      <>
        <ReadOnlyRow officer={officer} areaOrPatch={areaOrPatch} />
      </>
    );
  }

  if (!reassigningThisPatch) {
    return (
      <>
        <ReadOnlyRow officer={officer} areaOrPatch={areaOrPatch} />
        <Td>
          <EditAssignmentButton onClick={() => setReassigningPatch(areaOrPatch)} />
        </Td>
      </>
    );
  }

  return (
    <>
      <>
        <Td>{areaOrPatch.name}</Td>
        <Td>{areaOrPatch.parentAreaName}</Td>
        <Td>
          <input
            className="govuk-input"
            type="text"
            name="officerName"
            id="officerNameInput"
            defaultValue={officer?.name}
            data-testid={`officer-name-input-${areaOrPatch.name}`}
            onChange={(event) => setNewOfficerName(event.target.value)}
          />
        </Td>
        <Td>
          <input
            className="govuk-input"
            type="text"
            name="officerEmail"
            id=""
            defaultValue={officer?.contactDetails?.emailAddress?.toLowerCase()}
            data-testid={`officer-email-input-${areaOrPatch.name}`}
            onChange={(event) => setNewOfficerEmail(event.target.value)}
          />
        </Td>
      </>
      <Td>
        <>
          <ConfirmReassignmentButton onClick={() => onConfirmButtonClick()} />
          <CancelReassignmentButton onClick={() => setReassigningPatch(null)} />
        </>
      </Td>
    </>
  );
};
