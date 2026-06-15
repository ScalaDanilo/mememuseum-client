import axios from 'axios';

export const BACKEND_URL = `https://mememuseum-ds.duckdns.org`;
const API_URL = `${BACKEND_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR DELLE RICHIESTE
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// INTERCEPTOR DELLE RISPOSTE
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Sessione scaduta o non valida. Logout forzato.");

            localStorage.removeItem('token');

            window.dispatchEvent(new Event('authChange'));
        }
        return Promise.reject(error);
    }
);

export default api;