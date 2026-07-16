import * as crypto from "crypto";

import React from "react";

import { render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import { locale } from "../../services";
import { PatchDetails } from "./patch-details";

import { Patch } from "@mtfh/common/lib/api/patch/v1/types";

const mockAreaId = crypto.randomBytes(20).toString("hex");

const mockAssetPatch = (isTmo: boolean): Patch => ({
  id: crypto.randomBytes(20).toString("hex"),
  name: "AR1",
  patchType: isTmo ? "tmoPatch" : "patch",
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
});

const mockAssetPatchTMO = mockAssetPatch(true);
const mockAssetPatchNotTMO = mockAssetPatch(false);

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

// Mock the API response for the patch list
beforeEach(() => {
  server.use(
    rest.get(`/api/v1/patch/${mockAssetPatchTMO.id}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(mockAssetPatchTMO)),
    ),
  );
  server.use(
    rest.get(`/api/v1/patch/${mockAssetPatchNotTMO.id}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(mockAssetPatchNotTMO)),
    ),
  );
  server.use(
    rest.get(`/api/v1/patch/${mockAssetPatchTMO.parentId}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(mockAssetArea)),
    ),
  );
});

describe("Patch Details - Neighbourhood mode", () => {
  test("it renders the component", async () => {
    render(<PatchDetails neighbourhood={null} />);

    await screen.findByText(locale.patchDetails.heading);
  });

  test("it displays the neighbourhood name when provided", async () => {
    render(<PatchDetails neighbourhood="Hackney North" />);

    await screen.findByText(locale.patchDetails.heading);

    expect(screen.getByTestId("neighbourhood-name")).toHaveTextContent("Hackney North");
    expect(screen.queryByTestId("no-neighbourhood")).not.toBeInTheDocument();
  });

  test("it shows 'No Housing Management Area' when neighbourhood is not provided", async () => {
    render(<PatchDetails neighbourhood={null} />);

    await screen.findByText(locale.patchDetails.heading);

    expect(screen.getByTestId("no-neighbourhood")).toHaveTextContent(
      locale.patchDetails.noNeighbourhoodArea,
    );
    expect(screen.queryByTestId("neighbourhood-name")).not.toBeInTheDocument();
  });

  test("it does not show the all patches and areas button", async () => {
    render(<PatchDetails neighbourhood={null} />);

    await screen.findByText(locale.patchDetails.heading);

    expect(screen.queryByTestId("all-patches-and-areas-button")).not.toBeInTheDocument();
  });

  test("it shows the explanatory note when a neighbourhood is provided", async () => {
    render(<PatchDetails neighbourhood="Hackney North" />);

    await screen.findByText(locale.patchDetails.heading);

    expect(screen.getByTestId("patch-note")).toHaveTextContent(locale.patchDetails.note);
  });

  test("it does not show the explanatory note when no neighbourhood is provided", async () => {
    render(<PatchDetails neighbourhood={null} />);

    await screen.findByText(locale.patchDetails.heading);

    expect(screen.queryByTestId("patch-note")).not.toBeInTheDocument();
  });

  test("it does not show TMO elements when not assigned to TMO patch", async () => {
    render(<PatchDetails neighbourhood="Hackney North" />);

    await screen.findByText(locale.patchDetails.heading);

    expect(screen.queryByTestId("patch-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("officer-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("area-manager-name")).not.toBeInTheDocument();
  });
});

describe("Patch Details - Assigned to TMO patch", () => {
  test("it renders the component with patch and area details", async () => {
    render(
      <PatchDetails
        neighbourhood={null}
        patchId={mockAssetPatchTMO.id}
        areaId={mockAssetArea.id}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("patch-name")).toHaveTextContent(mockAssetPatchTMO.name);
    });

    expect(screen.getByTestId("officer-name")).toHaveTextContent(
      mockAssetPatchTMO.responsibleEntities[0].name,
    );
    expect(screen.getByTestId("area-manager-name")).toHaveTextContent(
      mockAssetArea.responsibleEntities[0].name,
    );
  });

  test("it does not show neighbourhood-specific elements", async () => {
    render(
      <PatchDetails
        neighbourhood={null}
        patchId={mockAssetPatchTMO.id}
        areaId={mockAssetArea.id}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("patch-name")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("neighbourhood-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("no-neighbourhood")).not.toBeInTheDocument();
    expect(screen.queryByTestId("patch-note")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edit-assignment-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("all-patches-and-areas-button")).not.toBeInTheDocument();
  });
});

describe("Patch Details - Assigned to non-TMO patch", () => {
  test("it shows neighbourhood content when patch is not a TMO patch", async () => {
    render(
      <PatchDetails
        neighbourhood="Hackney North"
        patchId={mockAssetPatchNotTMO.id}
        areaId={mockAssetArea.id}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("neighbourhood-name")).toHaveTextContent("Hackney North");
    });

    expect(screen.getByTestId("patch-note")).toHaveTextContent(locale.patchDetails.note);
    expect(screen.queryByTestId("patch-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("officer-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("area-manager-name")).not.toBeInTheDocument();
  });

  test("it shows 'No Housing Management Area' when neighbourhood is null for non-TMO patch", async () => {
    render(
      <PatchDetails
        neighbourhood={null}
        patchId={mockAssetPatchNotTMO.id}
        areaId={mockAssetArea.id}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("no-neighbourhood")).toHaveTextContent(
        locale.patchDetails.noNeighbourhoodArea,
      );
    });

    expect(screen.queryByTestId("patch-note")).not.toBeInTheDocument();
    expect(screen.queryByTestId("patch-name")).not.toBeInTheDocument();
  });
});
