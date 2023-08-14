export const config = {
  appEnv: process.env.APP_ENV ?? "dev",
};

export const assetAdminAuthGroups =
  process.env.APP_ENV === "production"
    ? ["mmh-asset-admin"]
    : [
        "mmh-project-team",
        "e2e-testing-development",
        "e2e-testing-staging",
        "e2e-testing-production",
      ];
