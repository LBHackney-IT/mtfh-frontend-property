import * as crypto from "crypto";

import React from "react";

import { mockAssetV1, render } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";

import { locale } from "../../services";
import { PatchDetails } from "./patch-details";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";
import * as auth from "@mtfh/common/lib/auth/auth";

const mockAssetPatch: Patch = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "AR1",
  patchType: "patch",
  parentId: crypto.randomBytes(20).toString("hex"),
  domain: "Hackney",
  responsibleEntities: [
    {
      id: crypto.randomBytes(20).toString("hex"),
      name: "Housing Officer 1",
      responsibleType: "Housing Officer",
    },
  ],
};

const mockAssetArea: Patch = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "AR",
  patchType: "area",
  parentId: crypto.randomBytes(20).toString("hex"),
  domain: "Hackney",
  responsibleEntities: [
    {
      id: crypto.randomBytes(20).toString("hex"),
      name: "Area Manager 1",
      responsibleType: "Area Manager",
    },
  ],
};

const assetWithPatches: Asset = {
  ...mockAssetV1,
  patches: [mockAssetPatch, mockAssetArea],
};

beforeEach(() => {
  jest.resetAllMocks();

  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);
});

test("it renders the component", async () => {
  render(<PatchDetails asset={assetWithPatches} />);

  await screen.findByText(locale.patchDetails.heading);
});

test("it shows edit patches button", async () => {
  render(<PatchDetails asset={assetWithPatches} />);

  await waitFor(async () => {
    expect(screen.getByTestId("manage-patches-button")).toHaveTextContent(
      locale.patchDetails.managePatches,
    );
  });
});

test("the edit patches button links to the correct page", async () => {
  render(<PatchDetails asset={assetWithPatches} />);

  await waitFor(async () => {
    expect(screen.getByTestId("manage-patches-button")).toHaveAttribute(
      "href",
      "/manage-patches-and-areas",
    );
  });
});

test("it displays the patch, housing officer, and area manager", async () => {
  render(<PatchDetails asset={assetWithPatches} />);

  const patchNameField = screen.getByTestId("patch-name");
  const officerNameField = screen.getByTestId("officer-name");
  const areaManagerNameField = screen.getByTestId("area-manager-name");

  await waitFor(async () => {
    expect(patchNameField).toHaveTextContent(mockAssetPatch.name);
    expect(officerNameField).toHaveTextContent(
      mockAssetPatch.responsibleEntities[0].name,
    );
    expect(areaManagerNameField).toHaveTextContent(
      mockAssetArea.responsibleEntities[0].name,
    );
  });
});

test("it sets a cookie with the asset ID when the edit patches button is clicked", async () => {
  // This is used to redirect the user back to the asset page after editing patches
  render(<PatchDetails asset={assetWithPatches} />);

  const editPatchesButton = screen.getByTestId("manage-patches-button");

  await waitFor(async () => {
    editPatchesButton.click();
    expect(document.cookie).toContain(`fromAssetId=${assetWithPatches.id}`);
  });
});