/*
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = '@yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

import { PROJECT_NAME } from '~/constants';

const PREFIX = `@${PROJECT_NAME}/FeatureBoilerplate`;

export const BOOTSTRAP = `${PREFIX}/BOOTSTRAP`;
export const BOOTSTRAP_SUCCESS = `${BOOTSTRAP}/SUCCESS`;
export const BOOTSTRAP_ERROR = `${BOOTSTRAP}/ERROR`;

export const FETCH_FEATURE = `${PREFIX}/FETCH_FEATURE`;
export const FETCH_FEATURE_SUCCESS = `${PREFIX}/FETCH_FEATURE_SUCCESS`;
export const FETCH_FEATURE_ERROR = `${PREFIX}/FETCH_FEATURE_ERROR`;
