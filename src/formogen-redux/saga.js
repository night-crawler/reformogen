
// import { delay } from 'redux-saga';
import { takeLatest, all, put, takeEvery, select } from 'redux-saga/effects';

import { executeRequest, singleApiCall, processError } from './apiHelpers';
import { 
  BOOTSTRAP, BOOTSTRAP_SUCCESS, BOOTSTRAP_ERROR,

  FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR,
  FETCH_FIELD_OPTIONS, FETCH_FIELD_OPTIONS_SUCCESS, FETCH_FIELD_OPTIONS_ERROR,
} from './constants';


export const fetchFormMetadata = singleApiCall({
  method: requestOpts => executeRequest(requestOpts),
  types: [ FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR ],
});


export const fetchFieldOptions = singleApiCall({
  method: ({ url, page, inputText }) => executeRequest({ 
    url, 
    query: { page, q: inputText } 
  }),
  types: [ FETCH_FIELD_OPTIONS, FETCH_FIELD_OPTIONS_SUCCESS, FETCH_FIELD_OPTIONS_ERROR, ],
});



export function* bootstrap({ 
  payload: { 
    describeUrl,
    locale,
  },
  meta: { formId }
}) {
  const { error: fetchFormMetadataError } = yield fetchFormMetadata({
    payload: { url: describeUrl, locale },
    meta: { formId }
  });

  if (fetchFormMetadataError !== undefined)
    return yield processError(
      BOOTSTRAP_ERROR, 
      fetchFormMetadataError,
      { arguments: arguments }
    );

  yield put({ type: BOOTSTRAP_SUCCESS });
  return true;
}


export function* fetchFieldOptionsSaga({ 
  payload: { callback, inputText, fieldName, url, page=1 },
  meta: { formId },
}) {
  const { result: optionsPage } = yield fetchFieldOptions({
    payload: { inputText, url, page },
    meta: { formId, fieldName, page }
  });

  const qwe = yield select();
  callback(qwe.formogen[`Form:${formId}:field:${fieldName}:options`]);
}


export function* formogenSagas() {
  yield all([
    takeLatest(FETCH_FORM_METADATA, fetchFormMetadata),
    takeLatest(BOOTSTRAP, bootstrap),
    takeEvery(FETCH_FIELD_OPTIONS, fetchFieldOptionsSaga),
  ]);
}
