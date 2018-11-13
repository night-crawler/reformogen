
// import { delay } from 'redux-saga';
import { takeLatest, all, put, takeEvery, select } from 'redux-saga/effects';

import { responseAdapterRegistry } from './ResponseAdapters';
import { executeRequest, singleApiCall, processError } from './apiHelpers';
import { 
  BOOTSTRAP, BOOTSTRAP_SUCCESS, BOOTSTRAP_ERROR,

  FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR,
  FETCH_FORM_DATA, FETCH_FORM_DATA_SUCCESS, FETCH_FORM_DATA_ERROR,

  FETCH_NEXT_FIELD_OPTIONS, FETCH_NEXT_FIELD_OPTIONS_SUCCESS, FETCH_NEXT_FIELD_OPTIONS_ERROR,
} from './constants';
import { formogen as formogenSelector } from './selectors';

export const fetchFormMetadata = singleApiCall({
  method: requestOpts => executeRequest(requestOpts),
  types: [ FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR ],
});


export const fetchFormData = singleApiCall({
  method: requestOpts => executeRequest(requestOpts),
  types: [ FETCH_FORM_DATA, FETCH_FORM_DATA_SUCCESS, FETCH_FORM_DATA_ERROR, ],
});

export const searchDataFieldOptions = singleApiCall({
  processResponse: ({ response, payload: { url } }) => {
    const Adapter = responseAdapterRegistry.resolveAdapter(url);
    return new Adapter(response.body);
  },
  method: ({ url, page, inputText }) => executeRequest({ 
    url, 
    query: { page, q: inputText } 
  }),
  types: [ 
    FETCH_NEXT_FIELD_OPTIONS, 
    FETCH_NEXT_FIELD_OPTIONS_SUCCESS, 
    FETCH_NEXT_FIELD_OPTIONS_ERROR, 
  ],
});


export function* bootstrap({ payload, meta }) {
  const gathered = [
    fetchFormMetadata({
      payload: { url: payload.describeUrl, locale: payload.locale },
      meta: { formId: meta.formId }
    })
  ];

  payload.objectUrl && gathered.push(fetchFormData({
    payload: { url: payload.objectUrl, locale: payload.locale },
    meta: { formId: meta.formId }
  }));

  const [ 
    { error: fetchFormMetadataError }, 
    { error: fetchFormDataError } = {}
  ] = yield all(gathered);

  if (!(fetchFormMetadataError === fetchFormDataError === undefined))
    return yield processError(
      BOOTSTRAP_ERROR, 
      fetchFormMetadataError,
      { arguments: arguments }
    );

  yield put({ type: BOOTSTRAP_SUCCESS });
  return true;
}

export function* fetchNextFieldOptions({ payload, meta }) {
  let formogen = yield select(formogenSelector);
  const nextPageNumber = formogen[`Form:${meta.formId}:field:${meta.fieldName}:nextPageNumber`];
  const currentPageNumber = formogen[`Form:${meta.formId}:field:${meta.fieldName}:currentPageNumber`];

  let requestPageNumber = meta.page || nextPageNumber;
  if (!currentPageNumber) 
    requestPageNumber = 1;

  if (!requestPageNumber)
    return;

  yield searchDataFieldOptions({
    payload: { 
      inputText: payload.inputText, 
      url: payload.url, 
      page: requestPageNumber,
    },
    meta: { 
      formId: meta.formId, 
      fieldName: meta.fieldName, 
    }
  });

  formogen = yield select(formogenSelector);
  const options = formogen[`Form:${meta.formId}:field:${meta.fieldName}:options`];

  payload.callback(options);
}


export function* formogenSagas() {
  yield all([
    takeEvery(FETCH_FORM_METADATA, fetchFormMetadata),
    takeEvery(BOOTSTRAP, bootstrap),
    takeEvery(FETCH_NEXT_FIELD_OPTIONS, fetchNextFieldOptions),
  ]);
}
