import api from './api';

let csrfPromise: Promise<void> | null = null;

export const initCsrf = (): Promise<void> => {
    if (csrfPromise) return csrfPromise; // return existing promise

    csrfPromise = api.get('/sanctum/csrf-cookie', { withCredentials: true })
        .then(() => {
            // nothing extra to do
        })
        .catch((err) => {
            csrfPromise = null; // reset if failed, so we can retry
            console.error('Failed to initialize CSRF cookie:', err);
            throw err;
        });

    return csrfPromise;
};
