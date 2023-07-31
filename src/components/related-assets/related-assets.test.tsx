import React from "react";

import { render } from "@hackney/mtfh-test-utils";

import { RelatedAssets } from "./related-assets";

const address1 = "123 Test Street";
const address2 = "456 Test Road";
const address3 = "789 Test Estate";

const assetsByType = {
  Estate: [
    {
      type: "Estate",
      id: "14edf718-19ff-ff43-4679-f8ef404fa029",
      name: address3,
    },
  ],
  Dwelling: [
    {
      type: "Dwelling",
      id: "13e7cf17-60a0-729d-c297-a4e76a16b6fa",
      name: address1,
    },
    {
      type: "Dwelling",
      id: "ea0b9c3e-3d72-276c-be2d-04620e2bf0e3",
      name: address2,
    },
  ],
};

test("it renders the component", async () => {
  const assetType = "Dwelling";
  const { container } = render(
    <RelatedAssets assetType={assetType} relatedAssets={assetsByType[assetType]} />,
  );
  expect(container).toMatchSnapshot();
});

test("the asset type is displayed in plural form", async () => {
  const assetType = "Dwelling";

  const { container } = render(
    <RelatedAssets assetType={assetType} relatedAssets={assetsByType[assetType]} />,
  );
  expect(container).toHaveTextContent(`${assetType}s`);
});

test("related assets' addresses are displayed", async () => {
  const assetType = "Dwelling";

  const { container } = render(
    <RelatedAssets assetType={assetType} relatedAssets={assetsByType[assetType]} />,
  );

  expect(container).toHaveTextContent(address1);
  expect(container).toHaveTextContent(address2);
});
