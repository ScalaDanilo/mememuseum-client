const API_URL = `http://${window.location.hostname}:3000/api`;
export const BACKEND_URL = `http://${window.location.hostname}:3000`;
import axios from 'axios';

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