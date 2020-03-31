/* @flow */

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as editor from 'core/editor';
import * as entities from 'core/entities';
import * as plural from 'core/plural';
import * as unsavedchanges from 'modules/unsavedchanges';


type Props = {|
    sendTranslation: (ignoreWarnings?: boolean) => void,
    updateTranslation: (string) => void,
|};


/**
 * Shows a generic translation form, a simple textarea.
 */
export default function GenericTranslationForm(props: Props) {
    function handleChange(event: SyntheticInputEvent<HTMLTextAreaElement>) {
        props.updateTranslation(event.currentTarget.value);
    }

    const handleShortcutsFn = editor.useHandleShortcuts();

    function handleShortcuts(event: SyntheticKeyboardEvent<HTMLTextAreaElement>) {
        handleShortcutsFn(
            event,
            props.sendTranslation,
        );
    }

    const translation = useSelector(state => state.editor.translation);
    const initialTranslation = useSelector(state => state.editor.initialTranslation);
    const changeSource = useSelector(state => state.editor.changeSource);
    const textareaRef = React.useRef(null);

    // Focus the textarea when something changes.
    const searchInputFocused = useSelector(state => state.search.searchInputFocused);
    React.useEffect(() => {
        const input = textareaRef.current;

        if (!input || searchInputFocused) {
            return;
        }

        input.focus();

        if (changeSource !== 'internal') {
            input.setSelectionRange(0, 0);
        }
    });

    // Reset checks when content of the editor changes.
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(editor.actions.resetFailedChecks());
    }, [translation, dispatch]);

    // When content of the translation changes
    //   - close unsaved changes popup if open
    //   - update unsaved changes status
    const activeTranslationString = useSelector(
        state => plural.selectors.getTranslationStringForSelectedEntity(state)
    );

    // When the translation or the active translation or the initial translation change,
    // check for unsaved changes.
    React.useEffect(() => {
        dispatch(unsavedchanges.actions.hide());
        dispatch(unsavedchanges.actions.update(
            translation,
            initialTranslation || activeTranslationString
        ));
    }, [translation, activeTranslationString, initialTranslation, dispatch]);

    // Replace selected content on external actions (for example, when a user clicks
    // on a placeable).
    editor.useReplaceSelectionContent((content: string) => {
        const input = textareaRef.current;

        if (!input) {
            return;
        }

        const newSelectionPos = input.selectionStart + content.length;

        // Update content in the textarea.
        input.setRangeText(content);

        // Put the cursor right after the newly inserted content.
        input.setSelectionRange(
            newSelectionPos,
            newSelectionPos,
        );

        // Update the state to show the new content in the Editor.
        props.updateTranslation(input.value);
    });

    const locale = useSelector(state => state.locale);
    const isReadOnlyEditor = useSelector(
        state => entities.selectors.isReadOnlyEditor(state)
    );
    return (
        <textarea
            placeholder={
                isReadOnlyEditor ? null :
                'Type translation and press Enter to save'
            }
            readOnly={ isReadOnlyEditor }
            // $FLOW_IGNORE: No idea why this is erroring out.
            ref={ textareaRef }
            value={ translation }
            onKeyDown={ handleShortcuts }
            onChange={ handleChange }
            dir={ locale.direction }
            lang={ locale.code }
            data-script={ locale.script }
        />
    );
}
