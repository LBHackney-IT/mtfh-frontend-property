import React from "react";

import { render, screen } from "@testing-library/react";

import { ManagePatchesView } from "./manage-patches-view";

import * as auth from "@mtfh/common/lib/auth/auth";

beforeEach(() => {
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);
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
