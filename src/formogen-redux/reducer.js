import { 
  STORE_FORM_DATA, STORE_FORM_METADATA, STORE_FIELD_DATA,
  FETCH_FORM_METADATA_SUCCESS,
} from './constants';

export function prefixObjectFields(formId, obj) {
  const prefixedObj = {};
  for (const [ fieldName, value ] of Object.entries(obj)) {
    prefixedObj[`Form:${formId}:field:${fieldName}`] = value;
  }
  return prefixedObj;
}

export function formogenReducer(state = {}, action) {
  const { type, payload, meta: { formId }={} } = action;

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

    default:
      return state;
  }
}
