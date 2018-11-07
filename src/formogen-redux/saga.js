
import { delay } from 'redux-saga';

import { takeLatest, all } from 'redux-saga/effects';

import { 
  BOOTSTRAP,
  FETCH_FORM_METADATA,
  FETCH_FORM_METADATA_SUCCESS,
  FETCH_FORM_METADATA_ERROR,
} from './constants';
import { singleApiCall } from './sagaHelpers';


// export const fetchFormMetadata = singleApiCall({
//   method: api.fetchUserAuthorizations,
//   types: [ FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR ],
// });

export function* bootstrap({ type, payload }) {
  console.log(type, payload);
  yield delay(100);
}


export function* formogenSagas() {
  yield all([
    // takeLatest(FETCH_FORM_METADATA, fetchFormMetadata),
    takeLatest(BOOTSTRAP, bootstrap),
  ]);
}
