import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URL || '/',
    withCredentials: true, // always send cookies
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    xsrfCookieName: 'XSRF-TOKEN', // Laravel Sanctum default
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

export default api;
