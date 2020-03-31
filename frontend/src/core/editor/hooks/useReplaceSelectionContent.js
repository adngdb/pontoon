/* @flow */

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as editor from 'core/editor';


export default function useReplaceSelectionContent(updateTranslationSelectionWith: Function) {
    const dispatch = useDispatch();
    const selectionReplacementContent = useSelector(
        state => state.editor.selectionReplacementContent
    );

    React.useEffect(() => {
        // If there is content to add to the editor, do so, then remove
        // the content so it isn't added again.
        // This is an abuse of the redux store, because we want to update
        // the content differently for each Editor type. Thus each Editor
        // must use this hook and pass it a function specific to its needs.
        if (selectionReplacementContent) {
            updateTranslationSelectionWith(selectionReplacementContent);
            dispatch(editor.actions.resetSelection());
        }
    }, [selectionReplacementContent, dispatch, updateTranslationSelectionWith]);
}
