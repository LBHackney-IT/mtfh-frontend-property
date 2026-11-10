export const config = {
  appEnv: process.env.APP_ENV ?? "dev",
};

const warrantiesSpreadsheetId = process.env.WARRANTIES_SPREADSHEET_ID;

export const warrantiesSpreadsheetUrl = warrantiesSpreadsheetId
  ? `https://docs.google.com/spreadsheets/d/${warrantiesSpreadsheetId}?gid=0`
  : undefined;

export const assetAdminAuthGroups =
  process.env.APP_ENV === "production"
    ? ["mmh-asset-admin"]
    : [
        "mmh-project-team",
        "e2e-testing-development",
        "e2e-testing-staging",
        "e2e-testing-production",
      ];

export const patchAdminAuthGroups =
  process.env.APP_ENV === "production"
    ? ["mmh-patches-admin"]
    : [
        "mmh-project-team",
        "e2e-testing-development",
        "e2e-testing-staging",
        "e2e-testing-production",
      ];
