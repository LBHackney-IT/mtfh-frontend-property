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
  patchId: mockAssetPatch.id,
  areaId: mockAssetArea.id,
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

const mockPatchList: Patch[] = [mockPatch, mockAssetPatch];

// Mock the API response for the patch list
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

describe("Patch Details", () => {
  test("it renders the component", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        initialPatchId={mockAssetPatch.id}
        initialAreaId={mockAreaId}
      />,
    );

    await screen.findByText(locale.patchDetails.heading);
  });

  test("it displays the patch name", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        initialPatchId={mockAssetPatch.id}
        initialAreaId={mockAreaId}
      />,
    );

    await waitFor(async () => {
      screen.getByTestId("patch-name");
    });

    expect(screen.getByTestId("patch-name")).toHaveTextContent(mockAssetPatch.name);
    expect(screen.queryByTestId("officer-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("area-manager-name")).not.toBeInTheDocument();
  });

  test("it displays a 'no patch' message when asset has no patches", async () => {
    render(<PatchDetails assetPk={mockAssetV1.id} initialPatchId="" initialAreaId="" />);

    await waitFor(async () => {
      expect(screen.getByText(locale.patchDetails.noPatch)).toBeVisible();
    });
    expect(screen.queryByTestId("patch-name")).not.toBeInTheDocument();
  });

  test("it does not show the all patches and areas button", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        initialPatchId={mockAssetPatch.id}
        initialAreaId={mockAreaId}
      />,
    );

    await screen.findByTestId("patch-name");

    expect(screen.queryByTestId("all-patches-and-areas-button")).not.toBeInTheDocument();
  });

  test("it shows the explanatory note", async () => {
    render(
      <PatchDetails
        assetPk={assetWithPatches.id}
        initialPatchId={mockAssetPatch.id}
        initialAreaId={mockAreaId}
      />,
    );

    await waitFor(async () => {
      expect(screen.getByTestId("patch-note")).toHaveTextContent(
        locale.patchDetails.note,
      );
    });
  });
});
