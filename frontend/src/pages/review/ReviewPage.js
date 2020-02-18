/* @flow */

import * as React from 'react';
import { useParams } from 'react-router-dom';

import { ReviewTranslation } from 'modules/review';


export default function ReviewPage() {
    const { project, locale } = useParams();

    return <div className="review-page">
        <header>
            <h1>Reviewing Suggestion</h1>
            <h2>{ `${locale} ⋅ ${project}` }</h2>
        </header>
        <section>
            <ReviewTranslation />
        </section>
    </div>;
}
