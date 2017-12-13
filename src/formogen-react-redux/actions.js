import { RSAA } from 'redux-api-middleware';

import { headers, getApiMiddlewareOptions, handleSendFiles } from './utils';

// BASE PREFIXES
export const FORMOGEN_ACTION_PREFIX = 'FORMOGEN';

export const REQUEST = '?:REQUEST';
export const FAIL = '!:FAIL';
export const RECEIVE = '+:RECEIVE';

// METADATA
export const REQUEST_METADATA = `${FORMOGEN_ACTION_PREFIX}:${REQUEST}:METADATA`;
export const REQUEST_METADATA_FAIL = `${FORMOGEN_ACTION_PREFIX}:${FAIL}:METADATA`;
export const RECEIVE_METADATA = `${FORMOGEN_ACTION_PREFIX}:${RECEIVE}:METADATA`;

export const fetchMetaData = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [REQUEST_METADATA, RECEIVE_METADATA, REQUEST_METADATA_FAIL],
        ...getApiMiddlewareOptions(),
    }
});

// FORMDATA
export const REQUEST_FORMDATA = `${FORMOGEN_ACTION_PREFIX}:${REQUEST}:FORMDATA`;
export const REQUEST_FORMDATA_FAIL = `${FORMOGEN_ACTION_PREFIX}:${FAIL}:FORMDATA`;
export const RECEIVE_FORMDATA = `${FORMOGEN_ACTION_PREFIX}:${RECEIVE}:FORMDATA`;

export const fetchFormData = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [REQUEST_FORMDATA, RECEIVE_FORMDATA, REQUEST_FORMDATA_FAIL],
        ...getApiMiddlewareOptions(),
    }
});


// FORM'S FIELD CHANGE
export const FIELD_CHANGED = `${FORMOGEN_ACTION_PREFIX}:FIELD_CHANGED`;
export const fieldChanged = (event, { name, value }) => ( {
    type: FIELD_CHANGED,
    payload: { event, fieldName: name, fieldValue: value }
} );



// SUBMIT
export const REQUEST_SUBMIT = `${FORMOGEN_ACTION_PREFIX}:${REQUEST}:SUBMIT`;
export const REQUEST_SUBMIT_FAIL = `${FORMOGEN_ACTION_PREFIX}:${FAIL}:SUBMIT`;
export const RECEIVE_SUBMIT = `${FORMOGEN_ACTION_PREFIX}:${RECEIVE}:SUBMIT`;

export const submitForm = (url, method = 'POST', formData) => ({
    [RSAA]: {
        endpoint: url,
        body: JSON.stringify(formData),
        method: method,
        types: [REQUEST_SUBMIT, RECEIVE_SUBMIT, REQUEST_SUBMIT_FAIL],
        ...getApiMiddlewareOptions({ headers, method }),
    }
});


// FILES PROCESSING
export const FILE_UPLOADING_START = `${FORMOGEN_ACTION_PREFIX}:FILE_UPLOADING_START`;
export const FILE_UPLOADING_END = `${FORMOGEN_ACTION_PREFIX}:FILE_UPLOADING_END`;
export const FILE_UPLOADING_FAIL = `${FORMOGEN_ACTION_PREFIX}:FILE_UPLOADING_FAIL`;

export const initiateFileUploading = () => ({
    type: FILE_UPLOADING_START
});

export const receiveFileUploading = (data) => ({
    type: FILE_UPLOADING_END,
    payload: { ...data }
});

export const failFileUploading = (error) => ({
    type: FILE_UPLOADING_FAIL,
    payload: { ...error }
});

export const sendFiles = (filesFieldMap, objectUrls) => {
    return dispatch => {
        dispatch(initiateFileUploading());

        return handleSendFiles(filesFieldMap, objectUrls)
            .then(
                data => dispatch(receiveFileUploading(data)),
                error => dispatch(failFileUploading(error))
            );
    };
};
