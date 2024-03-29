import * as crypto from "crypto";

import React from "react";

import { server } from "@hackney/mtfh-test-utils";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";

import { ManagePatchesLayout } from "./layout";

import * as auth from "@mtfh/common/lib/auth/auth";

const testAssetId = crypto.randomBytes(20).toString("hex");

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get("/api/v1/patch/all", (req, res, ctx) => {
      return res(ctx.json([]));
    }),
  );
});

describe("ManagePatchesLayout", () => {
  test("it renders the component", async () => {
    render(<ManagePatchesLayout assetId="" />);
    expect(screen.getByText("Patches and areas")).toBeInTheDocument();
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
