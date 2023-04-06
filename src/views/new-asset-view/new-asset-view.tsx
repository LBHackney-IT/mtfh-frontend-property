import React from "react";

import { locale } from "../../services";
import { assetAdminAuthGroups } from "../../services/config/config";
import { NewPropertyLayout } from "./layout";

import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { ErrorSummary } from "@mtfh/common/lib/components";

export const NewAssetView = (): JSX.Element => {
  if (!isAuthorisedForGroups(assetAdminAuthGroups)) {
    return (
      <ErrorSummary
        id="unauthorized-error"
        title={locale.errors.noNewAssetPermissions}
      />
    );
  }

  return (
    <>
      <NewPropertyLayout />
    </>
  );
};
