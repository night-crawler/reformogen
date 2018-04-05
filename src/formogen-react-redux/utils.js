import _ from 'lodash';

import Cookies from 'js-cookie';
import * as URI from 'urijs';


export const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};


export function isSafeCSRFMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


export function getRSAAOptions({ headers = DEFAULT_HEADERS, options = {}, csrfToken = '', method = 'GET' } = {}) {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        method: method,
        headers: {
            ...!isSafeCSRFMethod(method) && { 'X-CSRFToken': csrfToken || Cookies.get('csrftoken') },
            ...headers,
        },
        options: {
            mode: isProduction ? 'same-origin' : 'cors',
            credentials: isProduction ? 'same-origin' : 'include',
            ...options,
        },
        credentials: isProduction ? 'same-origin' : 'include',
    };
}


export function getFetchOptions({ headers = DEFAULT_HEADERS, csrfToken = '', method = 'GET' } = {}) {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        method: method,
        headers: {
            ...!isSafeCSRFMethod(method) && { 'X-CSRFToken': csrfToken || Cookies.get('csrftoken') },
            ...headers,
        },
        mode: isProduction ? 'same-origin' : 'cors',
        credentials: isProduction ? 'same-origin' : 'include',
    };
}


export function getFields(init, received) {
    const initialFields = _.get(init, 'fields', []);
    const receivedFields = _.get(received, 'fields', []);

    return _([...initialFields, ...receivedFields]).uniqBy('name').value();
}


export function getDirtyFields(prevDirtyData, pristineData) {
    let dirty = prevDirtyData || {};

    if (!_.get(pristineData, 'id', null))
        return { ...pristineData, ...dirty };

    for (const [fieldName, fieldValue] of Object.entries(dirty)) {
        // TODO: if files are present it's changed
        let changed = fieldValue !== pristineData[fieldName];

        if (changed && (_.isObject(fieldValue) || _.isObject(pristineData[fieldName]))) {
            const pristineFieldValueId = idsList(pristineData[fieldName]);
            const fieldValueId = idsList(fieldValue);

            if (_(fieldValueId).xor(pristineFieldValueId).isEmpty())
                changed = false;
        }

        if (!changed)
            delete dirty[fieldName];
    }
    return dirty;
}


export function updateFormDataWithDefaults(fields, formData) {
    let data = { ...formData };
    for (let field of fields) {
        if (field.name in data) {
            continue;
        }
        // should be undefined for uncontrolled components, not null
        data[field.name] = field.default || '';

        // DRF expects M2M values as a list (empty or not), so empty string is not acceptable here
        if (!data[field.name] && field.type === 'ManyToManyField')
            data[field.name] = [];
    }
    return data;
}


export function prepareFileProcessQueue(filesFieldMap, objectUrls = {}) {
    let fileProcessQueue = [];
    for (let [fieldName, { files, action, url }] of Object.entries(filesFieldMap)) {
        if (_.isEmpty(files)) {
            console.warn(`Field "${fieldName}" contains no files - skipping`);
            continue;
        }

        // delete file
        if (action === 'delete') {
            const deleteUrl = objectUrls[`${fieldName}_delete`] || url;

            if (!deleteUrl)
                throw new Error(`No delete url for field ${fieldName} specified in filesBundle`);

            for (let file of files) {
                fileProcessQueue.push({ fieldName, url: deleteUrl, formData: undefined, fileName: file.name, action });
            }
        }

        // upload files
        if (action === 'upload') {
            const uploadUrl = objectUrls[`${fieldName}_upload`] || url;

            if (!uploadUrl)
                throw new Error(`No upload url for field ${fieldName} specified in filesBundle`);

            for (let file of files) {
                let formData = new FormData();
                formData.append(file.name, file);
                fileProcessQueue.push({ fieldName, url: uploadUrl, formData, fileName: file.name, action });
            }
        }
    }
    return fileProcessQueue;
}


export function idsList(value) {
    if (_.isArray(value))
        return extractIdentity(value);
    return [extractIdentity(value)];
}


export function extractIdentity(value) {
    if (!value)
        return null;

    if (_.isPlainObject(value))
        return +value.id;

    if (_.isArray(value)) {
        if (_.isEmpty(value))
            return [];

        if (_.isPlainObject(value[0]))
            return _(value).map('id').map((v) => +v).value();
        else
            return _.map(value, (v) => +v);
    }

    if (_.isString(value) || _.isNumber(value))
        return +value;

    throw new Error(`Cannot extract identity from ${value}`);
}


export function resolveResponse(response) {
    if (response.ok) {
        return response.json();
    }

    // there was a response.json() recently
    return response.text().then(data => {
        let _data = data, isJson = false;
        try {
            _data = JSON.parse(data);
            isJson = true;
        } catch (err) {
            console.log('resolveResponse(...), error > do nothing');
            console.log(err);
        }

        let error = new Error();
        error.name = 'FormogenError';
        error.data = _data;
        error.status = response.status;
        error.statusText = response.statusText;
        error.origResponse = response;
        error.isJson = isJson;
        error.url = response.url;
        throw error;
    });
}


export function extractPageNumber(uri) {
    const query = new URI(uri).query(true);
    return query.page || query.p || query.page_num;
}


export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}


export default {
    DEFAULT_HEADERS,

    isSafeCSRFMethod,
    getRSAAOptions,
    getFetchOptions,

    getFields,
    getDirtyFields,
    updateFormDataWithDefaults,

    prepareFileProcessQueue,

    idsList,
    extractIdentity,

    resolveResponse,
    extractPageNumber,

    getDisplayName,
};
