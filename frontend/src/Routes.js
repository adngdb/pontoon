/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router';

import App from './App';
import { ReviewListPage, ReviewPage } from 'pages/review';
import { EntitiesListPage, TranslatePage } from 'pages/translate';


export default function Routes() {
    return <Switch>
        {/* Review interface */}
        <Route exact path="/:locale/:project/review/:translation" component={ ReviewPage } />
        <Route exact path="/:locale/:project/review/" component={ ReviewListPage } />

        {/* Translate interface */}
        <Route exact path="/:locale/:project/translate/:translation" component={ TranslatePage } />
        <Route exact path="/:locale/:project/translate/" component={ EntitiesListPage } />

        {/* Classic Translate interface (3-columns) */}
        <Route path="/" component={ App } />
    </Switch>;
}
