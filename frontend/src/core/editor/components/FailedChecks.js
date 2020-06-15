/* @flow */

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Localized } from '@fluent/react';

import './FailedChecks.css';

import * as editor from 'core/editor';
import * as user from 'core/user';

import type { UserState } from 'core/user';
import type { ChangeOperation } from 'modules/history';


type FailedChecksProps = {|
    sendTranslation: (ignoreWarnings?: boolean, translation?: string) => void,
    updateTranslationStatus: (
        translationId: number,
        change: ChangeOperation,
        ignoreWarnings: ?boolean,
    ) => void,
|};

/**
 * Shows a list of failed checks (errors and warnings) and a button to ignore
 * those checks and proceed anyway.
 */
export default function FailedChecks(props: FailedChecksProps) {
    const errors = useSelector(state => state.editor.errors);
    const warnings = useSelector(state => state.editor.warnings);
    if (!errors.length && !warnings.length) {
        return null;
    }

    const dispatch = useDispatch();
    function resetChecks() {
        dispatch(editor.actions.resetFailedChecks());
    }

    const source = useSelector(state => state.editor.source);
    function approveAnyway() {
        if (typeof(source) === 'number') {
            props.updateTranslationStatus(source, 'approve', true);
        }
    }

    function submitAnyway() {
        props.sendTranslation(true);
    }

    const userState = useSelector(state => state.user);
    const isTranslator = useSelector(state => user.selectors.isTranslator(state));

    return (
        <div className="failed-checks">
            <Localized
                id="editor-FailedChecks--close"
                attrs={{ ariaLabel: true }}
            >
                <button
                    aria-label="Close failed checks popup"
                    className="close"
                    onClick={ this.closeFailedChecks }
                >×</button>
            </Localized>
            <Localized
                id="editor-FailedChecks--title"
            >
                <p className="title">The following checks have failed</p>
            </Localized>
            <ul>
                { errors.map(
                    (error, key) => <li className="error" key={ key }>
                        { error }
                    </li>
                ) }
                { warnings.map(
                    (warning, key) => <li className="warning" key={ key }>
                        { warning }
                    </li>
                ) }
            </ul>
            <MainAction
                source={ source }
                user={ userState }
                isTranslator={ isTranslator }
                errors={ errors }
                approveAnyway={ approveAnyway }
                submitAnyway={ submitAnyway }
            />
        </div>
    );
}


type MainActionProps = {|
    source: number,
    user: UserState,
    isTranslator: boolean,
    errors: Array<string>,
    approveAnyway: () => void,
    submitAnyway: () => void,
|};

/**
 * Shows a button to ignore failed checks and proceed with the main editor action.
 */
function MainAction(props: MainActionProps) {
    const { source, user, isTranslator, errors, approveAnyway, submitAnyway } = props;

    if (source === 'stored' || errors.length) {
        return null;
    }

    if (source !== 'submitted') {
        return <Localized id="editor-FailedChecks--approve-anyway">
            <button
                className="approve anyway"
                onClick={ approveAnyway }
            >
                Approve anyway
            </button>
        </Localized>;
    }

    if (user.settings.forceSuggestions || !isTranslator) {
        return <Localized id="editor-FailedChecks--suggest-anyway">
            <button
                className="suggest anyway"
                onClick={ submitAnyway }
            >
                Suggest anyway
            </button>
        </Localized>;
    }

    return <Localized id="editor-FailedChecks--save-anyway">
        <button
            className="save anyway"
            onClick={ submitAnyway }
        >
            Save anyway
        </button>
    </Localized>;
}
