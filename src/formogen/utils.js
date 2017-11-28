
export const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export function resolveResponse(response) {
    if (response.ok) {
        return response.json();
    }

    return response.json().then(data => {
        const error = new Error();
        error.statusCode = response.status;
        error.data = data;

        throw error;
    });
}
