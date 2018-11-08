import { 
  BOOTSTRAP,
  STORE_FORM_DATA,
  STORE_FORM_METADATA,
  STORE_FIELD_DATA,
  AGENT_EXECUTE_REQUEST_ATTEMPT_FAILED,
} from './constants';


export const bootstrap = payload => ({
  type: BOOTSTRAP,
  payload,
});


export const storeFormData = (formId, data) => ({
  type: STORE_FORM_DATA,
  payload: data,
  meta: { formId },
});


export const storeFormMetaData = (formId, metaData) => ({
  type: STORE_FORM_METADATA,
  payload: metaData,
  meta: { formId },
});


export const storeFieldData = (formId, name, value) => ({
  type: STORE_FIELD_DATA,
  payload: { name, value },
  meta: { formId },
});


export const failedAgentRequestAttempt = payload => ({ 
  type: AGENT_EXECUTE_REQUEST_ATTEMPT_FAILED, 
  payload 
});
