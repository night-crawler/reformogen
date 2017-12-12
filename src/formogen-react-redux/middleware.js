export const API_CALL = 'API_CALL';

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

function buildHeaders(headers = {}) {
    return Object.assign({}, defaultHeaders, headers);
}

export default store => next => action => {
    const apiCall = action[API_CALL];

    if (typeof apiCall === 'undefined') {
        return next(action);
    }

    const { endpoint, options: callOpts, types } = apiCall;
    const [ requestType, successType, failureType ] = types;

    let options;
    if (process.env.NODE_ENV !== 'production') {
        const { CSRFToken } = store.getState();

        options = Object.assign({}, callOpts, {
            mode: 'cors',
            credentials: 'include',

            // WARNING! CSRFToken must be in state (development mode only)
            headers: buildHeaders({ 'X-CSRFToken': CSRFToken })
        });
    }

    next({ type: requestType });

    return fetch(endpoint, options)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response;
        })
        .then(response => response.json())
        .then(
            successData => next({
                type: successType,
                payload: { ...successData },
            }),
            errorData => next({
                type: failureType,
                payload: { ...errorData },
            })
        );
};
