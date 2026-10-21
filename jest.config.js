const path = require("path");

process.loadEnvFile(path.join(__dirname, ".env.test"));

module.exports = {
  rootDir: "src",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!lbh-frontend|@mtfh)"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "^#node-web-compat$": path.join(
      __dirname,
      "node_modules/aws-jwt-verify/dist/cjs/node-web-compat-node.js",
    ),
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom",
    "@hackney/mtfh-test-utils",
    "./test-utils.ts",
  ],
  testPathIgnorePatterns: ["test-utils.ts"],
  coverageDirectory: "../coverage",
  coveragePathIgnorePatterns: ["mocks", "test-utils.ts"],
  testEnvironment: "jsdom",
};
