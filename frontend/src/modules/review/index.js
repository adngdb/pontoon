/* @flow */

export { default as actions } from './actions';
export { default as reducer } from './reducer';

export { default as ReviewList } from './components/ReviewList';
export { default as ReviewPage } from './components/ReviewPage';


// Name of this module.
// Used as the key to store this module's reducer.
export const NAME: string = 'review';
