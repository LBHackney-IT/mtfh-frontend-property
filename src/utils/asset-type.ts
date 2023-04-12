const AssetType = {
  Block: "Block",
  Concierge: "Concierge",
  Dwelling: "Dwelling",
  LettableNonDwelling: "LettableNonDwelling",
  MediumRiseBlock: "MediumRiseBlock",
  NA: "NA",
  TravellerSite: "TravellerSite",
  AdministrativeBuilding: "AdministrativeBuilding",
  BoilerHouse: "BoilerHouse",
  BoosterPump: "BoosterPump",
  CleanersFacilities: "CleanersFacilities",
  CombinedHeatAndPowerUnit: "CombinedHeatAndPowerUnit",
  CommunityHall: "CommunityHall",
  Estate: "Estate",
  HighRiseBlock: "HighRiseBlock",
  Lift: "Lift",
  LowRiseBlock: "LowRiseBlock",
  NBD: "NBD",
  OutBuilding: "OutBuilding",
  TerracedBlock: "TerracedBlock",
  WalkUpBlock: "WalkUpBlock",
  StudioFlat: "StudioFlat",
  Flat: "Flat",
  Room: "Room",
  House: "House",
  SelfContainedBedsit: "SelfContainedBedsit",
  Maisonette: "Maisonette",
  NewBuild: "NewBuild",
};

const assetTypesWithFloors = [
  "Block",
  "MediumRiseBlock",
  "AdministrativeBuilding",
  "CommunityHall",
  "HighRiseBlock",
  "LowRiseBlock",
  "TerracedBlock",
  "WalkUpBlock",
  "NewBuild",
];

const assetsWithFloorNo = [
  "Dwelling",
  "LettableNonDwelling",
  "BoilerHouse",
  "BoosterPump",
  "CleanersFacilities",
  "CombinedHeatAndPowerUnit",
  "StudioFlat",
  "Flat",
  "Room",
  "SelfContainedBedsit",
  "Maisonette",
];

const assetsOfDwellingType = [
  "Dwelling",
  "LettableNonDwelling",
  "Flat",
  "Maisonette",
  "House",
  "NewBuild",
];

const assetHasFloors = (assetType: string): boolean => {
  return !!assetTypesWithFloors.includes(assetType);
};

const assetHasFloorNo = (assetType: string): boolean => {
  return !!assetsWithFloorNo.includes(assetType);
};

const assetIsOfDwellingType = (assetType: string): boolean => {
  return !!assetsOfDwellingType.includes(assetType);
};

export { AssetType, assetHasFloors, assetHasFloorNo, assetIsOfDwellingType };
