import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";

import { locale } from "../../services";
import { PatchDetails } from "./patch-details";

describe("Patch Details", () => {
  test("it renders the component", async () => {
    render(<PatchDetails />);

    await screen.findByText(locale.patchDetails.heading);
  });

  test("it shows the explanatory note", async () => {
    render(<PatchDetails />);

    await waitFor(async () => {
      expect(screen.getByTestId("patch-note")).toHaveTextContent(
        locale.patchDetails.note,
        { normalizeWhitespace: false },
      );
    });
  });

  test("it does not show the patch name", () => {
    render(<PatchDetails />);

    expect(screen.queryByTestId("patch-name")).not.toBeInTheDocument();
  });

  test("it does not show the edit patch button", () => {
    render(<PatchDetails />);

    expect(screen.queryByTestId("edit-assignment-button")).not.toBeInTheDocument();
  });

  test("it does not show the all patches and areas button", () => {
    render(<PatchDetails />);

    expect(screen.queryByTestId("all-patches-and-areas-button")).not.toBeInTheDocument();
  });
});
