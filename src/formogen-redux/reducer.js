import { 
  STORE_FORM_DATA, STORE_FORM_METADATA, STORE_FIELD_DATA,
  FETCH_FORM_METADATA_SUCCESS,
  FETCH_FORM_DATA_SUCCESS,

  FETCH_NEXT_FIELD_OPTIONS_SUCCESS,
} from './constants';

export function prefixObjectFields(formId, obj) {
  const prefixedObj = {};
  for (const [ fieldName, value ] of Object.entries(obj)) {
    prefixedObj[`Form:${formId}:field:${fieldName}:stored`] = value;
  }
  return prefixedObj;
}

export function formogenReducer(state = {}, action) {
  const { type, payload, meta: { formId, fieldName, ...restMeta }={} } = action;

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

    case FETCH_NEXT_FIELD_OPTIONS_SUCCESS:
      return {
        ...state,
        [ `Form:${formId}:field:${fieldName}:options` ]: [
          ...(state[ `Form:${formId}:field:${fieldName}:options` ] || []),
          ...payload.list
        ],
        [ `Form:${formId}:field:${fieldName}:nextPageNumber` ]: payload.nextPageNumber,
        [ `Form:${formId}:field:${fieldName}:currentPageNumber` ]: payload.currentPageNumber,
      };

    default:
      return state;
  }
}
