import React from "react";
import { Route, Switch } from "react-router-dom";

import { AssetView } from "./views/asset-view";
import { AssetEditView } from "./views/asset-edit-view/asset-edit-view"

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route path="/property/:assetId" exact>
        <div data-testid="property">
          <AssetView />
        </div>
      </Route>
      <Route path="/property/:assetId/edit" exact>
        <div data-testid="property">
          <AssetEditView />
        </div>
      </Route>
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
