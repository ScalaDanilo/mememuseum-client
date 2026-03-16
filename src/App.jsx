import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';

// --- 1. PAGINE FINTI (PLACEHOLDER) ---
// Per ora sono solo dei div con un titolo, ci scriverai il codice in futuro
const Home = () => <div className="p-8"><h1 className="text-3xl font-bold text-slate-800">🏠 Galleria Meme</h1><p className="mt-2 text-slate-600">Qui apparirà la griglia con i meme.</p></div>;
const Login = () => <div className="p-8"><h1 className="text-3xl font-bold text-slate-800">🔑 Login / Registrazione</h1><p className="mt-2 text-slate-600">Qui ci sarà il form per accedere.</p></div>;
const Upload = () => <div className="p-8"><h1 className="text-3xl font-bold text-slate-800">⬆️ Carica Meme</h1><p className="mt-2 text-slate-600">Qui ci sarà il form con Multer per l'upload.</p></div>;
const MemeDetail = () => <div className="p-8"><h1 className="text-3xl font-bold text-slate-800">🖼️ Dettaglio Meme</h1><p className="mt-2 text-slate-600">Qui vedrai l'immagine grande, i voti e i commenti.</p></div>;

// --- 2. LAYOUT PRINCIPALE ---
// Questo componente fa da "cornice" a tutte le pagine
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      
      {/* NAVBAR (Fissa in alto) */}
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-widest">
            MEME<span className="text-indigo-300">MUSEUM</span>
          </Link>
          <div className="flex gap-6 font-medium">
            <Link to="/" className="hover:text-indigo-200 transition-colors">Esplora</Link>
            <Link to="/upload" className="hover:text-indigo-200 transition-colors">Carica</Link>
            <Link to="/login" className="px-4 py-1 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
              Accedi
            </Link>
          </div>
        </nav>
      </header>

      {/* CONTENUTO DINAMICO */}
      {/* L'Outlet è il "buco" dove React Router inietterà la Home, il Login, ecc. */}
      <main className="flex-grow container mx-auto w-full">
        <Outlet />
      </main>

      {/* FOOTER (Fisso in basso) */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 mt-auto">
        <p className="text-sm">© 2026 MemeMuseum. Progetto Tecnologie Web.</p>
      </footer>

    </div>
  );
};

// --- 3. CONFIGURAZIONE DELLE ROTTE ---
// Qui diciamo a React quale componente mostrare per ogni URL
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Usiamo la cornice come elemento base
    children: [
      {
        path: "/",            // Se l'URL è localhost:5173/
        element: <Home />,    // Mostra la Home dentro l'Outlet
      },
      {
        path: "/login",       // Se l'URL è localhost:5173/login
        element: <Login />,   // Mostra il Login
      },
      {
        path: "/upload",
        element: <Upload />,
      },
      {
        path: "/meme/:id",    // Rotta dinamica (es. /meme/123)
        element: <MemeDetail />,
      }
    ],
  },
]);

// --- 4. AVVIO DELL'APP ---
function App() {
  return <RouterProvider router={router} />;
}

export default App;