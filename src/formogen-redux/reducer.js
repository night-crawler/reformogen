import { 
  STORE_FORM_DATA, STORE_FORM_METADATA, STORE_FIELD_DATA,
  FETCH_FORM_METADATA_SUCCESS,

  FETCH_FIELD_OPTIONS_SUCCESS,
} from './constants';

export function prefixObjectFields(formId, obj) {
  const prefixedObj = {};
  for (const [ fieldName, value ] of Object.entries(obj)) {
    prefixedObj[`Form:${formId}:field:${fieldName}`] = value;
  }
  return prefixedObj;
}

export function formogenReducer(state = {}, action) {
  const { type, payload, meta: { formId, fieldName, ...restMeta }={} } = action;

  switch (type) {
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
        [ `Form:${formId}:field:${payload.name}` ]: payload.value,
      };

    case FETCH_FORM_METADATA_SUCCESS:
      return {
        ...state,
        [ `Form:${formId}:metaData` ]: payload,
      };

    case FETCH_FIELD_OPTIONS_SUCCESS:
      return {
        ...state,
        [ `Form:${formId}:field:${fieldName}:options` ]: [
          ...(state[ `Form:${formId}:field:${fieldName}:options` ] || []),
          ...payload.results
        ],
        [ `Form:${formId}:field:${fieldName}:lastPage` ]: restMeta.page + 1,
      };

    default:
      return state;
  }
}
