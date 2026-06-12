import React, { useState, useEffect, useRef } from "react"; // Aggiunto useRef
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { User, Filter, Search } from "lucide-react";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import MemeDetail from "./pages/MemeDetail";
import DailyMeme from "./pages/DailyMeme";
import api, { BACKEND_URL } from "./api/axios";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token"));

  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem("token");
      if (
        currentToken &&
        currentToken !== "undefined" &&
        currentToken !== "null"
      ) {
        try {
          const payload = JSON.parse(atob(currentToken.split(".")[1]));
          if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            setToken(null);
          } else {
            setToken(currentToken);
          }
        } catch (e) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } else {
        setToken(null);
      }
    };
    checkToken();
    window.addEventListener("authChange", checkToken);
    return () => window.removeEventListener("authChange", checkToken);
  }, [location.pathname]);

  const isAuthenticated =
    token && token !== "undefined" && token !== "null" && token !== "";

  useEffect(() => {
    const fetchAvatar = () => {
      if (isAuthenticated) {
        api
          .get("/users/profile")
          .then((response) => {
            setUserAvatar(response.data.imageUrl);
          })
          .catch((err) =>
            console.error("Errore recupero avatar per la Navbar", err),
          );
      } else {
        setUserAvatar(null);
      }
    };

    fetchAvatar();

    window.addEventListener("profileUpdated", fetchAvatar);
    return () => window.removeEventListener("profileUpdated", fetchAvatar);
  }, [isAuthenticated]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  // Riferimento per il menu a tendina dei filtri
  const filterDropdownRef = useRef(null);

  // Gestione del click all'esterno per chiudere il dropdown dei filtri
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
        setShowTagInput(false);
        setTagSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const applyFilter = (type, value) => {
    const currentParams = new URLSearchParams(location.search);
    if (type === "sort") {
      currentParams.set("sortBy", value);
      currentParams.delete("tag");
    } else if (type === "tag") {
      currentParams.set("tag", value);
    }
    navigate(`/?${currentParams.toString()}`);
    setIsFilterOpen(false);
    setShowTagInput(false);
    setTagSearch("");
  };

  const pillButtonStyle =
    "px-5 py-2 rounded-full font-bold border border-purple-500 text-purple-400 bg-transparent shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] hover:bg-purple-900/20 hover:text-purple-300 transition-all text-sm sm:text-base whitespace-nowrap";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-zinc-950 font-sans text-white">
      <header className="bg-zinc-950/80 backdrop-blur-md border-b border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <Link
              to="/"
              className="text-2xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] order-1"
            >
              MEME<span className="text-purple-500">MUSEUM</span>
            </Link>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium items-center w-full lg:w-auto order-3 lg:order-2">
              <Link
                to="/"
                className="text-gray-300 hover:text-purple-400 transition-all hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              >
                Esplora
              </Link>
              <Link
                to="/upload"
                className="text-gray-300 hover:text-purple-400 transition-all hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              >
                Carica
              </Link>

              <div className="relative" ref={filterDropdownRef}>
                <button
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setShowTagInput(false);
                  }}
                  className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-all hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                >
                  <Filter size={20} />
                  <span>Filtra</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-zinc-900 border border-purple-500/50 rounded-xl shadow-[0_10px_30px_rgba(168,85,247,0.3)] overflow-hidden z-50 flex flex-col">
                    {!showTagInput ? (
                      <>
                        <button
                          onClick={() => applyFilter("sort", "date_desc")}
                          className="px-4 py-3 text-left text-sm hover:bg-purple-900/30 hover:text-purple-300 border-b border-purple-500/20 transition-colors"
                        >
                          Più Recente
                        </button>
                        <button
                          onClick={() => applyFilter("sort", "date_asc")}
                          className="px-4 py-3 text-left text-sm hover:bg-purple-900/30 hover:text-purple-300 border-b border-purple-500/20 transition-colors"
                        >
                          Meno Recente
                        </button>
                        <button
                          onClick={() => applyFilter("sort", "most_upvoted")}
                          className="px-4 py-3 text-left text-sm hover:bg-purple-900/30 hover:text-purple-300 border-b border-purple-500/20 transition-colors"
                        >
                          Più UpVote
                        </button>
                        <button
                          onClick={() => applyFilter("sort", "most_downvoted")}
                          className="px-4 py-3 text-left text-sm hover:bg-purple-900/30 hover:text-purple-300 border-b border-purple-500/20 transition-colors"
                        >
                          Meno UpVote
                        </button>
                        <button
                          onClick={() => setShowTagInput(true)}
                          className="px-4 py-3 text-left text-sm hover:bg-purple-900/30 hover:text-purple-300 font-bold text-purple-400 transition-colors"
                        >
                          Cerca per Tag...
                        </button>
                      </>
                    ) : (
                      <div className="p-3 flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Es. Gatto..."
                          value={tagSearch}
                          onChange={(e) => setTagSearch(e.target.value)}
                          className="w-full bg-zinc-950 border border-purple-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        />
                        <button
                          onClick={() =>
                            tagSearch.trim() &&
                            applyFilter("tag", tagSearch.trim())
                          }
                          className="bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition-colors"
                        >
                          <Search size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link to="/daily" className={pillButtonStyle}>
                Meme del Giorno
              </Link>
            </div>

            <div className="order-2 lg:order-3 shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 bg-zinc-900 rounded-full border border-purple-500 hover:bg-purple-900/20 transition-all shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] overflow-hidden"
                >
                  {userAvatar ? (
                    <img
                      src={`${BACKEND_URL}${userAvatar}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-purple-400" size={20} />
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 sm:px-5 sm:py-2 rounded-full font-bold border border-purple-500 text-purple-400 bg-transparent shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] hover:bg-purple-900/20 hover:text-purple-300 transition-all text-sm whitespace-nowrap"
                >
                  Accedi
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto w-full px-4 sm:px-0">
        <Outlet />
      </main>

      <footer className="bg-zinc-900 border-t border-purple-500/20 text-gray-500 text-center py-6 mt-auto">
        <p className="text-xs sm:text-sm px-4">
          © 2026 MemeMuseum. Progetto TechWeb24/25.
        </p>
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
      { path: "/meme/:id", element: <MemeDetail /> },
      { path: "/profile", element: <Profile /> },
      { path: "/daily", element: <DailyMeme /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
