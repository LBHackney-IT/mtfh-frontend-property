import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import App from "./app";

test("it shows invalid if no id in url", () => {
  render(<App />, { url: "/", path: "/" });
  expect(screen.getByText("404")).toBeInTheDocument();
});

test("it renders property view", async () => {
  render(<App />, {
    url: "/property/123",
    path: "/property/:assetId",
  });

  await screen.findByTestId("property");
});
