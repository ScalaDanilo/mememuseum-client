import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';

const Home = () => <div className="p-8 text-center"><h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">🏠 Galleria Meme</h1></div>;
const Upload = () => <div className="p-8 text-center"><h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">⬆️ Carica Meme</h1></div>;
const MemeDetail = () => <div className="p-8 text-center"><h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">🖼️ Dettaglio</h1></div>;

const MainLayout = () => {
  return (
    // min-h-[100dvh] è ottimizzato per i browser mobile (Dynamic Viewport Height)
    <div className="min-h-[100dvh] flex flex-col bg-zinc-950 font-sans text-white">
      
      <header className="bg-zinc-950/80 backdrop-blur-md border-b border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] sticky top-0 z-50">
        {/* Modificata l'impostazione flex per andare a capo sui telefoni */}
        <nav className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <Link to="/" className="text-2xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] text-center">
            MEME<span className="text-purple-500">MUSEUM</span>
          </Link>
          
          {/* Aggiunto flex-wrap per adattare i bottoni */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium items-center">
            <Link to="/" className="text-gray-300 hover:text-purple-400 transition-all hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">Esplora</Link>
            <Link to="/upload" className="text-gray-300 hover:text-purple-400 transition-all hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">Carica</Link>
            
            <Link to="/register" className="px-5 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)] text-sm sm:text-base">
              Accedi / Registrati
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto w-full px-4">
        <Outlet />
      </main>

      <footer className="bg-zinc-900 border-t border-purple-500/20 text-gray-500 text-center py-6 mt-auto">
        <p className="text-xs sm:text-sm px-4">© 2026 MemeMuseum. L'unica piattaforma per il tuo black-humor.</p>
      </footer>

    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/upload", element: <Upload /> },
      { path: "/meme/:id", element: <MemeDetail /> }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;