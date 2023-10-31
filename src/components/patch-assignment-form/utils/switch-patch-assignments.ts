import {
  Patch,
  ResponsibleEntity,
  replacePatchResponsibleEntities,
} from "@mtfh/common/lib/api/patch/v1";

/**
 * Switches the assigned responsible entities (housing officers or area managers) of two patches / areas
 * @param patchA - A patch or area to switch assigned officer(s) with patchB
 * @param patchB - A patch or area to switch assigned officer(s) with patchA
 * @param onSuccess - A function to run if the update is successful
 * @param setRequestError - Function that handles an error message for request failure
 * @returns bool for whether the update was successful
 */
export function switchPatchAssignments(
  patchA: Patch,
  patchB: Patch,
  onSuccess: Function,
  setRequestError: Function,
) {
  if (!patchA.versionNumber) patchA.versionNumber = 0;
  if (!patchB.versionNumber) patchB.versionNumber = 0;
  if (!patchA || !patchB) return false;

  const patchAResEnts = patchA.responsibleEntities;
  const patchBResEnts = patchB.responsibleEntities;

  const patches = [patchA, patchB];
  patches.forEach((patch: Patch) => {
    const otherPatchResEnts = patch === patchA ? patchBResEnts : patchAResEnts;

    const request: ResponsibleEntity[] = [...otherPatchResEnts];
    if (!patch.versionNumber) patch.versionNumber = 0;
    replacePatchResponsibleEntities(patch.id, request, patch.versionNumber)
      .then((res) => {
        if (res.status !== 204) {
          throw new Error(`${res.data.message}`);
        }
        patch.versionNumber = patch.versionNumber ? patch.versionNumber + 1 : 1;
        patch.responsibleEntities = otherPatchResEnts;

        patchA.responsibleEntities = patchBResEnts;
        patchB.responsibleEntities = patchAResEnts;
        onSuccess();
      })
      .catch((err) => {
        setRequestError(
          `Error switching patch assignments for ${patchA.name} and ${
            patchB.name
          } - (Status ${err.response.status}) - ${JSON.stringify(
            err.response.data.message,
          )}`,
        );
      });
  });
}
