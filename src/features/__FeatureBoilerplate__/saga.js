
import { delay } from 'redux-saga';

import { takeLatest, all } from 'redux-saga/effects';

import { api } from '~/api'; 

import { 
  FETCH_FEATURE, FETCH_FEATURE_SUCCESS, FETCH_FEATURE_ERROR,
  BOOTSTRAP
} from './constants';

import { singleApiCall } from '~/utils/saga';


export const fetchFeature = singleApiCall({
  method: api.fetchUserAuthorizations,
  types: [ FETCH_FEATURE, FETCH_FEATURE_SUCCESS, FETCH_FEATURE_ERROR ],
});

export function* bootstrap() {
  yield delay(100);
}


export function* featureSagas() {
  yield all([
    takeLatest(FETCH_FEATURE, fetchFeature),
    takeLatest(BOOTSTRAP, bootstrap),
  ]);
}
