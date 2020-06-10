import React from 'react';
import { mount } from 'enzyme';

import * as entities from 'core/entities';

import EditorMenu from './EditorMenu';
import EditorSettings from './EditorSettings';
import KeyboardShortcuts from './KeyboardShortcuts';
import TranslationLength from './TranslationLength';

import { createDefaultRoute, createDefaultUser } from 'test/utils';
import { createReduxStore, mountComponentWithStore } from 'test/store';


const LOCALE = {
    code: 'kg',
}

const SELECTED_ENTITY = {
    pk: 42,
    original: 'le test',
    original_plural: 'les tests',
    translation: [
        { string: 'test' },
        { string: 'test plural' },
    ],
};


function createEditorMenu({
    forceSuggestions = true,
    isAuthenticated = true,
    entity = SELECTED_ENTITY,
    firstItemHook = null,
} = {}) {
    const store = createReduxStore();
    createDefaultUser(store, {
        is_authenticated: isAuthenticated,
        settings: {
            force_suggestions: forceSuggestions,
        },
    });
    createDefaultRoute(store, `/kg/firefox/resource/?string=${entity.pk}`);

    store.dispatch(entities.actions.receive([ entity ], false));

    const comp = mountComponentWithStore(
        EditorMenu,
        store,
        { firstItemHook },
    );

    console.debug(store.getState());

    return [ comp, store ];
}


function expectHiddenSettingsAndActions(wrapper) {
    expect(wrapper.find('button')).toHaveLength(0);
    expect(wrapper.find(EditorSettings)).toHaveLength(0);
    expect(wrapper.find(KeyboardShortcuts)).toHaveLength(0);
    expect(wrapper.find(TranslationLength)).toHaveLength(0);
    expect(wrapper.find('#editor-EditorMenu--button-copy')).toHaveLength(0);
}


describe('<EditorMenu>', () => {
    it('renders correctly', () => {
        const [ wrapper, store ] = createEditorMenu();

        // 3 buttons to control the editor.
        expect(wrapper.find('.action-copy').exists()).toBeTruthy();
        expect(wrapper.find('.action-clear').exists()).toBeTruthy();
        expect(wrapper.find('EditorMainAction')).toHaveLength(1);
    });

    it('hides the settings and actions when the user is logged out', () => {
        const [ wrapper, store ] = createEditorMenu({ isAuthenticated: false });

        expectHiddenSettingsAndActions(wrapper);

        expect(wrapper.find('#editor-EditorMenu--sign-in-to-translate')).toHaveLength(1);
    });

    it('hides the settings and actions when the entity is read-only', () => {
        const entity = {
            ...SELECTED_ENTITY,
            readonly: true,
        }
        const [ wrapper, store ] = createEditorMenu({ entity });

        expectHiddenSettingsAndActions(wrapper);

        expect(wrapper.find('#editor-EditorMenu--read-only-localization')).toHaveLength(1);
    });

    it('accepts a firstItemHook and shows it as its first child', () => {
        const firstItemHook = <p>Hello</p>;
        const [ wrapper, store ] = createEditorMenu({ firstItemHook });

        expect(wrapper.find('menu').children().first().text()).toEqual('Hello');
    });
});
