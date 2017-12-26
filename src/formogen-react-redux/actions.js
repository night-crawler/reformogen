import { RSAA } from 'redux-api-middleware';

import _ from 'lodash';

import { getApiMiddlewareOptions, getFetchOptions, prepareFileUploadQueue, resolveResponse } from './utils';


// BASE PREFIXES
const FORMOGEN_ACTION_PREFIX = 'FORMOGEN';

const START = 'START';
const FAIL = 'FAIL';
const SUCCESS = 'SUCCESS';


// =============== STATE ===============

export const FORMOGEN_COMPONENT_DID_MOUNT = `${FORMOGEN_ACTION_PREFIX}:DID_MOUNT`;
export const FORMOGEN_COMPONENT_WILL_UNMOUNT = `${FORMOGEN_ACTION_PREFIX}:WILL_UNMOUNT`;

export const formogenComponentDidMount = name => ({
    // what's about `FORMOGEN:DID_MOUNT:${name}` or sth like this? Client could able to reduce this type of action
    type: FORMOGEN_COMPONENT_DID_MOUNT,
    payload: { name }
});

export const formogenComponentWillUnmount = name => ({
    type: FORMOGEN_COMPONENT_WILL_UNMOUNT,
    payload: { name }
});


// =============== METADATA ===============

export const METADATA_REQUEST_START = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${START}`;
export const METADATA_REQUEST_FAIL = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${FAIL}`;
export const METADATA_REQUEST_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:METADATA_REQUEST:${SUCCESS}`;

export const requestMetaData = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [METADATA_REQUEST_START, METADATA_REQUEST_SUCCESS, METADATA_REQUEST_FAIL],
        ...getApiMiddlewareOptions(),
    }
});


// =============== FORMDATA ===============

export const FORMDATA_REQUEST_START = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${START}`;
export const FORMDATA_REQUEST_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${FAIL}`;
export const FORMDATA_REQUEST_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_REQUEST:${SUCCESS}`;

export const requestFormData = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [FORMDATA_REQUEST_START, FORMDATA_REQUEST_SUCCESS, FORMDATA_REQUEST_FAIL],
        ...getApiMiddlewareOptions(),
    }
});


// =============== FORM SUBMITTING ===============

// FORM SUBMIT
export const FORM_SUBMIT_INIT = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT:INIT`;
export const FORM_SUBMIT_COMPLETE = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT:COMPLETE`;

export const formSubmitInit = () => ({
    type: FORM_SUBMIT_INIT,
});

export const formSubmitComplete = (data) => ({
    type: FORM_SUBMIT_COMPLETE,
    payload: data,
});

export function submitForm({
    submitUrl, submitMethod = 'POST',
    formData, formFiles,
    sendFileQueueLength = 1, skipFetchingObject = false,
    middlewares
}) {
    return dispatch => {
        dispatch(formSubmitInit());

        return dispatch(sendFormData(submitUrl, submitMethod, middlewares.initial(formData)))
            .then(({ payload }) => middlewares.sendFormData(payload))
            .then(data => {
                if (skipFetchingObject)
                    return Promise.resolve({ payload: data });

                const formDataUrl = (data && data.urls && data.urls.update) || submitUrl;
                return dispatch(requestFormData(formDataUrl));
            })
            .then(({ payload }) => middlewares.requestFormData(payload))
            .then(data => {
                const formFilesUrls = { ...data.urls };
                return dispatch(uploadFormFiles(formFiles, formFilesUrls, sendFileQueueLength));
            })
            .then(data => dispatch(formSubmitComplete(data)))
            .catch(error => {
                if (error.name !== 'FormogenError' || +error.status !== 400)
                    return dispatch(otherNetworkError(middlewares.otherNetworkError(error)));

                return dispatch(formDataSendFail(middlewares.formDataSendFail(error)));
            });
    };
}

// FORMDATA SEND
export const FORMDATA_SEND_START = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${START}`;
export const FORMDATA_SEND_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${FAIL}`;
export const FORMDATA_SEND_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:${SUCCESS}`;
export const FORMDATA_SEND_SKIP = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:SKIP`;
export const FORMDATA_SEND_OTHER_NETWORK_ERROR = `${FORMOGEN_ACTION_PREFIX}:FORMDATA_SEND:OTHER_NETWORK_ERROR`;

export const formDataSendStart = (data) => ({
    type: FORMDATA_SEND_START,
    payload: data
});

export const formDataSendFail = (error) => ({
    type: FORMDATA_SEND_FAIL,
    payload: error,
});

export const formDataSendSuccess = (status = 'success') => ({
    type: FORMDATA_SEND_SUCCESS,
    payload: status,
});

