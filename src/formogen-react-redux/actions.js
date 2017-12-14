import { RSAA } from 'redux-api-middleware';

import _ from 'lodash';
import { resolveResponse } from '../formogen/utils';

import { headers, getApiMiddlewareOptions, handleSendFiles, getFetchOptions } from './utils';


// BASE PREFIXES
export const FORMOGEN_ACTION_PREFIX = 'FORMOGEN';

export const REQUEST = 'REQUEST';
export const FAIL = 'FAIL';
export const RECEIVE = 'RECEIVE';


// METADATA
export const REQUEST_METADATA = `${FORMOGEN_ACTION_PREFIX}:METADATA:${REQUEST}`;
export const REQUEST_METADATA_FAIL = `${FORMOGEN_ACTION_PREFIX}:METADATA:${FAIL}`;
export const RECEIVE_METADATA = `${FORMOGEN_ACTION_PREFIX}:METADATA:${RECEIVE}`;

export const fetchMetaData = (url) => ({
    [RSAA]: {
        endpoint: url,
        method: 'GET',
        types: [REQUEST_METADATA, RECEIVE_METADATA, REQUEST_METADATA_FAIL],
        ...getApiMiddlewareOptions(),
    }
});


// FORMDATA
export const REQUEST_FORMDATA = `${FORMOGEN_ACTION_PREFIX}:FORMDATA:${REQUEST}`;
export const REQUEST_FORMDATA_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORMDATA:${FAIL}`;
export const RECEIVE_FORMDATA = `${FORMOGEN_ACTION_PREFIX}:FORMDATA:${RECEIVE}`;

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



/*
========================================================================================================================
 */

export const FORM_SUBMIT_INIT = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT_INIT`;
export const FORM_SUBMIT_COMPLETE = `${FORMOGEN_ACTION_PREFIX}:FORM_SUBMIT_COMPLETE`;
export const formSubmitInit = () => ({
    type: FORM_SUBMIT_INIT,
});
export const formSubmitComplete = (data) => ({
    type: FORM_SUBMIT_COMPLETE,
    payload: data,
});

export function submitForm({ submitUrl, submitMethod = 'POST', formData, formFiles }) {
    return dispatch => {

        dispatch(formSubmitInit());

        return dispatch(sendFormData(submitUrl, submitMethod, formData))
            .then(({ type, payload }) => payload)
            .then(data => dispatch(fetchFormData(data ? data.urls.update : submitUrl)))
            .then(({ type, payload }) => payload)
            .then(data => dispatch(sendFormFiles(formFiles, data.urls)))
            .then(data => dispatch(formSubmitComplete(data)))
            .catch(error => {
                if (error.name !== 'FormogenError' || +error.status !== 400)
                    return dispatch(otherNetworkError(error));

                return dispatch(formDataSendFail(error));
            });
    };
}


export const FORM_DATA_SEND_START = `${FORMOGEN_ACTION_PREFIX}:FORM_DATA_SEND_START`;
export const FORM_DATA_SEND_FAIL = `${FORMOGEN_ACTION_PREFIX}:FORM_DATA_SEND_FAIL`;
export const FORM_DATA_SEND_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORM_DATA_SEND_SUCCESS`;
export const FORM_DATA_SEND_SKIP = `${FORMOGEN_ACTION_PREFIX}:FORM_DATA_SEND_SKIP`;
export const FORM_DATA_OTHER_NETWORK_ERROR = `${FORMOGEN_ACTION_PREFIX}:FORM_DATA_OTHER_NETWORK_ERROR`;

export const otherNetworkError = (error) => ({
    type: FORM_DATA_OTHER_NETWORK_ERROR,
    payload: error,
});

export const formDataSendSkip = () => ({
    type: FORM_DATA_SEND_SKIP,
    payload: null
});

export const formDataSendStart = (data) => ({
    type: FORM_DATA_SEND_START,
    payload: data
});
export const formDataSendFail = (error) => ({
    type: FORM_DATA_SEND_FAIL,
    payload: error,
});
export const formDataSendSuccess = (status='success') => ({
    type: FORM_DATA_SEND_SUCCESS,
    payload: status,
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

export const FORM_FILES_UPLOAD_START = `${FORMOGEN_ACTION_PREFIX}:FORM_FILES_UPLOAD_START`;
export const FORM_FILES_UPLOAD_SUCCESS = `${FORMOGEN_ACTION_PREFIX}:FORM_FILES_UPLOAD_SUCCESS`;
export const FORM_FILES_UPLOAD_SKIP = `${FORMOGEN_ACTION_PREFIX}:FORM_FILES_UPLOAD_SKIP`;

export const formFilesUploadSkip = () => ({
    type: FORM_FILES_UPLOAD_SKIP,
});
export const formFilesUploadStart = () => ({
    type: FORM_FILES_UPLOAD_START,
});
export const formFilesUploadSuccess = (data) => ({
    type: FORM_FILES_UPLOAD_SUCCESS,
    payload: data
});

export const sendFormFiles = (formFiles, urls) => {
    return dispatch => {
        if (_.isEmpty(formFiles)) {
            return dispatch(formFilesUploadSkip());
        }

        dispatch(formFilesUploadStart());

        return handleSendFiles(formFiles, urls, dispatch)
            .then(
                data => dispatch(formFilesUploadSuccess(data))
            );
    };
};
