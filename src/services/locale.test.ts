import locale from "./locale";

test("assetType returns for Dwelling", () => {
  expect(locale.assets.assetType("Dwelling")).toBe("Dwelling");
  expect(locale.assets.assetType("LettableNonDwelling")).toBe("Lettable non-dwelling");
  expect(locale.assets.assetType("test")).toBe("test");
});
