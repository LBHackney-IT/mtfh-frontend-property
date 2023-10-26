import * as crypto from "crypto";

import React from "react";

import { render, screen } from "@testing-library/react";

import { ManagePatchesLayout } from "./layout";

import * as auth from "@mtfh/common/lib/auth/auth";
import { server } from "@hackney/mtfh-test-utils";

const testAssetId = crypto.randomBytes(20).toString("hex");

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  // server.use(
  //   rest.get(
  //     `/api/v1/patch/${mockAssetPatch.parentId}`,
  //     (req, res, ctx) => res(ctx.status(200), ctx.json(mockAssetArea)),
  //   ),
  // );
});

describe("ManagePatchesLayout", () => {
  test("it renders the component", async () => {
    render(<ManagePatchesLayout assetId="" />);
    expect(screen.getByText("Patch reassignment")).toBeInTheDocument();
  });

  test("it links back to the search when the fromAssetId is null", async () => {
    render(<ManagePatchesLayout assetId="" />);
    const backLink = screen.getByText("Back to search");
    expect(backLink).toBeVisible();
    expect(backLink).toHaveAttribute("href", "/search");
  });

  test("it links back to the asset when the fromAssetId is set", async () => {
    render(<ManagePatchesLayout assetId={testAssetId} />);
    const backLink = screen.getByText("Back to property");
    expect(backLink).toBeVisible();
    expect(backLink).toHaveAttribute("href", `/property/${testAssetId}`);
  });
});
