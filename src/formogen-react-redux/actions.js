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

export const formogenComponentDidMount = namespace => ({
    type: FORMOGEN_COMPONENT_DID_MOUNT,
    meta: { namespace }
});

export const formogenComponentWillUnmount = namespace => ({
    type: FORMOGEN_COMPONENT_WILL_UNMOUNT,
    meta: { namespace }
});


// =============== METADATA ===============

export const METADATA_REQUEST_START = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${START}`;
export const METADATA_REQUEST_FAIL = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${FAIL}`;
export const METADATA_REQUEST_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${SUCCESS}`;

export const requestMetaData = (url, namespace) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [
            { type: METADATA_REQUEST_START, meta: { namespace } },
            { type: METADATA_REQUEST_SUCCESS, meta: { namespace } },
            { type: METADATA_REQUEST_FAIL, meta: { namespace } },
        ],
        ...getApiMiddlewareOptions(),
    }
});


// =============== FORMDATA ===============

export const FORMDATA_REQUEST_START = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${START}`;
export const FORMDATA_REQUEST_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${FAIL}`;
export const FORMDATA_REQUEST_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${SUCCESS}`;

export const requestFormData = (url, namespace) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [
            { type: FORMDATA_REQUEST_START, meta: { namespace } },
            { type: FORMDATA_REQUEST_SUCCESS, meta: { namespace } },
            { type: FORMDATA_REQUEST_FAIL, meta: { namespace } },
        ],
        ...getApiMiddlewareOptions(),
    }
});


// =============== FORM SUBMITTING ===============

// FORM SUBMIT
export const FORM_SUBMIT_INIT = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT:INIT`;
export const FORM_SUBMIT_COMPLETE = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT:COMPLETE`;

export const formSubmitInit = namespace => ({
    type: FORM_SUBMIT_INIT,
    meta: { namespace }
});

export const formSubmitComplete = (data, namespace) => ({
    type: FORM_SUBMIT_COMPLETE,
    payload: data,
    meta: { namespace }
});

export function submitForm({
    namespace,
    submitUrl, submitMethod = 'POST',
    formData, formFiles,
    sendFileQueueLength = 1, skipFetchingObject = false,
    middlewares
}) {
    return dispatch => {
        dispatch(formSubmitInit(namespace));

        return dispatch(sendFormData(submitUrl, submitMethod, middlewares.initial(formData), namespace))
            .then(({ payload }) => middlewares.sendFormData(payload))
            .then(data => {
                if (skipFetchingObject)
                    return Promise.resolve({ payload: data });

                const formDataUrl = (data && data.urls && data.urls.update) || submitUrl;
                return dispatch(requestFormData(formDataUrl, namespace));
            })
            .then(({ payload }) => middlewares.requestFormData(payload))
            .then(data => {
                const formFilesUrls = { ...data.urls };
                return dispatch(processFormFiles(formFiles, formFilesUrls, sendFileQueueLength, namespace));
            })
            .then(data => dispatch(formSubmitComplete(data, namespace)))
            .catch(error => {
                if (error.name !== 'FormogenError' || +error.status !== 400)
                    return dispatch(otherNetworkError(middlewares.otherNetworkError(error), namespace));

                return dispatch(formDataSendFail(middlewares.formDataSendFail(error), namespace));
            });
    };
}

// FORMDATA SEND
export const FORMDATA_SEND_START = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${START}`;
export const FORMDATA_SEND_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${FAIL}`;
export const FORMDATA_SEND_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${SUCCESS}`;
export const FORMDATA_SEND_SKIP = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:SKIP`;
export const FORMDATA_SEND_OTHER_NETWORK_ERROR = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:OTHER_NETWORK_ERROR`;

export const formDataSendStart = (data, namespace) => ({
    type: FORMDATA_SEND_START,
    payload: data,
    meta: { namespace }
});

export const formDataSendFail = (error, namespace) => ({
    type: FORMDATA_SEND_FAIL,
    payload: error,
    error: true,
    meta: { namespace }
});

export const formDataSendSuccess = (status = 'success', namespace) => ({
    type: FORMDATA_SEND_SUCCESS,
    payload: status,
    meta: { namespace }
});

export const formDataSendSkip = namespace => ({
    type: FORMDATA_SEND_SKIP,
    meta: { namespace }
});

export const otherNetworkError = (error, namespace) => ({
    type: FORMDATA_SEND_OTHER_NETWORK_ERROR,
    payload: error,
    meta: { namespace }
});

export const sendFormData = (url, method = 'POST', formData, namespace) => {
    return dispatch => {
        if (_.isEmpty(formData))
            return dispatch(formDataSendSkip(namespace));

        dispatch(formDataSendStart(formData, namespace));

        return fetch(url, { ...getFetchOptions({ method }), body: JSON.stringify(formData) })
            .then(resolveResponse)
            .then(data => dispatch(formDataSendSuccess(data, namespace)));
    };
};

// FORMFILES PROCESS
export const FORMFILES_PROCESS_START = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_PROCESS:${START}`;
export const FORMFILES_PROCESS_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_PROCESS:${SUCCESS}`;
export const FORMFILES_PROCESS_SKIP = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_PROCESS:SKIP`;

export const formFilesProcessStart = namespace => ({
    type: FORMFILES_PROCESS_START,
    meta: { namespace }
});

