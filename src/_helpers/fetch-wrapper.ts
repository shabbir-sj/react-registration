

import { store, authActions } from '../_store';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ParamMap = { [key: string]: string | number | boolean }

function request(method: Method) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (url: string, body?: any) => {
        const requestOptions: {
            method: Method,
            headers: ParamMap,
            body?: string
        } = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }
        return fetch(url, requestOptions as RequestInit).then(handleResponse);
    }
}

// helper functions
function authHeader(url: string): ParamMap {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = authToken();
    const isLoggedIn = !!token;
    const isApiUrl = url.startsWith(import.meta.env.REACT_APP_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

function authToken() {
    return store.getState().auth.value?.token;
}

async function handleResponse(response: Response) {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    // check for error response
    if (!response.ok) {
        if ([401, 403].includes(response.status) && authToken()) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            const logout = () => store.dispatch(authActions.logout());
            logout();
        }

        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
    }

    return data;
}