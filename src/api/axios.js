const API_URL = `http://${window.location.hostname}:3000/api`; // <-- Aggiunto /api alla fine!
export const BACKEND_URL = `http://${window.location.hostname}:3000`; // Questo lo lasciamo senza /api perché le immagini sono in /uploads
import axios from 'axios';

// 1. Creiamo un'istanza personalizzata di Axios
const api = axios.create({
    baseURL: API_URL, // <-- IMPORTANTE: Assicurati che questo corrisponda al prefisso delle tue rotte backend`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. INTERCEPTOR DELLE RICHIESTE (Il postino automatico)
// Questo codice viene eseguito un attimo PRIMA che ogni richiesta parta verso il backend
api.interceptors.request.use(
    (config) => {
        // Cerchiamo il token nel localStorage (dove lo salveremo al momento del login)
        const token = localStorage.getItem('token');

        // Se il token esiste, lo infiliamo nell'intestazione (Header) "Authorization"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. NUOVO: INTERCEPTOR DELLE RISPOSTE (Controlla se il token è stato rifiutato)
api.interceptors.response.use(
    (response) => {
        // Se la risposta va a buon fine, la restituiamo così com'è
        return response;
    },
    (error) => {
        // Se il backend ci risponde con 401 (Non Autorizzato / Token Scaduto)
        if (error.response && error.response.status === 401) {
            console.warn("Sessione scaduta o non valida. Logout forzato.");

            // Cancelliamo il token
            localStorage.removeItem('token');

            // Diciamo a React di aggiornare la Navbar
            window.dispatchEvent(new Event('authChange'));

            // Opzionale: potresti anche forzare un reindirizzamento alla login
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

// Esportiamo la nostra istanza configurata al posto dell'axios normale
export default api;