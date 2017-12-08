import { headers, resolveResponse } from '../../formogen/utils';

// BASE PREFIXES
export const REQUEST = '?:REQUEST';
export const FAIL = '!:FAIL';
export const RECEIVE = '+:RECEIVE';

// METADATA
export const REQUEST_METADATA = `${REQUEST}:METADATA`;
export const REQUEST_METADATA_FAIL = `${FAIL}:METADATA`;
export const RECEIVE_METADATA = `${RECEIVE}:METADATA`;

export const requestMetadata = (url) => ({
    type: REQUEST_METADATA,
    payload: { url }
});

export const receiveMetadata = (data) => ({
    type: RECEIVE_METADATA,
    payload: Object.assign({}, data)
});

export function fetchMetadata(url) {
    const options = {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: headers,
    };

    return dispatch => {
        dispatch(requestMetadata(url));

        fetch(url, options)
            .then(resolveResponse)
            .then(data => dispatch(receiveMetadata(data)));
    };
}

// FORMDATA
export const REQUEST_FORMDATA = `${REQUEST}:FORMDATA`;
export const REQUEST_FORMDATA_FAIL = `${FAIL}:FORMDATA`;
export const RECEIVE_FORMDATA = `${RECEIVE}:FORMDATA`;

export const requestFormData = (url) => ({
    type: REQUEST_FORMDATA,
    payload: { url }
});

export const receiveFormData = (data) => ({
    type: RECEIVE_FORMDATA,
    payload: Object.assign({}, data)
});

export function fetchFormData(url) {
    const options = {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: headers,
    };

    return dispatch => {
        dispatch(requestFormData(url));

        fetch(url, options)
            .then(resolveResponse)
            .then(data => dispatch(receiveFormData(data)));
    };
}

// SUBMIT
export const REQUEST_SUBMIT = `${REQUEST}:SUBMIT`;
export const REQUEST_SUBMIT_FAIL = `${FAIL}:SUBMIT`;
export const RECEIVE_SUBMIT = `${RECEIVE}:SUBMIT`;

export const requestSubmit = (url) => ({
    type: REQUEST_SUBMIT,
    payload: { url }
});

export const receiveSubmit = (data) => ({
    type: RECEIVE_SUBMIT,
    payload: data,
});

export function submitForm(url, method = 'POST', formData) {
    const options = {
        method: method,
        mode: 'cors',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(formData)
    };

    return dispatch => {
        dispatch(requestSubmit(url));

        fetch(url, options)
            .then(resolveResponse)
            .then(data => dispatch(receiveSubmit(data)));
    };
}
