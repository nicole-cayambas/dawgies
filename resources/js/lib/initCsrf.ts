import api from './api';

let csrfInitialized = false;

export const initCsrf = async () => {
    if (csrfInitialized) return;

    try {
        await api.get('/sanctum/csrf-cookie', { withCredentials: true }); // fetches CSRF cookie
        csrfInitialized = true;
    } catch (err) {
        console.error('Failed to initialize CSRF cookie:', err);
        throw err;
    }
};