export const formFilesProcessSuccess = (data, namespace) => ({
    type: FORMFILES_PROCESS_SUCCESS,
    payload: data,
    meta: { namespace }
});

export const formFilesProcessSkip = namespace => ({
    type: FORMFILES_PROCESS_SKIP,
    meta: { namespace }
});

export const processFormFiles = (formFiles, urls, sendFileQueueLength = 1, namespace) => {
    return dispatch => {
        if (_.isEmpty(formFiles))
            return dispatch(formFilesProcessSkip(namespace));

        dispatch(formFilesProcessStart(namespace));

        return handleFormFilesProcess(formFiles, urls, dispatch, sendFileQueueLength, namespace)
            .then(data => dispatch(formFilesProcessSuccess(data, namespace)));
    };
};

// SINGLE FILE UPLOAD
export const SINGLE_FILE_UPLOAD_START = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${START}`;
export const SINGLE_FILE_UPLOAD_FAIL = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${FAIL}`;
export const SINGLE_FILE_UPLOAD_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${SUCCESS}`;

export const singleFileUploadStart = (fieldName, url, data, fileName, namespace) => ({
    type: SINGLE_FILE_UPLOAD_START,
    payload: { fieldName, url, data, fileName },
    meta: { namespace }
});

export const singleFileUploadFail = (fieldName, url, error, fileName, namespace) => ({
    type: SINGLE_FILE_UPLOAD_FAIL,
    payload: { fieldName, url, error, fileName },
    meta: { namespace }
});

export const singleFileUploadSuccess = (fieldName, url, data, fileName, namespace) => ({
    type: SINGLE_FILE_UPLOAD_SUCCESS,
    payload: { fieldName, url, data, fileName },
    meta: { namespace }
});

export const uploadSingleFile = (fieldName, uploadUrl, formData, fileName, dispatch, namespace) => {
    dispatch(singleFileUploadStart(fieldName, uploadUrl, formData, fileName));

    const options = { ...getFetchOptions({ method: 'POST', headers: {} }), body: formData };
    return fetch(uploadUrl, options)
        .then(resolveResponse)
        .then(data => dispatch(singleFileUploadSuccess(fieldName, uploadUrl, data, fileName, namespace)))
        .catch(error => dispatch(singleFileUploadFail(fieldName, uploadUrl, error, fileName, namespace)));
};

// SINGLE FILE DELETE
export const SINGLE_FILE_DELETE_START = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_DELETE:${START}`;
export const SINGLE_FILE_DELETE_FAIL = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_DELETE:${FAIL}`;
export const SINGLE_FILE_DELETE_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_DELETE:${SUCCESS}`;

export const singleFileDeleteStart = (fieldName, url, fileName, namespace) => ({
    type: SINGLE_FILE_DELETE_START,
    payload: { fieldName, url, fileName },
    meta: { namespace }
});

export const singleFileDeleteFail = (fieldName, url, data, fileName, namespace) => ({
    type: SINGLE_FILE_DELETE_FAIL,
    payload: { fieldName, url, data, fileName },
    meta: { namespace }
});

export const singleFileDeleteSuccess = (fieldName, url, error, fileName, namespace) => ({
    type: SINGLE_FILE_DELETE_SUCCESS,
    payload: { fieldName, url, error, fileName },
    meta: { namespace }
});

export const deleteSingleFile = (fieldName, deleteUrl, fileName, dispatch, namespace) => {
    dispatch(singleFileDeleteStart(fieldName, deleteUrl, fileName, namespace));

    const options = { ...getFetchOptions({ method: 'POST', headers: {} }) };
    return fetch(deleteUrl, options)
        .then(resolveResponse)
        .then(data => dispatch(singleFileDeleteSuccess(fieldName, deleteUrl, data, fileName, namespace)))
        .catch(error => dispatch(singleFileDeleteFail(fieldName, deleteUrl, error, fileName, namespace)));
};

const evaluateProcessFileChunk = (chunk, dispatch, namespace) => {
    return chunk.map(({ fieldName, url, formData, fileName, action }) => {
        if (action === 'upload')
            return uploadSingleFile(fieldName, url, formData, fileName, dispatch, namespace);
        if (action === 'delete')
            return deleteSingleFile(fieldName, url, fileName, dispatch, namespace);

        throw new Error(`Unknown action type ${action}`);
    });
};

export function handleFormFilesProcess(filesFieldMap, objectUrls, dispatch, queueLength = 1, namespace) {
    const queue = prepareFileProcessQueue(filesFieldMap, objectUrls);
    const chunks = _.chunk(queue, queueLength);

    if (_.isEmpty(queue))
        return Promise.resolve();

    return new Promise(resolve => {
        const beginningPromise = Promise.all(evaluateProcessFileChunk(chunks[0], dispatch, namespace));

        let followingPromise = beginningPromise.then(() => {
            for (let chunk of chunks.slice(1)) {
                followingPromise = followingPromise.then(
                    () => Promise.all(evaluateProcessFileChunk(chunk, dispatch, namespace))
                );
            }
            followingPromise.then(() => resolve(followingPromise));
        });
    });
}


// =============== FORM'S FIELD CHANGE ===============

export const FIELD_CHANGED = `${FORMOGEN_ACTION_PREFIX}:FIELD_CHANGED`;

export const fieldChanged = (event, { name, value }, namespace) => ({
    type: FIELD_CHANGED,
    payload: { event, fieldName: name, fieldValue: value },
    meta: { namespace }
});
