import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ElevatorIcon from '@mui/icons-material/Elevator';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import HouseIcon from '@mui/icons-material/House';
import PowerIcon from '@mui/icons-material/Power';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import TreeItem from '@mui/lab/TreeItem';
import React from "react";
import { AssetType } from "../../../utils/asset-type";


// change type from any to Asset
const renderAssetTypeIcon = (asset: any) => {

  switch (asset.assetType) {

    case AssetType.Estate:
      return <HolidayVillageIcon />

    case AssetType.Block:
    case AssetType.MediumRiseBlock:
    case AssetType.HighRiseBlock:
    case AssetType.LowRiseBlock:
    case AssetType.WalkUpBlock:
    case AssetType.TerracedBlock:
      return <ApartmentIcon />

    case AssetType.CombinedHeatAndPowerUnit:
      return <PowerIcon />

    case AssetType.CommunityHall:
      return <AccountBalanceIcon />

    case AssetType.Lift:
      return <ElevatorIcon />

    case AssetType.BoosterPump:
    case AssetType.BoilerHouse:
      return <WaterDropIcon />

    case AssetType.Room:
      return <MeetingRoomIcon />

    default:
      return <HouseIcon />
  }
}

export { renderAssetTypeIcon };
