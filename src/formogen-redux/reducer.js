import { 
  STORE_FORM_DATA,
  STORE_FORM_METADATA,
} from './constants';

export function formogenReducer(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case STORE_FORM_DATA:
      return {
        ...state,
        [`formData:${payload.formId}`]: payload.formData,
      };

    case STORE_FORM_METADATA:
      return {
        ...state,
        [`formMetaData:${payload.formId}`]: payload.formMetaData,
      };

    default:
      return state;
  }
}
