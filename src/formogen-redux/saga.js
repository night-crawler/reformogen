import { map, isEmpty } from 'lodash';

import { all, put, takeEvery, select } from 'redux-saga/effects';

import { 
  BOOTSTRAP, BOOTSTRAP_SUCCESS, BOOTSTRAP_ERROR,
  FETCH_NEXT_FIELD_OPTIONS,
  SUBMIT,
} from './constants';
import { 
  formogen as formogenSelector,
  metaDataM2MFields as metaDataM2MFieldsSelector,
  storedFieldValue as storedFieldValueSelector,
  finalFormData as finalFormDataSelector,
  dirtyFormFiles as dirtyFormFilesSelector,
  fieldFileUploadUrl as fieldFileUploadUrlSelector,
} from './selectors';
import * as api from './api';
import { processError } from './apiHelpers';
import { storeFieldOptions, changeFieldSearchText } from './actions';


export function* bootstrap({ payload, meta }) {
  const gathered = [
    api.fetchFormMetadata({
      payload: { url: payload.describeUrl, locale: payload.locale },
      meta: { formId: meta.formId }
    })
  ];

  payload.objectUrl && gathered.push(api.fetchFormData({
    payload: { url: payload.objectUrl, locale: payload.locale },
    meta: { formId: meta.formId }
  }));

  const [ 
    { error: fetchFormMetadataError }, 
    { error: fetchFormDataError } = {}
  ] = yield all(gathered);

  if (fetchFormMetadataError !== undefined || fetchFormDataError !== undefined) 
    return yield processError(
      BOOTSTRAP_ERROR, 
      fetchFormMetadataError,
      { arguments: arguments }
    );

  yield initializeRelatedFieldOptions(meta.formId);

  yield put({ type: BOOTSTRAP_SUCCESS });
  return true;
}

export function* initializeRelatedFieldOptions(formId) {
  const m2mFields = yield select(metaDataM2MFieldsSelector, { formId });
  for (const fieldName of map(m2mFields, 'name')) {
    const value = yield select(storedFieldValueSelector, { formId, name: fieldName });
    if (isEmpty(value))
      continue;
    
    yield put(storeFieldOptions({ formId, searchText: '', fieldName, value }));
  }
}

export function* fetchNextFieldOptions({ payload, meta }) {
  const keyPrefix = `Form:${meta.formId}:field:${meta.fieldName}:q:${payload.searchText}`;
  const formogen = yield select(formogenSelector);

  const nextPageNumber = formogen[`${keyPrefix}:nextPageNumber`];
  const currentPageNumber = formogen[`${keyPrefix}:currentPageNumber`];

  let requestPageNumber = meta.page * 1 || nextPageNumber * 1 || (currentPageNumber * 1 + 1) || 1;
  if (nextPageNumber === null || !requestPageNumber || isNaN(requestPageNumber)) {
    // even if we have nothing to do, we must change current searchText
    yield put(changeFieldSearchText({ 
      formId: meta.formId, 
      fieldName: meta.fieldName,
      searchText: payload.searchText,
    }));
    payload.callback();
    return;
  }

  yield api.searchDataFieldOptions({
    payload: { 
      searchText: payload.searchText, 
      url: payload.url, 
      page: requestPageNumber,
    },
    meta: { 
      formId: meta.formId, 
      fieldName: meta.fieldName, 
      searchText: payload.searchText,
    }
  });

  payload.callback();
}


export function* submit({ meta }) {
  const [ formData, formFiles ] = [
    yield select(finalFormDataSelector, { formId: meta.formId }),
    yield select(dirtyFormFilesSelector, { formId: meta.formId }),
  ];
  console.log('qwe`', formData, formFiles);

}


export function* formogenSagas() {
  yield all([
    takeEvery(BOOTSTRAP, bootstrap),
    takeEvery(FETCH_NEXT_FIELD_OPTIONS, fetchNextFieldOptions),
    takeEvery(SUBMIT, submit),
  ]);
}
