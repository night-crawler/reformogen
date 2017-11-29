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
