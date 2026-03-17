import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const BACKEND_URL = 'http://localhost:3000'; 

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/memes?page=${currentPage}`);
        setMemes(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error("Errore nel caricamento dei meme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemes();
  }, [currentPage]);

  const generatePagination = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(currentPage);
      if (currentPage + 1 <= totalPages) pages.push(currentPage + 1);
      if (currentPage + 2 <= totalPages) pages.push(currentPage + 2);
      
      if (currentPage + 10 <= totalPages) {
        pages.push('...');
        pages.push(currentPage + 10);
      } else if (totalPages > currentPage + 2) {
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-8">
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-purple-500 font-bold animate-pulse">
          Caricamento meme dal server...
        </div>
      ) : memes.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 font-bold">
          Nessun meme trovato. Sii il primo a caricarne uno!
        </div>
      ) : (
        <>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {memes.map((meme) => (
              <div 
                key={meme.id} 
                className="relative group break-inside-avoid overflow-hidden rounded-xl border border-purple-500/20 bg-zinc-900 cursor-pointer hover:border-purple-500/60 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <img 
                  src={`${BACKEND_URL}${meme.imageUrl}`} 
                  alt={meme.title} 
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16">
                  
                  {/* --- NUOVO: MOSTRA I TAG CON IL # --- */}
                  {meme.tags && meme.tags.length > 0 && (
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mb-1.5">
                      {meme.tags.map(tag => (
                        <span key={tag.id} className="text-purple-400 text-xs sm:text-sm font-bold drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-white font-bold text-sm sm:text-base line-clamp-2 drop-shadow-md group-hover:text-purple-300 transition-colors">
                    {meme.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">di @{meme.user?.username}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SLIDER NUMERICO */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              {generatePagination().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all
                    ${page === currentPage 
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' 
                      : page === '...' 
                        ? 'text-gray-500 cursor-default' 
                        : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white border border-purple-500/20 hover:border-purple-500/50'
                    }
                  `}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;