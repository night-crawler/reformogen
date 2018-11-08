
import { delay } from 'redux-saga';

import { takeLatest, all, put, call } from 'redux-saga/effects';

import { executeRequest, singleApiCall, processError } from './apiHelpers';
import { 
  BOOTSTRAP, BOOTSTRAP_SUCCESS, BOOTSTRAP_ERROR,

  FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR,

  SAGA_RETRY_COUNT, SAGA_RETRY_TIMEOUT,
} from './constants';


export const fetchFormMetadata = singleApiCall({
  method: requestOpts => executeRequest(requestOpts),
  types: [ FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR ],
});

export function* bootstrap({ 
  payload: { 
    describeUrl,
    formId,
    locale,
  } 
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

}


export function* formogenSagas() {
  yield all([
    takeLatest(FETCH_FORM_METADATA, fetchFormMetadata),
    takeLatest(BOOTSTRAP, bootstrap),
  ]);
}
