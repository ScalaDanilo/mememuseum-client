import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Dice a Vite di ascoltare su TUTTE le schede di rete del PC
    port: 5173,      // Forza l'uso della porta corretta
    allowedHosts: true // Disabilita completamente il controllo del dominio, accettando DuckDNS al 100%
  }
})