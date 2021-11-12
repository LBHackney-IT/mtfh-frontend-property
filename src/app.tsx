import React from "react";
import { Route, Switch } from "react-router-dom";

import { AssetView } from "./views/asset-view";

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route path="/property/:assetId" exact>
        <div data-testid="property">
          <AssetView />
        </div>
      </Route>
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
