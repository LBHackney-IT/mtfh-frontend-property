import React from "react";

import {
  getAssetV1,
  mockAssetInvalidAssetTypeV1,
  mockAssetLettableNonDwellingV1,
  mockAssetV1,
  mockCommentsV2,
  mockWorkOrders,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { locale } from "../../services";

import { AssetView } from ".";

import { $configuration } from "@mtfh/common/lib/configuration";
import { formatDate, formatTime } from "@mtfh/common/lib/utils";

test("renders the error on Asset failure", async () => {
  server.use(getAssetV1(undefined, 500));
  render(<AssetView />, {
    url: `/property/${mockAssetV1.id}`,
    path: "/property/:assetId",
  });

  await screen.findByRole("alert");
});

test("renders the property view", async () => {
  const { container } = render(<AssetView />, {
    url: `/property/${mockAssetV1.id}`,
    path: "/property/:assetId",
  });
  expect(container).toMatchSnapshot();

  await waitFor(() =>
    expect(screen.getAllByRole("heading")[0]).toHaveTextContent(
      locale.assetDetails.address(mockAssetV1.assetAddress),
    ),
  );
  screen.getByText(locale.assetType(mockAssetV1.assetType));
  screen.getByText(/UPRN/);
  screen.getByText(mockAssetV1.assetId);
  screen.getByText(/Reference/);
});

test("renders the process menu button and contains correct path", async () => {
  render(<AssetView />, {
    url: `/property/${mockAssetV1.id}`,
    path: "/property/:assetId",
  });
  await waitFor(() => expect(screen.getByText(locale.static.newProcess)));
  userEvent.click(screen.getByText(locale.static.newProcess));
  expect(window.location.pathname).toContain(`/processes/property/${mockAssetV1.id}`);
});

test("it shows the back button", async () => {
  render(<AssetView />, {
    url: `/property/${mockAssetV1.id}`,
    path: "/property/:assetId",
  });

  await screen.findByText("Search results");
});

test("it shows add comment button and comments list", async () => {
  render(<AssetView />, {
    url: `/property/${mockAssetV1.id}`,
    path: "/property/:assetId",
  });

  await waitFor(() => {
    screen.getByText(locale.comments.addComment);
    screen.getByText(mockCommentsV2[0].title || "");
    screen.getByText(mockCommentsV2[0].description);
    screen.getByText(mockCommentsV2[0].author.fullName);
    screen.getByText(formatDate(mockCommentsV2[0].createdAt));
    screen.getByText(formatTime(mockCommentsV2[0].createdAt));
  });
});

test("it shows repairs list", async () => {
  $configuration.next({
    MMH: { configuration: {}, featureToggles: { RepairsList: true } },
  });
  render(<AssetView />, {
    url: `/property/${mockAssetV1.id}`,
    path: "/property/:assetId",
  });
  const mockOrder = mockWorkOrders[0];

  await waitFor(() => {
    screen.getByText(locale.repairs.heading);
    screen.getByText(
      `${mockOrder.tradeDescription}: ${mockOrder.description.substring(0, 50)}`,
    );
  });
});

test("it shows new tenure button", async () => {
  server.use(
    rest.get("/api/v1/assets/:id", (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.set("ETag", '"1"'),
        ctx.json({ ...mockAssetLettableNonDwellingV1, tenure: {} }),
      ),
    ),
  );
  render(<AssetView />, {
    url: `/property/${mockAssetV1.id}`,
    path: "/property/:assetId",
  });

  await screen.findByText(locale.assetDetails.newTenure);
});

test("renders the asset view for lettable-non-dwelling", async () => {
  server.use(
    rest.get("/api/v1/assets/:id", (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.set("ETag", '"1"'),
        ctx.json(mockAssetLettableNonDwellingV1),
      ),
    ),
  );
  render(<AssetView />, {
    url: `/property/${mockAssetLettableNonDwellingV1.id}`,
    path: "/property/:assetId",
  });

  await screen.findByText(/Lettable non-dwelling/);
});

test("renders the asset view for invalid asset type", async () => {
  server.resetHandlers();
  server.use(
    rest.get("/api/v1/assets/:id", (req, res, ctx) =>
      res(ctx.status(200), ctx.set("ETag", '"2"'), ctx.json(mockAssetInvalidAssetTypeV1)),
    ),
  );
  render(<AssetView />, {
    url: `/property/${mockAssetInvalidAssetTypeV1.id}`,
    path: "/property/:assetId",
  });

  await screen.findByText(locale.assetCouldNotBeLoaded);
});
