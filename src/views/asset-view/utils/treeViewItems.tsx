import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ElevatorIcon from '@mui/icons-material/Elevator';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import HouseIcon from '@mui/icons-material/House';
import PowerIcon from '@mui/icons-material/Power';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TreeItem from '@mui/lab/TreeItem';
import React from "react";
import { AssetType } from "../../../utils/asset-type";

// change type from any to Asset
const renderTreeViewItem = (asset: any): JSX.Element => {
  return (
    <div className="tree-view-item">
      {renderAssetTypeIcon(asset)}<TreeItem nodeId={asset.id} label={asset.assetAddress.addressLine1} />
    </div>
  )
}

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
      return <WaterDropIcon/>

    default:
      return <HouseIcon />
  }
}

export { renderTreeViewItem, renderAssetTypeIcon };
