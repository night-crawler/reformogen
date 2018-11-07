/*
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = '@yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const RETRY_TIMEOUT = process.env.REACT_APP__RETRY_TIMEOUT || 500;
export const RETRY_COUNT = process.env.REACT_APP__RETRY_COUNT || 5;

export const PROJECT_NAME = 'formogen';

const PREFIX = `@${PROJECT_NAME}`;

export const BOOTSTRAP = `${PREFIX}/BOOTSTRAP`;

export const STORE_FORM_DATA = `${PREFIX}/STORE_FORM_DATA`;
export const STORE_FORM_METADATA = `${PREFIX}/STORE_FORM_METADATA`;

export const STORE_FIELD_DATA = `${PREFIX}/STORE_FIELD_DATA`;


export const FETCH_FORM_METADATA = `${PREFIX}/FETCH_FORM_METADATA`;
export const FETCH_FORM_METADATA_SUCCESS = `${PREFIX}/FETCH_FORM_METADATA_SUCCESS`;
export const FETCH_FORM_METADATA_ERROR = `${PREFIX}/FETCH_FORM_METADATA_ERROR`;
