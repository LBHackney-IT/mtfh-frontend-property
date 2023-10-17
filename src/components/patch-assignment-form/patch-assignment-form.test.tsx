import * as crypto from "crypto";

import React from "react";

import { server } from "@hackney/mtfh-test-utils";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { PatchAssignmentForm } from "./patch-assignment-form";

import { Patch, ResponsibleEntity, ResponsibleType } from "@mtfh/common/lib/api/patch/v1";
import * as auth from "@mtfh/common/lib/auth/auth";

const mockAreaResponsibleEntity: ResponsibleEntity = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "Second Last",
  responsibleType: ResponsibleType.HousingOfficer,
};
const mockArea: Patch = {
  domain: "MMH",
  id: crypto.randomBytes(20).toString("hex"),
  name: "OK Area",
  parentId: crypto.randomBytes(20).toString("hex"),
  patchType: "area",
  responsibleEntities: [mockAreaResponsibleEntity],
  versionNumber: 1,
};

const mockPatchResponsibleEntity: ResponsibleEntity = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "First Last",
  responsibleType: ResponsibleType.HousingAreaManager,
};
const mockPatch: Patch = {
  domain: "MMH",
  id: crypto.randomBytes(20).toString("hex"),
  name: "OK1",
  parentId: mockArea.id,
  patchType: "patch",
  responsibleEntities: [mockPatchResponsibleEntity],
  versionNumber: 0,
};

const mockPatchResponsibleEntity2: ResponsibleEntity = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "Third Last",
  responsibleType: ResponsibleType.HousingOfficer,
};
const mockPatch2: Patch = {
  domain: "MMH",
  id: crypto.randomBytes(20).toString("hex"),
  name: "TE2",
  parentId: crypto.randomBytes(20).toString("hex"),
  patchType: "patch",
  responsibleEntities: [mockPatchResponsibleEntity2],
  versionNumber: 0,
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get("/api/v1/*", (req, res, ctx) => {
      return res(ctx.json([mockPatch, mockArea, mockPatch2]));
    }),
  );

  server.use(
    rest.patch("/api/v1/*", (req, res, ctx) => {
      return res(ctx.status(204));
    }),
  );

  render(<PatchAssignmentForm setRequestError={jest.fn()} setShowSuccess={jest.fn()} />);
});

describe("PatchAssignmentForm", () => {
  test("it renders the component", async () => {
    const area = await screen.findAllByText("Area").then((res) => {
      return res[0];
    });
    expect(area).toBeInTheDocument();
  });

  test("it displays rows for each patch and area", async () => {
    await waitFor(() => {
      const areaRow = screen.getByTestId(mockArea.id);
      const patchRow = screen.getByTestId(mockPatch.id);

      expect(areaRow).toHaveTextContent(mockArea.name);
      expect(areaRow).toHaveTextContent(mockAreaResponsibleEntity.name);

      expect(patchRow).toHaveTextContent(mockPatch.name);
      expect(patchRow).toHaveTextContent(mockPatchResponsibleEntity.name);
    });
  });

  test("it allows cancelling reassignment", async () => {
    await waitFor(() => {
      screen.getByTestId(mockArea.id);
    });

    const getAreaCancelButton = () =>
      within(screen.getByTestId(mockArea.id)).getByTestId("cancel-reassignment-button");
    const getAreaReassignButton = () =>
      within(screen.getByTestId(mockArea.id)).getByTestId("reassign-button");
    const getPatchReassignButton = () =>
      within(screen.getByTestId(mockPatch.id)).getByTestId("reassign-button");

    const areaReassignButton = getAreaReassignButton();
    expect(areaReassignButton).toHaveTextContent("Reassign");
    areaReassignButton?.click();

    const cancelButton = getAreaCancelButton();
    expect(cancelButton).toBeVisible();
    cancelButton?.click();

    expect(getAreaReassignButton()).toHaveTextContent("Reassign");
    expect(getPatchReassignButton()).toHaveTextContent("Reassign");
  });

  test("it switches assignments between patches and/or areas when reassigning", async () => {
    await waitFor(() => {
      screen.getByTestId(mockArea.id);
    });

    const getAreaRow = () => screen.getByTestId(mockArea.id);
    const getPatchRow = () => screen.getByTestId(mockPatch.id);

    const getAreaReassignButton = () =>
      within(getAreaRow()).getByTestId("reassign-button");
    const getPatchAssignButton = () => within(getPatchRow()).getByTestId("assign-button");
    const getPatchReassignButton = () =>
      within(getPatchRow()).getByTestId("reassign-button");

    const areaReassignButton = getAreaReassignButton();
    areaReassignButton?.click();

    const assignButton = getPatchAssignButton();
    expect(assignButton).toHaveTextContent(
      `Assign ${mockAreaResponsibleEntity.name.split(" ")[0]}`,
    );
    assignButton?.click();

    const confirmReassignmentButton = screen.getByTestId("confirm-reassignment-button");
    expect(confirmReassignmentButton).toBeVisible();
    confirmReassignmentButton?.click();

    expect(getPatchReassignButton()).toHaveTextContent("Reassign");
    expect(getAreaReassignButton()).toHaveTextContent("Reassign");

    // Names should be switched
    expect(getAreaRow()).toHaveTextContent(mockPatchResponsibleEntity.name);
    expect(getPatchRow()).toHaveTextContent(mockAreaResponsibleEntity.name);
  });

  test("it filters the list of patches and areas based on the dropdown", async () => {
    await waitFor(() => {
      screen.getByTestId(mockArea.id);
    });

    const getDropdown = () => screen.getByTestId("patch-select");
    const getMockAreaRow = () => screen.getByTestId(mockArea.id);
    const getMockPatchRow = () => screen.getByTestId(mockPatch.id);
    const getMockPatch2Row = () => screen.queryByTestId(mockPatch2.id);

    const dropdown = getDropdown();
    expect(dropdown).toHaveTextContent("All");

    expect(getMockAreaRow()).toBeVisible();
    expect(getMockPatchRow()).toBeVisible();
    expect(getMockPatch2Row()).toBeVisible();

    userEvent.selectOptions(dropdown, mockArea.id);
    expect(dropdown).toHaveTextContent(mockArea.name);

    expect(getMockAreaRow()).toBeVisible();
    expect(getMockPatchRow()).toBeVisible();
    expect(getMockPatch2Row()).toBeNull();
  });
});
