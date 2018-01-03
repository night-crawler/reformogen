import { RSAA } from 'redux-api-middleware';

import _ from 'lodash';

import { getApiMiddlewareOptions, getFetchOptions, prepareFileProcessQueue, resolveResponse } from './utils';


// BASE PREFIXES
const FORMOGEN_ACTION_PREFIX = 'FORMOGEN';

const START = 'START';
const FAIL = 'FAIL';
const SUCCESS = 'SUCCESS';


// =============== STATE ===============

export const FORMOGEN_COMPONENT_DID_MOUNT = `${FORMOGEN_ACTION_PREFIX}:DID_MOUNT`;
export const FORMOGEN_COMPONENT_WILL_UNMOUNT = `${FORMOGEN_ACTION_PREFIX}:WILL_UNMOUNT`;

export const formogenComponentDidMount = formId => ({
    type: FORMOGEN_COMPONENT_DID_MOUNT,
    meta: { formId }
});

export const formogenComponentWillUnmount = formId => ({
    type: FORMOGEN_COMPONENT_WILL_UNMOUNT,
    meta: { formId }
});


// =============== METADATA ===============

export const METADATA_REQUEST_START = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${START}`;
export const METADATA_REQUEST_FAIL = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${FAIL}`;
export const METADATA_REQUEST_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${SUCCESS}`;

export const requestMetaData = (url, formId) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [
            { type: METADATA_REQUEST_START, meta: { formId } },
            { type: METADATA_REQUEST_SUCCESS, meta: { formId } },
            { type: METADATA_REQUEST_FAIL, meta: { formId } },
        ],
        ...getApiMiddlewareOptions(),
    }
});


// =============== FORMDATA ===============

export const FORMDATA_REQUEST_START = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${START}`;
export const FORMDATA_REQUEST_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${FAIL}`;
export const FORMDATA_REQUEST_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${SUCCESS}`;

export const requestFormData = (url, formId) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [
            { type: FORMDATA_REQUEST_START, meta: { formId } },
            { type: FORMDATA_REQUEST_SUCCESS, meta: { formId } },
            { type: FORMDATA_REQUEST_FAIL, meta: { formId } },
        ],
        ...getApiMiddlewareOptions(),
    }
});


// =============== FORM SUBMITTING ===============

// FORM SUBMIT
export const FORM_SUBMIT_INIT = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT:INIT`;
export const FORM_SUBMIT_COMPLETE = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT:COMPLETE`;

export const formSubmitInit = formId => ({
    type: FORM_SUBMIT_INIT,
    meta: { formId }
});

export const formSubmitComplete = (data, formId) => ({
    type: FORM_SUBMIT_COMPLETE,
    payload: data,
    meta: { formId }
});

export function submitForm({
    formId,
    submitUrl, submitMethod = 'POST',
    formData, formFiles,
    sendFileQueueLength = 1, skipFetchingObject = false,
    middlewares
}) {
    return dispatch => {
        dispatch(formSubmitInit(formId));

        return dispatch(sendFormData(submitUrl, submitMethod, middlewares.initial(formData), formId))
            .then(({ payload }) => middlewares.sendFormData(payload))
            .then(data => {
                if (skipFetchingObject)
                    return Promise.resolve({ payload: data });

                const formDataUrl = (data && data.urls && data.urls.update) || submitUrl;
                return dispatch(requestFormData(formDataUrl, formId));
            })
            .then(({ payload }) => middlewares.requestFormData(payload))
            .then(data => {
                const formFilesUrls = { ...data.urls };
                return dispatch(processFormFiles(formFiles, formFilesUrls, sendFileQueueLength, formId));
            })
            .then(data => dispatch(formSubmitComplete(data, formId)))
            .catch(error => {
                if (error.name !== 'FormogenError' || +error.status !== 400)
                    return dispatch(otherNetworkError(middlewares.otherNetworkError(error), formId));

                return dispatch(formDataSendFail(middlewares.formDataSendFail(error), formId));
            });
    };
}

// FORMDATA SEND
export const FORMDATA_SEND_START = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${START}`;
export const FORMDATA_SEND_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${FAIL}`;
export const FORMDATA_SEND_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${SUCCESS}`;
export const FORMDATA_SEND_SKIP = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:SKIP`;
export const FORMDATA_SEND_OTHER_NETWORK_ERROR = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:OTHER_NETWORK_ERROR`;

export const formDataSendStart = (data, formId) => ({
    type: FORMDATA_SEND_START,
    payload: data,
    meta: { formId }
});

export const formDataSendFail = (error, formId) => ({
    type: FORMDATA_SEND_FAIL,
    payload: error,
    error: true,
    meta: { formId }
});

export const formDataSendSuccess = (status = 'success', formId) => ({
    type: FORMDATA_SEND_SUCCESS,
    payload: status,
    meta: { formId }
});

export const formDataSendSkip = formId => ({
    type: FORMDATA_SEND_SKIP,
    meta: { formId }
});

export const otherNetworkError = (error, formId) => ({
    type: FORMDATA_SEND_OTHER_NETWORK_ERROR,
    payload: error,
    meta: { formId }
});

export const sendFormData = (url, method = 'POST', formData, formId) => {
    return dispatch => {
        if (_.isEmpty(formData))
            return dispatch(formDataSendSkip(formId));

        dispatch(formDataSendStart(formData, formId));

        return fetch(url, { ...getFetchOptions({ method }), body: JSON.stringify(formData) })
            .then(resolveResponse)
            .then(data => dispatch(formDataSendSuccess(data, formId)));
    };
};

// FORMFILES PROCESS
export const FORMFILES_PROCESS_START = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_PROCESS:${START}`;
export const FORMFILES_PROCESS_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_PROCESS:${SUCCESS}`;
export const FORMFILES_PROCESS_SKIP = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_PROCESS:SKIP`;

