import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { PropertyView } from './views/property-view';

export default function App(): JSX.Element {
    return (
        <Switch>
            <Route path="/property/:propertyId" exact>
                <div data-testid="property">
                    <PropertyView />
                </div>
            </Route>
            <Route>
                <div>404</div>
            </Route>
        </Switch>
    );
}
