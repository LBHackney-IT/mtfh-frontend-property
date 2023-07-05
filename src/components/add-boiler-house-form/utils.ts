import { axiosInstance } from "@mtfh/common";
import { config } from "@mtfh/common/lib/config";

export interface PatchAssetRequest {
  boilerHouseId: string;
}

export const patchAsset = async (
  id: string,
  request: PatchAssetRequest,
  assetVersion: string | null,
) => {
  return axiosInstance.patch(`${config.assetApiUrlV1}/assets/${id}`, request, {
    headers: {
      "If-Match": assetVersion,
    },
  });
};
