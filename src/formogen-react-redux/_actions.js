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


/*
FORM_SUBMIT_INIT

    FORM_DATA_SEND_START
        FORMDATA_SEND_FAIL
    FORM_DATA_SEND_SUCCESS

        FORM_FILES_UPLOAD_START

            CHUNK_UPLOAD_START

                SINGLE_FILE_UPLOAD_START
                    SINGLE_FILE_UPLOAD_FAIL
                SINGLE_FILE_UPLOAD_SUCCESS

                CHUNK_UPLOAD_FAIL

            CHUNK_UPLOAD_SUCCESS

            ...

        FORM_FILES_UPLOAD_SUCCESS

FORM_SUBMIT_COMPLETE
 */


export const FORM_SUBMIT_INIT = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT_INIT`;
export const FORM_SUBMIT_COMPLETE = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT_COMPLETE`;
export const formSubmitInit = () => ({
    type: FORM_SUBMIT_INIT,
});
export const formSubmitComplete = (status='success') => ({
    type: FORM_SUBMIT_COMPLETE,
    payload: status,
});


export const FORM_DATA_SEND_START = `${FORMOGEN_ACTION_PREFIX}:FORM_DATA_SEND_START`;
export const FORM_DATA_SEND_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORM_DATA_SEND_FAIL`;
export const FORM_DATA_SEND_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORM_DATA_SEND_SUCCESS`;
export const formDataSend = (url, method = 'POST', formData) => ({
    [RSAA]: {
        endpoint: url,
        body: JSON.stringify(formData),
        method: method,
        types: [FORM_DATA_SEND_START, FORM_DATA_SEND_SUCCESS, FORM_DATA_SEND_FAIL],
        ...getApiMiddlewareOptions({ headers, method }),
    }
});


export const CHUNK_UPLOAD_START = `${FORMOGEN_ACTION_PREFIX}:CHUNK_UPLOAD_START`;
export const CHUNK_UPLOAD_FAIL = `${FORMOGEN_ACTION_PREFIX}:CHUNK_UPLOAD_FAIL`;
export const CHUNK_UPLOAD_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:CHUNK_UPLOAD_SUCCESS`;
export const chunkUploadStart = () => ({
    type: CHUNK_UPLOAD_START,
});
export const chunkUploadFail = () => ({
    type: CHUNK_UPLOAD_FAIL,
});
export const chunkUploadSuccess = (data) => ({
    type: CHUNK_UPLOAD_SUCCESS,
    payload: { ...data }
});

export const SINGLE_FILE_UPLOAD_START = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD_START`;
export const SINGLE_FILE_UPLOAD_FAIL = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD_FAIL`;
export const SINGLE_FILE_UPLOAD_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD_SUCCESS`;
export const singleFileUploadStart = () => ({
    type: SINGLE_FILE_UPLOAD_START,
});
export const singleFileUploadFail = () => ({
    type: SINGLE_FILE_UPLOAD_FAIL,
});
export const singleFileUploadSuccess = (data) => ({
    type: SINGLE_FILE_UPLOAD_SUCCESS,
    payload: { ...data }
});



export const FORM_FILES_UPLOAD_START = `${FORMOGEN_ACTION_PREFIX}:FORM_FILES_UPLOAD_START`;
export const FORM_FILES_UPLOAD_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORM_FILES_UPLOAD_SUCCESS`;
export const formFilesUploadStart = () => ({
    type: FORM_FILES_UPLOAD_START,
});
export const formFilesUploadSuccess = () => ({
    type: FORM_FILES_UPLOAD_SUCCESS,
});
export const formFilesUpload = (filesFieldMap, objectUrls) => {
    return dispatch => {
        dispatch(formFilesUploadStart);



        // prepare chunk dis


        handleSendFiles(filesFieldMap, objectUrls)
            .then(data => dispatch(formFilesUploadSuccess(data)));
    };
};


