import { 
  BOOTSTRAP,
  STORE_FORM_DATA,
  STORE_FORM_METADATA,
  STORE_FIELD_DATA,
  AGENT_EXECUTE_REQUEST_ATTEMPT_FAILED,
  FETCH_NEXT_FIELD_OPTIONS
} from './constants';


export const bootstrap = ({ formId, ...payload }) => ({
  type: BOOTSTRAP,
  payload,
  meta: { formId }
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


export const storeFieldData = (formId, fieldName, value) => ({
  type: STORE_FIELD_DATA,
  payload: value,
  meta: { formId, fieldName },
});


export const failedAgentRequestAttempt = payload => ({ 
  type: AGENT_EXECUTE_REQUEST_ATTEMPT_FAILED, 
  payload 
});


export const fetchNextFieldOptions = ({ formId, fieldName, ...payload }) => ({
  type: FETCH_NEXT_FIELD_OPTIONS, 
  payload,
  meta: { formId, fieldName }
});
