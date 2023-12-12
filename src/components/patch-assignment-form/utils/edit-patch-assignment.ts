import {
  Patch,
  ResponsibleEntity,
  replacePatchResponsibleEntities,
} from "@mtfh/common/lib/api/patch/v1";

export function editPatchAssignment(
  patch: Patch,
  newOfficerName: string,
  newOfficerEmail: string,
  handleSubmission: Function,
) {
  const officer = patch?.responsibleEntities[0];

  const newResEnt: ResponsibleEntity = {
    ...officer,
    name: newOfficerName,
    contactDetails: {
      emailAddress: newOfficerEmail,
    },
  };

  const currentVersionNumber = patch.versionNumber || 0;
  replacePatchResponsibleEntities(patch.id, [newResEnt], currentVersionNumber)
    .then((data) => {
      if (!data) throw new Error("No data returned from API");
      if (data.status !== 204) throw new Error(`API returned status ${data.status}`);
      patch.responsibleEntities[0] = newResEnt;
      patch.versionNumber = currentVersionNumber + 1;
      handleSubmission(true, patch);
    })
    .catch((error) => {
      handleSubmission(false, patch, error);
    });
}
