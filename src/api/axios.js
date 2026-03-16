import axios from 'axios';

// 1. Creiamo un'istanza personalizzata di Axios
const api = axios.create({
  // Questo è l'URL di base del tuo backend Node.js
  baseURL: 'http://localhost:3000/api', 
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

// Esportiamo la nostra istanza configurata al posto dell'axios normale
export default api;