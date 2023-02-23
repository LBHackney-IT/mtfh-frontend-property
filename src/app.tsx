import React from "react";
import { Route, Switch } from "react-router-dom";
import { AssetEditView } from "views/asset-edit";
import { AssetView } from "./views/asset-view";

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route path="/property/:assetId" exact>
        <div data-testid="property">
          <AssetView />
        </div>
      </Route>
      <Route path="/property/:assetId/edit" exact>
        <div data-testid="edit-property">
          <AssetEditView />
        </div>
      </Route>
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
