import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URL || '/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Add CSRF token automatically
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
    api.defaults.headers.common['X-CSRF-TOKEN'] = token;
    api.defaults.withCredentials = true;
    api.defaults.withXSRFToken = true;
}

export default api;
