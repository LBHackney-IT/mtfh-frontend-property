import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";

import locale from "../../services/locale";

import { NewAssetView } from ".";

import * as auth from "@mtfh/common/lib/auth/auth";

beforeEach(() => {
  jest.resetAllMocks();

  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);
});

test("renders the whole 'New asset form' view", async () => {
  const { container } = render(<NewAssetView />);

  expect(container).toMatchSnapshot();
});

test("form action buttons are rendered and are enabled", async () => {
  render(<NewAssetView />);

  // Assert "Update to this button" is in the DOM and is enabled
  const submitButton = screen.getByRole("button", { name: "Create new property" });
  const cancelButton = screen.getByText("Cancel");

  expect(submitButton).toBeInTheDocument();
  expect(submitButton).toBeEnabled();

  expect(cancelButton).toBeInTheDocument();
  expect(cancelButton).toBeEnabled();
});

test("unauthorized message is shown for unauthorized users", async () => {
  jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(false);
  render(<NewAssetView />);

  await waitFor(() => {
    const unauthorizedErrorMessage = screen.getByText(
      locale.errors.noNewAssetPermissions,
    );
    expect(unauthorizedErrorMessage).toBeVisible();
  });
});
