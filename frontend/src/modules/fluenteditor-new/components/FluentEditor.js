/* @flow */

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'modules/fluenteditor/components/Editor.css';

import * as editor from 'core/editor';
import * as entities from 'core/entities';
import * as notification from 'core/notification';
import * as plural from 'core/plural';
import { fluent } from 'core/utils';

import SourceEditor from './source/SourceEditor';
import SimpleEditor from './simple/SimpleEditor';
import RichEditor from './rich/RichEditor';


/**
 * Hook to analyze a translation and determine what its appropriate syntax is.
 *
 * This hook recomputes the syntax type every time the entity changes. It also updates
 * the translation and initial translation, meaning specialized Fluent editors don't
 * need to do it themselves.
 *
 * @returns { string } The syntax of the translation, can be "simple", "rich" or "complex".
 *      - "simple" if the translation can be shown as a simple preview
 *      - "rich" if the translation is not simple but can be handled by the Rich editor
 *      - "complex" otherwise
 */
function useAnalyzeFluentMessage() {
    // The type of form to use to show the translation.
    const [syntaxType, setSyntaxType] = React.useState('complex');

    const activeTranslationString = useSelector(
        state => plural.selectors.getTranslationStringForSelectedEntity(state)
    );
    const entity = useSelector(state => entities.selectors.getSelectedEntity(state));

    React.useEffect(() => {
        const source = activeTranslationString || entity.original;
        const message = fluent.parser.parseEntry(source);

        // In case a simple message gets analyzed again.
        if (message.type === 'Junk') {
            return;
        }

        // Figure out and set the syntax type.
        const syntaxType = fluent.getSyntaxType(message);
        setSyntaxType(syntaxType);
    }, [entity, activeTranslationString]);

    return syntaxType;
}


/**
 * Hook to allow to force showing the source editor.
 *
 * @returns { Array<boolean, Function> } An array containing:
 *      - a boolean indicating if the source mode is enabled;
 *      - a function to toggle the source mode.
 */
function useForceSource() {
    const dispatch = useDispatch();

    const translation = useSelector(state => state.editor.translation);
    const entity = useSelector(state => entities.selectors.getSelectedEntity(state));
    const activeTranslationString = useSelector(
        state => plural.selectors.getTranslationStringForSelectedEntity(state)
    );
    const locale = useSelector(state => state.locale);

    // Force using the source editor.
    const [forceSource, setForceSource] = React.useState(false);

    const syntaxType = useAnalyzeFluentMessage();

    // When the entity changes, reset the `forceSource` setting. Never show the source
    // editor by default.
    React.useEffect(() => {
        setForceSource(false);
    }, [entity]);

    // When a user wants to force (or unforce) the source editor, we need to convert
    // the existing translation to a format appropriate for the next editor type.
    function changeForceSource() {
        if (syntaxType === 'complex') {
            return;
        }
        const fromSyntax = forceSource ? 'complex' : syntaxType;
        const toSyntax = forceSource ? syntaxType : 'complex';
        const [translationContent, initialContent] = fluent.convertSyntax(
            fromSyntax,
            toSyntax,
            translation,
            entity.original,
            activeTranslationString,
            locale,
        );
        dispatch(editor.actions.setInitialTranslation(initialContent));
        dispatch(editor.actions.update(translationContent));
        setForceSource(!forceSource);
    }

    return [forceSource, changeForceSource];
}


/**
 * Editor dedicated to modifying Fluent strings.
 *
 * Renders the most appropriate type of editor for the current translation.
 */
export default function FluentEditor() {
    const dispatch = useDispatch();

    const isReadOnlyEditor = useSelector(state => entities.selectors.isReadOnlyEditor(state));
    const user = useSelector(state => state.user);

    const [forceSource, changeForceSource] = useForceSource();
    const syntaxType = useAnalyzeFluentMessage();

    // Choose which editor implementation to render.
    let EditorImplementation = RichEditor;
    if (forceSource || syntaxType === 'complex') {
        EditorImplementation = SourceEditor;
    }
    else if (syntaxType === 'simple') {
        EditorImplementation = SimpleEditor;
    }

    // When the syntax is complex, the editor is blocked in source mode, and it
    // becomes impossible to switch to a different editor type. Thus we show a
    // notification to the user if they try to use the "FTL" switch button.
    function showUnsupportedMessage() {
        dispatch(
            notification.actions.add(
                notification.messages.FTL_NOT_SUPPORTED_RICH_EDITOR
            )
        );
    }

    // Show a button to allow switching to the source editor.
    let ftlSwitch = null;
    // But only if the user is logged in and the string is not read-only.
    if (user.isAuthenticated && !isReadOnlyEditor) {
        if (syntaxType === 'complex') {
            // TODO: To Localize
            ftlSwitch = <button
                className='ftl active'
                title='Advanced FTL mode enabled'
                onClick={ showUnsupportedMessage }
            >
                FTL
            </button>;
        }
        else {
            // TODO: To Localize
            ftlSwitch = <button
                className={ 'ftl' + (forceSource ? ' active' : '') }
                title='Toggle between simple and advanced FTL mode'
                onClick={ changeForceSource }
            >
                FTL
            </button>;
        }
    }

    return <EditorImplementation
        ftlSwitch={ ftlSwitch }
    />;
}
