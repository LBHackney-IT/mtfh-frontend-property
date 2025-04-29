import * as crypto from "crypto";

import React from "react";

import { mockAssetV1, render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { PatchEdit } from "./patch-edit";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import * as commonPatch from "@mtfh/common/lib/api/patch/v1";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";
import * as auth from "@mtfh/common/lib/auth/auth";

const mockAreaId = crypto.randomBytes(20).toString("hex");

const updateAssetPatch: Patch = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "AR1",
  patchType: "patch",
  parentId: mockAreaId,
  domain: "Hackney",
  responsibleEntities: [
    {
      id: crypto.randomBytes(20).toString("hex"),
      name: "Housing Officer 1",
      responsibleType: "HousingOfficer",
      contactDetails: {
        emailAddress: "test.test@hackney.gov.uk",
      },
    },
  ],
};

const mockPatch: Patch = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "HN1",
  patchType: "patch",
  parentId: mockAreaId,
  domain: "Hackney",
  responsibleEntities: [
    {
      id: crypto.randomBytes(20).toString("hex"),
      name: "Housing Officer 1",
      responsibleType: "HousingOfficer",
      contactDetails: {
        emailAddress: "test.test@hackney.gov.uk",
      },
    },
  ],
};

const mockAssetArea: Patch = {
  id: mockAreaId,
  name: "AR",
  patchType: "area",
  parentId: crypto.randomBytes(20).toString("hex"),
  domain: "Hackney",
  responsibleEntities: [
    {
      id: crypto.randomBytes(20).toString("hex"),
      name: "Area Manager 1",
      responsibleType: "HousingAreaManager",
      contactDetails: {
        emailAddress: "test.test@hackney.gov.uk",
      },
    },
  ],
};

const assetWithPatches: Asset = {
  ...mockAssetV1,
  patchId: updateAssetPatch.id,
  areaId: mockAssetArea.id,
};

const mockPatchList: Patch[] = [mockPatch, updateAssetPatch];

// Mock the API response for the patch list
beforeEach(() => {
  jest.resetAllMocks();

  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  jest.spyOn(commonPatch, "getByPatchName").mockReturnValue(Promise.resolve(updateAssetPatch));

  server.use(
    rest.get("/api/v1/patch/all", (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockPatchList));
    }),
  );
  server.use(
    rest.get(`/api/v1/patch/patchName/*`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockPatch));
    }),
  );
  server.use(
    rest.patch(`/api/v1/assets/${assetWithPatches.id}/patch`, (req, res, ctx) =>
      res(ctx.status(204)),
    ),
  );
});

describe("Edit Patch Details", () => {
  test("it shows the edit patches, cancel and confirm buttons when the user is authorised", async () => {
    render(
      <PatchEdit
        assetPk={assetWithPatches.id}
        versionNumber={assetWithPatches.versionNumber}
        patchName={mockPatch.name}
        onEdit={jest.fn()}
      />,
    );

    await waitFor(async () => {
      const editButton = screen.getByTestId("edit-assignment-button");
      expect(editButton).toBeVisible();
      editButton.click();
    });
    expect(screen.getByTestId("cancel-reassignment-button")).toBeVisible();
    expect(screen.getByTestId("confirm-reassignment-button")).toBeVisible();
  });
  test("it does not show the edit patches, cancel and confirm button when the user is not authorised", async () => {
    jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(false);

    render(
      <PatchEdit
        assetPk={assetWithPatches.id}
        versionNumber={assetWithPatches.versionNumber}
        patchName={mockPatch.name}
        onEdit={jest.fn()}
      />,
    );

    await waitFor(async () => {
      expect(screen.queryByTestId("edit-assignment-button")).not.toBeInTheDocument();
      expect(screen.queryByTestId("confirm-reassignment-button")).not.toBeInTheDocument();
      expect(screen.queryByTestId("cancel-reassignment-button")).not.toBeInTheDocument();
    });
  });

  test("patch name is edited successfully", async () => {
    jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

    render(
      <PatchEdit
        assetPk={assetWithPatches.id}
        versionNumber={assetWithPatches.versionNumber}
        patchName={mockPatch.name}
        onEdit={jest.fn()}
      />,
    );

    await waitFor(async () => {
      const editButton = screen.getByTestId("edit-assignment-button");
      editButton.click();
    });

    const confirmButton = screen.getByTestId("confirm-reassignment-button");
    expect(confirmButton).toBeVisible();
    expect(screen.getByTestId("cancel-reassignment-button")).toBeVisible();

    const patchDropdown = screen.getByTestId("patch-dropdown-options");
    expect(patchDropdown).toBeInTheDocument();
    // await userEvent.click(patchDropdown);
    await waitFor(() => {
      expect(screen.getByText(updateAssetPatch.name)).toBeVisible();
    });
    userEvent.selectOptions(patchDropdown, updateAssetPatch.name);
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(screen.queryByTestId("patch-dropdown-options")).not.toBeInTheDocument();
      expect(screen.queryByTestId("confirm-reassignment-button")).not.toBeInTheDocument();
      expect(screen.queryByTestId("cancel-reassignment-button")).not.toBeInTheDocument();
      expect(screen.queryByTestId("edit-assignment-button")).toBeInTheDocument();
    });
  });
  test("patch name is not edited if cancel button is clicked", async () => {
    jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

    render(
      <PatchEdit
        assetPk={assetWithPatches.id}
        versionNumber={assetWithPatches.versionNumber}
        patchName={mockPatch.name}
        onEdit={jest.fn()}
      />,
    );

    await waitFor(async () => {
      const editButton = screen.getByTestId("edit-assignment-button");
      editButton.click();
    });

    expect(screen.getByTestId("patch-dropdown-options")).toBeVisible();
    const confirmButton = screen.getByTestId("confirm-reassignment-button");
    expect(confirmButton).toBeVisible();
    const cancelButton = screen.getByTestId("cancel-reassignment-button");
    expect(cancelButton).toBeVisible();

    const patchDropdown = screen.getByTestId("patch-dropdown-options");
    patchDropdown.click();

    cancelButton.click();

    expect(screen.queryByTestId("patch-dropdown-options")).not.toBeInTheDocument();
    expect(screen.queryByTestId("confirm-reassignment-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cancel-reassignment-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edit-assignment-button")).toBeInTheDocument();
  });
});
