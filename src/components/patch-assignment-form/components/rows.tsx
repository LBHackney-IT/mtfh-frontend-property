import React, { useCallback, useMemo, useState } from "react";

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
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleConfirmClick = useCallback(() => {
    if (newOfficerEmail && !newOfficerEmail.includes("@hackney.gov.uk")) {
      setValidationError("Email address must include @hackney.gov.uk");
      return;
    }
    setValidationError(null);
    editPatchAssignment(areaOrPatch, newOfficerName, newOfficerEmail, handleSubmission);
  }, [
    areaOrPatch,
    newOfficerName,
    newOfficerEmail,
    handleSubmission,
    setValidationError,
  ]);

  const handleCancelClick = useCallback(() => {
    setNewOfficerName(officer?.name || "");
    setNewOfficerEmail(officer?.contactDetails?.emailAddress?.toLowerCase().trim() || "");
    setReassigningPatch(null);
    setValidationError(null);
  }, [
    officer,
    setReassigningPatch,
    setNewOfficerName,
    setNewOfficerEmail,
    setValidationError,
  ]);

  const handleOfficerNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewOfficerName(event.target.value?.trim());
    },
    [setNewOfficerName],
  );

  const handleOfficerEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewOfficerEmail(event.target.value.toLowerCase().trim());
    },
    [setNewOfficerEmail],
  );

  const anyChangesMade = useMemo(() => {
    return (
      newOfficerName !== officer?.name ||
      newOfficerEmail !== officer?.contactDetails?.emailAddress?.toLowerCase()
    );
  }, [newOfficerName, newOfficerEmail, officer]);

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
            defaultValue={newOfficerName || officer?.name}
            data-testid={`officer-name-input-${areaOrPatch.name}`}
            onChange={handleOfficerNameChange}
          />
        </Td>
        <Td>
          <input
            className="govuk-input"
            type="text"
            name="officerEmail"
            id="officerEmailInput"
            defaultValue={
              newOfficerEmail || officer?.contactDetails?.emailAddress?.toLowerCase()
            }
            data-testid={`officer-email-input-${areaOrPatch.name}`}
            onChange={handleOfficerEmailChange}
          />
        </Td>
      </>
      <Td>
        <>
          {validationError && (
            <div className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {validationError}
            </div>
          )}
          <ConfirmReassignmentButton
            onClick={handleConfirmClick}
            enabled={anyChangesMade}
          />
          <CancelReassignmentButton onClick={handleCancelClick} />
        </>
      </Td>
    </>
  );
};
