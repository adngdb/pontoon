/*
 * A redux store creator for our testing environment.
 *
 * Notably, this one doesn't have any logging, and supports an initialState.
 */

import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { mount } from 'enzyme';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { createMemoryHistory } from 'history';

import createRootReducer from 'rootReducer';


const history = createMemoryHistory({
    initialEntries: ['/kg/firefox/all-resources/?string=1'],
});


export function createReduxStore(initialState = {}) {
    return createStore(
        createRootReducer(history),
        initialState,
        compose(
            applyMiddleware(
                routerMiddleware(history),
                thunkMiddleware,
            )
        )
    );
}


export function mountComponentWithStore(Component, store, props = {}) {
    return mount(
        <Provider store={ store }>
            <ConnectedRouter history={ history }>
                <Component { ...props } />
            </ConnectedRouter>
        </Provider>
    );
}
