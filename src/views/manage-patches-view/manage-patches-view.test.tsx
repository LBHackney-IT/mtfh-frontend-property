import React from "react";

import { server } from "@hackney/mtfh-test-utils";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";

import { ManagePatchesView } from "./manage-patches-view";

import * as auth from "@mtfh/common/lib/auth/auth";

beforeEach(() => {
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get("/api/v1/patch/all", (req, res, ctx) => {
      return res(ctx.json([]));
    }),
  );
});

describe("ManagePatchesView", () => {
  render(<ManagePatchesView />);
  test("it renders the component", async () => {
    expect(screen.getByText("Patches and areas")).toBeInTheDocument();
  });

  test("it renders the back link when the fromAssetId cookie is null", async () => {
    render(<ManagePatchesView />);
    expect(screen.getByText("Back to search")).toBeVisible();
  });
});
