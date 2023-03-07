import React from "react";
import { Route, Switch } from "react-router-dom";

import { AssetEditView } from "./views/asset-edit-view";
import { AssetView } from "./views/asset-view";

export default function App(): JSX.Element {
  return (
    <Switch>
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
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
