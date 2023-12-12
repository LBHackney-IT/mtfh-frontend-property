import * as crypto from "crypto";

import React from "react";

import { server } from "@hackney/mtfh-test-utils";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { PatchAssignmentForm } from "./patch-assignment-form";

import { Patch, ResponsibleEntity } from "@mtfh/common/lib/api/patch/v1";
import * as auth from "@mtfh/common/lib/auth/auth";

const mockAreaResponsibleEntity: ResponsibleEntity = {
  id: crypto.randomBytes(20).toString("hex"),
  name: "Second Last",
  responsibleType: "HousingAreaManager",
  contactDetails: {
    emailAddress: "test.test@hackney.gov.uk",
  },
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
  responsibleType: "HousingOfficer",
  contactDetails: {
    emailAddress: "test.test@hackney.gov.uk",
  },
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
  responsibleType: "HousingOfficer",
  contactDetails: {
    emailAddress: "test.test@hackney.gov.uk",
  },
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

// Getters
const getDropdown = () => screen.getByTestId("area-select");
const rowTestId = (patchName: string) => `${patchName}-row`;
const rowForPatch = (patchName: string) => screen.getByTestId(rowTestId(patchName));
const officerNameInputForPatch = (patchName: string) =>
  within(rowForPatch(patchName)).getByTestId(`officer-name-input-${patchName}`);
const officerEmailInputForPatch = (patchName: string) =>
  within(rowForPatch(patchName)).getByTestId(`officer-email-input-${patchName}`);
const cancelBtnForPatch = (patchName: string) =>
  within(rowForPatch(patchName)).getByTestId("cancel-reassignment-button");
const editAssignmentBtnForPatch = (patchName: string) =>
  within(rowForPatch(patchName)).getByTestId("edit-assignment-button");
const confirmReassignmentBtnForPatch = (patchName: string) =>
  within(rowForPatch(patchName)).getByTestId("confirm-reassignment-button");

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

  server.use(
    rest.get("/api/v1/patch/all", (req, res, ctx) => {
      return res(ctx.json([mockPatch, mockArea, mockPatch2]));
    }),
  );

  server.use(
    rest.put("/api/v1/patch/*", (req, res, ctx) => {
      return res(ctx.status(204));
    }),
  );

  render(<PatchAssignmentForm setRequestError={jest.fn()} setShowSuccess={jest.fn()} />);
});

describe("PatchAssignmentForm", () => {
  describe("it allows viewing and filtering patches and areas", () => {
    test("it renders the component", async () => {
      const area = await screen.findAllByText("Area").then((res) => {
        return res[0];
      });
      expect(area).toBeInTheDocument();
    });

    test("it displays rows for each patch and area", async () => {
      await waitFor(() => {
        rowForPatch(mockArea.name);
      });

      expect(rowForPatch(mockArea.name)).toHaveTextContent(mockArea.name);
      expect(rowForPatch(mockArea.name)).toHaveTextContent(
        mockAreaResponsibleEntity.name,
      );

      expect(rowForPatch(mockPatch.name)).toHaveTextContent(mockPatch.name);
      expect(rowForPatch(mockPatch.name)).toHaveTextContent(
        mockPatchResponsibleEntity.name,
      );
    });

    test("it filters the list of patches and areas based on the dropdown", async () => {
      await waitFor(() => {
        rowForPatch(mockArea.name);
      });

      const dropdown = getDropdown();
      expect(dropdown).toHaveTextContent("All");

      expect(rowForPatch(mockArea.name)).toBeVisible();
      expect(rowForPatch(mockPatch.name)).toBeVisible();
      expect(rowForPatch(mockPatch2.name)).toBeVisible();

      userEvent.selectOptions(dropdown, mockArea.name);
      expect(dropdown).toHaveTextContent(mockArea.name);

      expect(rowForPatch(mockArea.name)).toBeVisible();
      expect(rowForPatch(mockPatch.name)).toBeVisible();
      expect(screen.queryByTestId(rowTestId(mockPatch2.name))).toBeNull();
    });
  });

  describe("it allows reassigning patches and areas", () => {
    test("it allows cancelling reassignment", async () => {
      await waitFor(() => {
        rowForPatch(mockArea.name);
      });

      const areaReassignButton = editAssignmentBtnForPatch(mockArea.name);
      expect(areaReassignButton).toHaveTextContent("Edit");
      areaReassignButton?.click();

      const cancelButton = cancelBtnForPatch(mockArea.name);
      expect(cancelButton).toBeVisible();
      cancelButton?.click();

      expect(editAssignmentBtnForPatch(mockArea.name)).toHaveTextContent("Edit");
    });

    test("it edits the name and email address as entered by the user", async () => {
      await waitFor(() => {
        rowForPatch(mockArea.name);
      });

      const newName = "New Name";
      const newEmail = "new.name@hackney.gov.uk";

      editAssignmentBtnForPatch(mockArea.name).click();

      // Assign to patch
      const officerNameInput = officerNameInputForPatch(mockArea.name);
      expect(officerNameInput).toHaveValue(mockAreaResponsibleEntity.name);
      userEvent.clear(officerNameInput);
      userEvent.type(officerNameInput, newName);

      const officerEmailInput = officerEmailInputForPatch(mockArea.name);
      expect(officerEmailInput).toHaveValue(
        mockAreaResponsibleEntity.contactDetails.emailAddress,
      );
      userEvent.clear(officerEmailInput);
      userEvent.type(officerEmailInput, newEmail);

      confirmReassignmentBtnForPatch(mockArea.name).click();
      await waitFor(() => {
        expect(editAssignmentBtnForPatch(mockArea.name)).toHaveTextContent("Edit");
      });

      // Check that the new officer name and email address are displayed
      expect(rowForPatch(mockArea.name)).toHaveTextContent(newName);
      expect(rowForPatch(mockArea.name)).toHaveTextContent(newEmail);
    });
  });
});
