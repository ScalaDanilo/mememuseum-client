import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import api from '../api/axios';
import MemeCard from '../components/MemeCard';

const Home = () => {
  const navigate = useNavigate();
  const [memes, setMemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy');
  const tagQuery = searchParams.get('tag');

  // Funzione per ripulire i filtri dall'URL
  const clearFilters = () => {
    navigate('/'); 
    setCurrentPage(1); 
  };

  // --- NUOVA FUNZIONE: Traduce il codice del filtro nel testo leggibile ---
  const getSortLabel = (value) => {
    switch (value) {
      case 'date_desc': return 'Più Recente';
      case 'date_asc': return 'Meno Recente';
      case 'most_upvoted': return 'Più UpVote';
      case 'most_downvoted': return 'Meno UpVote';
      default: return '';
    }
  };

  useEffect(() => {
    const fetchMemes = async () => {
      setIsLoading(true);
      try {
        let endpoint = `/memes/search?page=${currentPage}`; 
        if (sortBy) endpoint += `&sortBy=${sortBy}`;
        if (tagQuery) endpoint += `&tag=${tagQuery}`;

        const response = await api.get(endpoint);
        setMemes(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error("Errore nel caricamento dei meme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemes();
  }, [currentPage, sortBy, tagQuery]); 

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
      
      {/* SEZIONE FILTRI ATTIVI CON TESTO CORRETTO */}
      {(sortBy || tagQuery) && (
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-purple-900/20 border border-purple-500/50 rounded-full text-purple-300 text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <span>
              {/* Usiamo getSortLabel qui! */}
              Filtri: {sortBy ? getSortLabel(sortBy) : ''} {sortBy && tagQuery ? '| ' : ''}{tagQuery ? `Tag: #${tagQuery}` : ''}
            </span>
            <div className="h-4 w-[1px] bg-purple-500/50 mx-1"></div>
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors group"
            >
              <X size={16} className="group-hover:text-red-400 transition-colors"/>
              <span className="group-hover:text-red-400 transition-colors">Rimuovi</span>
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-purple-500 font-bold animate-pulse">
          Caricamento meme dal server...
        </div>
      ) : memes.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 font-bold">
          Nessun meme trovato per i criteri scelti.
        </div>
      ) : (
        <>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              {generatePagination().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${page === currentPage ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' : page === '...' ? 'text-gray-500 cursor-default' : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white border border-purple-500/20 hover:border-purple-500/50'}`}
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