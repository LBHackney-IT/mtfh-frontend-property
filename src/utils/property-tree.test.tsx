import React from "react";

import { mockAssetV1, render, server } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import { rest } from "msw";

import { testValidChildAssetFixture, testValidDwellingFixture } from "../test-fixtures";
import { PropertyTree } from "./property-tree";

beforeEach(() => {
  jest.resetAllMocks();
  server.use(
    rest.get(
      `/api/v1/cautionary-alerts/properties-new/${mockAssetV1.assetId}`,
      (req, res, ctx) => res(ctx.status(200), ctx.json({ alerts: [] })),
    ),
  );
});

test("renders the property tree correctly", async () => {
  const { container } = render(
    <PropertyTree
      asset={testValidDwellingFixture}
      childAssets={testValidChildAssetFixture}
    />,
    {},
  );

  expect(container).toMatchSnapshot();

  screen.getByText("12 PITCAIRN HOUSE (this asset)");
  screen.getByText("Gge 12 Pitcairn House St Thomass Square");
  screen.getByText("1-93 Pitcairn House");
});

test("doesn't render the Hackney Housing ancestor", async () => {
  render(
    <PropertyTree
      asset={testValidDwellingFixture}
      childAssets={testValidChildAssetFixture}
    />,
    {},
  );

  const hhElement = screen.queryByText("Hackney Homes Limited");

  expect(hhElement).toBeNull();
});

test("renders components with links", async () => {
  render(
    <PropertyTree
      asset={testValidDwellingFixture}
      childAssets={testValidChildAssetFixture}
    />,
    {},
  );

  expect(screen.getByText("1-93 Pitcairn House").getAttribute("href")).toBe(
    `/property/a65918aa-e441-bc34-e49d-fa8671f768da`,
  );
});