export const formFilesProcessStart = formId => ({
    type: FORMFILES_PROCESS_START,
    meta: { formId }
});

export const formFilesProcessSuccess = (data, formId) => ({
    type: FORMFILES_PROCESS_SUCCESS,
    payload: data,
    meta: { formId }
});

export const formFilesProcessSkip = formId => ({
    type: FORMFILES_PROCESS_SKIP,
    meta: { formId }
});

export const processFormFiles = (formFiles, urls, sendFileQueueLength = 1, formId) => {
    return dispatch => {
        if (_.isEmpty(formFiles))
            return dispatch(formFilesProcessSkip(formId));

        dispatch(formFilesProcessStart(formId));

        return handleFormFilesProcess(formFiles, urls, dispatch, sendFileQueueLength, formId)
            .then(data => dispatch(formFilesProcessSuccess(data, formId)));
    };
};

// SINGLE FILE UPLOAD
export const SINGLE_FILE_UPLOAD_START = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${START}`;
export const SINGLE_FILE_UPLOAD_FAIL = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${FAIL}`;
export const SINGLE_FILE_UPLOAD_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${SUCCESS}`;

export const singleFileUploadStart = (fieldName, url, data, fileName, formId) => ({
    type: SINGLE_FILE_UPLOAD_START,
    payload: { fieldName, url, data, fileName },
    meta: { formId }
});

export const singleFileUploadFail = (fieldName, url, error, fileName, formId) => ({
    type: SINGLE_FILE_UPLOAD_FAIL,
    payload: { fieldName, url, error, fileName },
    meta: { formId }
});

export const singleFileUploadSuccess = (fieldName, url, data, fileName, formId) => ({
    type: SINGLE_FILE_UPLOAD_SUCCESS,
    payload: { fieldName, url, data, fileName },
    meta: { formId }
});

export const uploadSingleFile = (fieldName, uploadUrl, formData, fileName, dispatch, formId) => {
    dispatch(singleFileUploadStart(fieldName, uploadUrl, formData, fileName));

    const options = { ...getFetchOptions({ method: 'POST', headers: {} }), body: formData };
    return fetch(uploadUrl, options)
        .then(resolveResponse)
        .then(data => dispatch(singleFileUploadSuccess(fieldName, uploadUrl, data, fileName, formId)))
        .catch(error => dispatch(singleFileUploadFail(fieldName, uploadUrl, error, fileName, formId)));
};

// SINGLE FILE DELETE
export const SINGLE_FILE_DELETE_START = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_DELETE:${START}`;
export const SINGLE_FILE_DELETE_FAIL = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_DELETE:${FAIL}`;
export const SINGLE_FILE_DELETE_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_DELETE:${SUCCESS}`;

export const singleFileDeleteStart = (fieldName, url, fileName, formId) => ({
    type: SINGLE_FILE_DELETE_START,
    payload: { fieldName, url, fileName },
    meta: { formId }
});

export const singleFileDeleteFail = (fieldName, url, data, fileName, formId) => ({
    type: SINGLE_FILE_DELETE_FAIL,
    payload: { fieldName, url, data, fileName },
    meta: { formId }
});

export const singleFileDeleteSuccess = (fieldName, url, error, fileName, formId) => ({
    type: SINGLE_FILE_DELETE_SUCCESS,
    payload: { fieldName, url, error, fileName },
    meta: { formId }
});

export const deleteSingleFile = (fieldName, deleteUrl, fileName, dispatch, formId) => {
    dispatch(singleFileDeleteStart(fieldName, deleteUrl, fileName, formId));

    const options = { ...getFetchOptions({ method: 'POST', headers: {} }) };
    return fetch(deleteUrl, options)
        .then(resolveResponse)
        .then(data => dispatch(singleFileDeleteSuccess(fieldName, deleteUrl, data, fileName, formId)))
        .catch(error => dispatch(singleFileDeleteFail(fieldName, deleteUrl, error, fileName, formId)));
};

const evaluateProcessFileChunk = (chunk, dispatch, formId) => {
    return chunk.map(({ fieldName, url, formData, fileName, action }) => {
        if (action === 'upload')
            return uploadSingleFile(fieldName, url, formData, fileName, dispatch, formId);
        if (action === 'delete')
            return deleteSingleFile(fieldName, url, fileName, dispatch, formId);

        throw new Error(`Unknown action type ${action}`);
    });
};

export function handleFormFilesProcess(filesFieldMap, objectUrls, dispatch, queueLength = 1, formId) {
    const queue = prepareFileProcessQueue(filesFieldMap, objectUrls);
    const chunks = _.chunk(queue, queueLength);

    if (_.isEmpty(queue))
        return Promise.resolve();

    return new Promise(resolve => {
        const beginningPromise = Promise.all(evaluateProcessFileChunk(chunks[0], dispatch, formId));

        let followingPromise = beginningPromise.then(() => {
            for (let chunk of chunks.slice(1)) {
                followingPromise = followingPromise.then(
                    () => Promise.all(evaluateProcessFileChunk(chunk, dispatch, formId))
                );
            }
            followingPromise.then(() => resolve(followingPromise));
        });
    });
}


// =============== FORM'S FIELD CHANGE ===============

export const FIELD_CHANGED = `${FORMOGEN_ACTION_PREFIX}:FIELD_CHANGED`;

export const fieldChanged = (event, { name, value }, formId) => ({
    type: FIELD_CHANGED,
    payload: { event, fieldName: name, fieldValue: value },
    meta: { formId }
});
