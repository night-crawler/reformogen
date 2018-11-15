import { 
  STORE_FORM_DATA, STORE_FORM_METADATA, STORE_FIELD_DATA, STORE_FIELD_OPTIONS,
  FETCH_FORM_METADATA_SUCCESS,
  FETCH_FORM_DATA_SUCCESS,

  FETCH_NEXT_FIELD_OPTIONS_SUCCESS, STORE_FIELD_SEARCH_TEXT,
} from './constants';

export function prefixObjectFields(formId, obj) {
  const prefixedObj = {};
  for (const [ fieldName, value ] of Object.entries(obj)) {
    prefixedObj[`Form:${formId}:field:${fieldName}:stored`] = value;
  }
  return prefixedObj;
}

export function mergeOptions(prevOptions=[], nextOptions=[]) {
  const options = [ ...prevOptions ];
  nextOptions.forEach(nextOpt => 
    !options.find(existing => existing.id === nextOpt.id)?.id &&
    options.push(nextOpt)
  );
  return options;
}

export function formogenReducer(state = {}, action) {
  const { type, payload, meta: { formId, fieldName, searchText }={} } = action;

  const relatedFieldSearchKeyPrefix = `Form:${formId}:field:${fieldName}:q:${searchText}`;

  switch (type) {
    case FETCH_FORM_DATA_SUCCESS:
      return {
        ...state,
        ...prefixObjectFields(formId, payload)
      };

    case STORE_FORM_DATA:
      return {
        ...state,
        ...prefixObjectFields(formId, payload)
      };

    case STORE_FORM_METADATA:
      return {
        ...state,
        [ `Form:${formId}:metaData` ]: payload,
      };

    case STORE_FIELD_DATA:
      return {
        ...state,
        [ `Form:${formId}:field:${fieldName}:dirty` ]: payload,
      };

    case FETCH_FORM_METADATA_SUCCESS:
      return {
        ...state,
        [ `Form:${formId}:metaData` ]: payload,
      };

    case STORE_FIELD_OPTIONS:
      return {
        ...state,
        [ `${relatedFieldSearchKeyPrefix}:options` ]: payload,
      };

    case STORE_FIELD_SEARCH_TEXT:
      return {
        ...state,
        [ `Form:${formId}:field:${fieldName}:q` ]: searchText,
      };
    
    case FETCH_NEXT_FIELD_OPTIONS_SUCCESS:
      return {
        ...state,
        [ `${relatedFieldSearchKeyPrefix}:options` ]: mergeOptions(
          state[ `${relatedFieldSearchKeyPrefix}:options` ],
          payload.list
        ),
        [ `${relatedFieldSearchKeyPrefix}:nextPageNumber` ]: payload.nextPageNumber,
        [ `${relatedFieldSearchKeyPrefix}:currentPageNumber` ]: payload.currentPageNumber,
        [ `Form:${formId}:field:${fieldName}:q` ]: searchText,
      };

    default:
      return state;
  }
}
