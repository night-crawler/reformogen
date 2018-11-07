import { 
  STORE_FORM_DATA,
  STORE_FORM_METADATA,
  STORE_FIELD_DATA,
} from './constants';

export function prefixObjectFields(formId, obj) {
  const prefixedObj = {};
  for (const [ fieldName, value ] of Object.entries(obj)) {
    prefixedObj[`Form:${formId}:field:${fieldName}`] = value;
  }
  return prefixedObj;
}

export function formogenReducer(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case STORE_FORM_DATA:
      return {
        ...state,
        ...prefixObjectFields(payload.formId, payload.data)
      };

    case STORE_FORM_METADATA:
      return {
        ...state,
        [ `Form:${payload.formId}:metaData` ]: payload.metaData,
      };

    case STORE_FIELD_DATA:
      return {
        ...state,
        [ `Form:${payload.formId}:field:${payload.name}` ]: payload.value,
      };

    default:
      return state;
  }
}
