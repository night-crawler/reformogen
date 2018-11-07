
import { delay } from 'redux-saga';
import request from 'superagent';

import { takeLatest, all, put } from 'redux-saga/effects';

import { storeFormMetaData } from '~/formogen-redux/actions';

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
  const response = yield request.get(payload.describeUrl);
  
  yield put(storeFormMetaData(payload.formId, response.body));
  // console.log(type, payload);
  yield delay(100);
}


export function* formogenSagas() {
  yield all([
    // takeLatest(FETCH_FORM_METADATA, fetchFormMetadata),
    takeLatest(BOOTSTRAP, bootstrap),
  ]);
}
