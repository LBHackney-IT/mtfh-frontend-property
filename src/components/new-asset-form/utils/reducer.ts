import PropertyPatch from "../../../utils/patch";

export function reducer(state: any, action: any) {
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
