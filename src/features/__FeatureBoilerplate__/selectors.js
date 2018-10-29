import { createSelector } from 'reselect';


export const feature = state => state.feature;

/**
 * state.feature.data
 */
export const data = createSelector(feature, feature => feature.data);
