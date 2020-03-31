/* @flow */

import * as React from 'react';

import 'core/editor/components/connectedEditor.css';

import { FluentEditor } from 'modules/fluenteditor-new';
import { GenericEditor } from 'modules/genericeditor-new';


type Props = {
    fileFormat: string,
};

export default function EditorSelector(props: Props) {
    if (props.fileFormat === 'ftl') {
        return <div className="editor"><FluentEditor /></div>;
    }
    return <div className="editor"><GenericEditor /></div>;
}
