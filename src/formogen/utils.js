import _ from 'lodash';

import * as URI from 'urijs';


export const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};


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
        } catch (err) {}

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

export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function extractPageNumber(uri) {
    const query = new URI(uri).query(true);
    return query.page || query.p || query.page_num;
}

/**
 * If value contains a list of objects like {id: 1, ...} it returns a list of ids. Any id coerces to int.
 * @param {Number|String|Array.<Number>|Array.<String>|Array.<Object>} value
 * @returns {Array.<Number>|Array}
 */
export function idsList(value) {
    if (!value)
        return [];

    // coz _.isEmpty(20) === true
    // if (_.isEmpty(value))
    //     return [];

    if (_.isPlainObject(value))
        return [+value.id];

    if (_.isPlainObject(value[0]))
        return _(value).map('id').map((v) => +v).value();

    if (_.isArray(value))
        return _.map(value, (v) => +v);

    return [+value];
}
