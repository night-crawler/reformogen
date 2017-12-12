import { RSAA } from 'redux-api-middleware';

import { headers, getApiMiddlewareOptions } from './utils';

// BASE PREFIXES
export const REQUEST = '?:REQUEST';
export const FAIL = '!:FAIL';
export const RECEIVE = '+:RECEIVE';

// METADATA
export const REQUEST_METADATA = `${REQUEST}:METADATA`;
export const REQUEST_METADATA_FAIL = `${FAIL}:METADATA`;
export const RECEIVE_METADATA = `${RECEIVE}:METADATA`;


export const fetchMetaData = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [REQUEST_METADATA, RECEIVE_METADATA, REQUEST_METADATA_FAIL],
        ...getApiMiddlewareOptions(),
    }
});

// FORMDATA
export const REQUEST_FORMDATA = `${REQUEST}:FORMDATA`;
export const REQUEST_FORMDATA_FAIL = `${FAIL}:FORMDATA`;
export const RECEIVE_FORMDATA = `${RECEIVE}:FORMDATA`;

export const fetchFormData = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [REQUEST_FORMDATA, RECEIVE_FORMDATA, REQUEST_FORMDATA_FAIL],
        ...getApiMiddlewareOptions(),
    }
});


// SUBMIT
export const REQUEST_SUBMIT = `${REQUEST}:SUBMIT`;
export const REQUEST_SUBMIT_FAIL = `${FAIL}:SUBMIT`;
export const RECEIVE_SUBMIT = `${RECEIVE}:SUBMIT`;

export const submitForm = (url, method = 'POST', formData) => ({
    [RSAA]: {
        endpoint: url,
        body: JSON.stringify(formData),
        method: method,
        types: [REQUEST_SUBMIT, RECEIVE_SUBMIT, REQUEST_SUBMIT_FAIL],
        ...getApiMiddlewareOptions({ headers, method }),
    }
});


// TODO: performance issues?
// FIELD CHANGE
export const FIELD_CHANGED = 'FORMOGEN:FIELD_CHANGED';
export const fieldChanged = (event, { name, value }) => ( {
    type: FIELD_CHANGED,
    payload: { event, fieldName: name, fieldValue: value }
} );
