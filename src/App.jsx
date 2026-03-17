import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import { User } from 'lucide-react'; // Importiamo l'icona del profilo!

// Import delle pagine reali
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Upload from './pages/Upload';

const MemeDetail = () => <div className="p-8 text-center"><h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">🖼️ Dettaglio</h1></div>;
const Profile = () => <div className="p-8 text-center"><h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">👤 Mio Profilo</h1></div>;

const MainLayout = () => {
  // Controllo se l'utente ha effettuato l'accesso leggendo il token
  const token = localStorage.getItem('token');

  return (
    // min-h-[100dvh] è ottimizzato per i browser mobile (Dynamic Viewport Height)
    <div className="min-h-[100dvh] flex flex-col bg-zinc-950 font-sans text-white">

      <header className="bg-zinc-950/80 backdrop-blur-md border-b border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">

          <Link to="/" className="text-2xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] text-center">
            MEME<span className="text-purple-500">MUSEUM</span>
          </Link>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium items-center">
            {/* Sostituisci i vecchi link con questi nel tuo App.jsx */}
            <Link to="/" className="text-lg font-bold text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] hover:text-purple-300 hover:drop-shadow-[0_0_12px_rgba(168,85,247,1)] transition-all">
              Esplora
            </Link>
            <Link to="/upload" className="text-lg font-bold text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] hover:text-purple-300 hover:drop-shadow-[0_0_12px_rgba(168,85,247,1)] transition-all">
              Carica
            </Link>

            {/* --- LOGICA NAVBAR DINAMICA --- */}
            {token ? (
              // Mostra l'icona del profilo se c'è il token
              <Link to="/profile" className="flex items-center justify-center p-2 bg-purple-600/20 rounded-full border border-purple-500/50 hover:bg-purple-600/40 transition-all shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                <User className="text-purple-400" size={24} />
              </Link>
            ) : (
              // Mostra il bottone Accedi/Registrati se NON c'è il token
              <Link to="/register" className="px-5 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)] text-sm sm:text-base">
                Accedi / Registrati
              </Link>
            )}

          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto w-full px-4 sm:px-0">
        <Outlet />
      </main>

      <footer className="bg-zinc-900 border-t border-purple-500/20 text-gray-500 text-center py-6 mt-auto">
        <p className="text-xs sm:text-sm px-4">© 2026 MemeMuseum. Progetto TechWeb24/25.</p>
      </footer>

    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> }, // Ora renderizza il vero layout a cascata!
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/upload", element: <Upload /> },
      { path: "/meme/:id", element: <MemeDetail /> },
      { path: "/profile", element: <Profile /> } // Aggiunto per evitare errori cliccando sull'icona
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;