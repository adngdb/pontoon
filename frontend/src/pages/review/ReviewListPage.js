/* @flow */

import * as React from 'react';
import { useParams } from 'react-router-dom';

import './ReviewListPage.css';

import { ReviewList } from 'modules/review';


export default function ReviewListPage() {
    const { project, locale } = useParams();

    return <div className="review-list-page">
        <header>
            <h1>Unreviewed Suggestions</h1>
            <h2>{ `${locale} ⋅ ${project}` }</h2>
        </header>
        <section>
            <ReviewList />
        </section>
    </div>;
}
