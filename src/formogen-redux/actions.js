import { 
  BOOTSTRAP,
  STORE_FORM_DATA,
  STORE_FORM_METADATA,
} from './constants';


export const bootstrap = () => ({
  type: BOOTSTRAP,
});


export const storeFormData = (formId, data) => ({
  type: STORE_FORM_DATA,
  payload: {
    formId, data
  }
});


export const storeFormMetaData = (formId, metaData) => ({
  type: STORE_FORM_METADATA,
  payload: {
    formId, metaData
  }
});
