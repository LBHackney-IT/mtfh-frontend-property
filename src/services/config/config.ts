export const config = {
  appEnv: process.env.APP_ENV || "dev",
};

export const propertyAuthorizedGroups =
  process.env.APP_ENV === "production"
    ? ["mmh-data-admin"]
    : [
      "mmh-general-user-access",
      "e2e-testing-development",
    ];