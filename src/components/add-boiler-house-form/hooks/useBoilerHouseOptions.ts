import React, { SyntheticEvent, useState } from "react";

import { Asset, PatchAssetRequest, patchAsset } from "@mtfh/common/lib/api/asset/v1";

export const useBoilerHouseOptions = (
  asset: Asset,
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setRequestError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const [boilerHouseOption, setBoilerHouseOption] = useState<string>("");
  const [boilerHouseOptionError, setBoilerHouseOptionError] = useState<string | null>(
    null,
  );

  const resetForm = () => {
    setBoilerHouseOptionError(null);
    setBoilerHouseOption("");
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validate()) return;

    resetForm();

    const request: PatchAssetRequest = {
      boilerHouseId: boilerHouseOption,
    };

    patchAsset(asset.id, request, asset?.versionNumber?.toString() ?? "")
      .then(() => {
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error({ err });
        setRequestError(err.message);
      });
  };

  const validate = () => {
    if (boilerHouseOption === "") {
      setBoilerHouseOptionError("You must select a boiler house");
      return false;
    }

    return true;
  };

  return {
    boilerHouseOption,
    setBoilerHouseOption,
    boilerHouseOptionError,
    resetForm,
    handleSubmit,
  };
};
