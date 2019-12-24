/* @flow */

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import './ReviewList.css';

import { actions, NAME } from '..';


export default function ReviewList() {
    const dispatch = useDispatch();

    // Get data from store and libraries.
    const { project, locale } = useParams();
    const suggestions = useSelector((state) => state[NAME].suggestions);

    // Load suggestions if needed.
    React.useEffect(() => {
        dispatch(actions.get(locale, project));
    }, [dispatch, locale, project]);

    return <ul className="review-list">
        { suggestions.map((suggestion) => <li key={ suggestion.id }>
            <Link to={ `/${locale}/${project}/review/${suggestion.id}` }>
                <span><ReactTimeAgo date={ new Date(suggestion.date) } /></span>
                <p className="original">{ suggestion.original }</p>
                <span>{ suggestion.user }</span>
                <p className="suggestion">{ suggestion.translation }</p>
            </Link>
        </li>) }
    </ul>;
}