export const formDataSendSkip = () => ({
    type: FORMDATA_SEND_SKIP,
    payload: null
});

export const otherNetworkError = (error) => ({
    type: FORMDATA_SEND_OTHER_NETWORK_ERROR,
    payload: error,
});

export const sendFormData = (url, method = 'POST', formData) => {
    return dispatch => {
        if (_.isEmpty(formData))
            return dispatch(formDataSendSkip());

        dispatch(formDataSendStart(formData));

        return fetch(url, { ...getFetchOptions({ method }), body: JSON.stringify(formData) })
            .then(resolveResponse)
            .then(data => dispatch(formDataSendSuccess(data)));
    };
};

// FORMFILES UPLOAD
export const FORMFILES_UPLOAD_START = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_UPLOAD:${START}`;
export const FORMFILES_UPLOAD_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_UPLOAD:${SUCCESS}`;
export const FORMFILES_UPLOAD_SKIP = `${FORMOGEN_ACTION_PREFIX}:FORMFILES_UPLOAD:SKIP`;

export const formFilesUploadStart = () => ({
    type: FORMFILES_UPLOAD_START,
});

export const formFilesUploadSuccess = (data) => ({
    type: FORMFILES_UPLOAD_SUCCESS,
    payload: data
});

export const formFilesUploadSkip = () => ({
    type: FORMFILES_UPLOAD_SKIP,
});

export const uploadFormFiles = (formFiles, urls, sendFileQueueLength = 1) => {
    return dispatch => {
        if (_.isEmpty(formFiles))
            return dispatch(formFilesUploadSkip());

        dispatch(formFilesUploadStart());

        return handleFormFilesUpload(formFiles, urls, dispatch, sendFileQueueLength)
            .then(data => dispatch(formFilesUploadSuccess(data)));
    };
};

// SINGLE FILE UPLOAD
export const SINGLE_FILE_UPLOAD_START = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${START}`;
export const SINGLE_FILE_UPLOAD_FAIL = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${FAIL}`;
export const SINGLE_FILE_UPLOAD_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:SINGLE_FILE_UPLOAD:${SUCCESS}`;

export const singleFileUploadStart = (fieldName, url, data, fileName) => ({
    type: SINGLE_FILE_UPLOAD_START,
    payload: { fieldName, url, data, fileName },
});

export const singleFileUploadFail = (fieldName, url, error, fileName) => ({
    type: SINGLE_FILE_UPLOAD_FAIL,
    payload: { fieldName, url, error, fileName },
});

export const singleFileUploadSuccess = (fieldName, url, data, fileName) => ({
    type: SINGLE_FILE_UPLOAD_SUCCESS,
    payload: { fieldName, url, data, fileName }
});

export const uploadSingleFile = (fieldName, uploadUrl, formData, fileName, dispatch) => {
    dispatch(singleFileUploadStart(fieldName, uploadUrl, formData, fileName));

    const options = { ...getFetchOptions({ method: 'POST', headers: {} }), body: formData };
    return fetch(uploadUrl, options)
        .then(resolveResponse)
        .then(data => dispatch(singleFileUploadSuccess(fieldName, uploadUrl, data, fileName)))
        .catch(error => dispatch(singleFileUploadFail(fieldName, uploadUrl, error, fileName)));
};

const evaluateUploadFileChunk = (chunk, dispatch) => {
    return chunk.map(({ fieldName, uploadUrl, formData, fileName }) => {
        return uploadSingleFile(fieldName, uploadUrl, formData, fileName, dispatch);
    });
};

export function handleFormFilesUpload(filesFieldMap, objectUrls, dispatch, queueLength = 1) {
    const queue = prepareFileUploadQueue(filesFieldMap, objectUrls);
    const chunks = _.chunk(queue, queueLength);

    if (_.isEmpty(queue))
        return Promise.resolve();

    return new Promise(resolve => {
        const beginningPromise = Promise.all(evaluateUploadFileChunk(chunks[0], dispatch));

        let followingPromise = beginningPromise.then(() => {
            for (let chunk of chunks.slice(1)) {
                followingPromise = followingPromise.then(() => Promise.all(evaluateUploadFileChunk(chunk, dispatch)));
            }
            followingPromise.then(() => resolve(followingPromise));
        });
    });
}


// =============== FORM'S FIELD CHANGE ===============

export const FIELD_CHANGED = `${FORMOGEN_ACTION_PREFIX}:FIELD_CHANGED`;
export const fieldChanged = (event, { name, value }) => ({
    type: FIELD_CHANGED,
    payload: { event, fieldName: name, fieldValue: value }
});