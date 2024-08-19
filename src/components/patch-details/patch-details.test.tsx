import * as crypto from "crypto";

import React from "react";

import { mockAssetV1, render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import { locale } from "../../services";
import { PatchDetails } from "./patch-details";

import { Asset } from "@mtfh/common/lib/api/asset/v1";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";
import * as auth from "@mtfh/common/lib/auth/auth";

const mockAreaId = crypto.randomBytes(20).toString("hex");

const mockAssetPatch: Patch = {
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

const mockAssetPatchWithoutResponsibleEntities: Patch = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "AR1",
  patchType: "patch",
  parentId: mockAreaId,
  domain: "Hackney",
  responsibleEntities: [],
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

const mockAssetAreaWithoutResponsibleEntities: Patch = {
  id: mockAreaId,
  name: "AR",
  patchType: "area",
  parentId: crypto.randomBytes(20).toString("hex"),
  domain: "Hackney",
  responsibleEntities: [],
};

const assetWithPatches: Asset = {
  ...mockAssetV1,
  patchId: mockAssetPatch.id,
  areaId: mockAssetArea.id,
};

beforeEach(() => {
  jest.resetAllMocks();

  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get(`/api/v1/patch/${mockAssetPatch.id}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(mockAssetPatch)),
    ),
  );
  server.use(
    rest.get(`/api/v1/patch/${mockAssetPatch.parentId}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(mockAssetArea)),
    ),
  );
});

describe("Patch Details", () => {
  test("it renders the component", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        assetPatch={mockAssetPatch}
        assetArea={mockAssetArea}
      />,
    );

    await screen.findByText(locale.patchDetails.heading);
  });

  test("it shows edit patches button", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        assetPatch={mockAssetPatch}
        assetArea={mockAssetArea}
      />,
    );

    await waitFor(async () => {
      expect(screen.getByTestId("all-patches-and-areas-button")).toHaveTextContent(
        locale.patchDetails.allPatchesAndAreas,
      );
    });
  });

  test("the edit patches button links to the correct page", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        assetPatch={mockAssetPatch}
        assetArea={mockAssetArea}
      />,
    );

    await waitFor(async () => {
      expect(screen.getByTestId("all-patches-and-areas-button")).toHaveAttribute(
        "href",
        "/property/all-patches-and-areas",
      );
    });
  });

  test("it displays the patch, housing officer, and area manager", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        assetPatch={mockAssetPatch}
        assetArea={mockAssetArea}
      />,
    );
    await waitFor(async () => {
      screen.getByTestId("patch-name");
    });

    const patchNameField = screen.getByTestId("patch-name");
    const officerNameField = screen.getByTestId("officer-name");
    const areaManagerNameField = screen.getByTestId("area-manager-name");

    expect(patchNameField).toHaveTextContent(mockAssetPatch.name);
    expect(officerNameField).toHaveTextContent(
      mockAssetPatch.responsibleEntities[0].name,
    );
    expect(areaManagerNameField).toHaveTextContent(
      mockAssetArea.responsibleEntities[0].name,
    );
  });

  test("it displays the patch and housing officer when area manager is not defined", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        assetPatch={mockAssetPatch}
        assetArea={mockAssetAreaWithoutResponsibleEntities}
      />,
    );
    await waitFor(async () => {
      screen.getByTestId("patch-name");
    });

    const patchNameField = screen.getByTestId("patch-name");
    const officerNameField = screen.getByTestId("officer-name");
    const areaManagerNameField = screen.getByTestId("area-manager-name");

    expect(patchNameField).toHaveTextContent(mockAssetPatch.name);
    expect(officerNameField).toHaveTextContent(
      mockAssetPatch.responsibleEntities[0].name,
    );
    expect(areaManagerNameField).toHaveTextContent("N/A");
  });

  test("it displays the patch and area manager when housing officer is not defined", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        assetPatch={mockAssetPatchWithoutResponsibleEntities}
        assetArea={mockAssetArea}
      />,
    );
    await waitFor(async () => {
      screen.getByTestId("patch-name");
    });

    const patchNameField = screen.getByTestId("patch-name");
    const officerNameField = screen.getByTestId("officer-name");
    const areaManagerNameField = screen.getByTestId("area-manager-name");

    expect(patchNameField).toHaveTextContent(mockAssetPatch.name);
    expect(officerNameField).toHaveTextContent("N/A");
    expect(areaManagerNameField).toHaveTextContent(
      mockAssetArea.responsibleEntities[0].name,
    );
  });

  test("it displays a 'no patch' message when asset has no patches", async () => {
    render(
      <PatchDetails
        assetPk={mockAssetV1.id}
        assetPatch={undefined}
        assetArea={undefined}
      />,
    );

    await waitFor(async () => {
      expect(screen.getByText(locale.patchDetails.noPatch)).toBeVisible();
    });
    expect(screen.queryByTestId("patch-name")).not.toBeInTheDocument();
  });

  test("it sets a cookie with the asset ID when the edit patches button is clicked", async () => {
    // This is used to redirect the user back to the asset page after editing patches
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        assetPatch={mockAssetPatch}
        assetArea={mockAssetArea}
      />,
    );

    await waitFor(async () => {
      const editPatchesButton = screen.getByTestId("all-patches-and-areas-button");
      editPatchesButton.click();
      expect(document.cookie).toContain(`fromAssetId=${assetWithPatches.id}`);
    });
  });
});
