import { Route, Switch } from 'react-router-dom';
import React from 'react';

export default function App(): JSX.Element {
    return (
        <Switch>
            <Route path="/property/:propertyId" exact>
                <div data-testid="property">Property view placeholder</div>
            </Route>
            <Route>
                <div>404</div>
            </Route>
        </Switch>
    );
}
