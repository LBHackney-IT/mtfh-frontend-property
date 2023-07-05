import React from "react";
import { Route, Switch } from "react-router-dom";

import { AssetEditView } from "./views/asset-edit-view";
import { AssetView } from "./views/asset-view";
import { NewAssetView } from "./views/new-asset-view/new-asset-view";
import { AddBoilerHouseView } from "./views/add-boiler-house-view";



export default function App(): JSX.Element {
  return (
    <Switch>
      <Route path="/property/new" exact>
        <div data-testid="new-property">
          <NewAssetView />
        </div>
      </Route>
      <Route path="/property/:assetId" exact>
        <div data-testid="property">
          <AssetView />
        </div>
      </Route>
      <Route path="/property/edit/:assetId" exact>
        <div data-testid="property-edit">
          <AssetEditView />
        </div>
      </Route>
      <Route path="/property/:assetId/add-boiler-house" exact>
        <AddBoilerHouseView />
      </Route>
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
