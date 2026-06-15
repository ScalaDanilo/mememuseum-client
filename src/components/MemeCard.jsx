import React, { useState, useEffect } from 'react';
import { Heart, HeartCrack, MessageCircle, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { BACKEND_URL } from '../api/axios';

const MemeCard = ({ meme }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState(0);

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);

  const getCurrentUsername = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await api.get(`/votes/${meme.id}`);
        setLikes(response.data.likesCount);
        setDislikes(response.data.dislikesCount || 0);
        setLikedUsers(response.data.likedUsersData);

        const username = getCurrentUsername();
        if (username) {
          if (response.data.likedBy.includes(username)) {
            setUserVote(1);
          } else if (response.data.dislikedBy.includes(username)) {
            setUserVote(-1);
          } else {
            setUserVote(0);
          }
        }
      } catch (error) {
        console.error("Errore recupero voti:", error);
      }
    };
    fetchVotes();
  }, [meme.id]);

  const handleVote = async (value, e) => {
    e.stopPropagation();
    try {
      await api.post(`/votes/${meme.id}`, { value: value });

      const response = await api.get(`/votes/${meme.id}`);
      setLikes(response.data.likesCount);
      setDislikes(response.data.dislikesCount || 0);

      const username = getCurrentUsername();
      if (response.data.likedBy.includes(username)) {
        setUserVote(1);
      } else if (response.data.dislikedBy.includes(username)) {
        setUserVote(-1);
      } else {
        setUserVote(0);
      }

    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Devi effettuare l'accesso per poter votare!");
      } else {
        console.error("Errore durante il voto", error);
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/meme/${meme.id}`);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/meme/${meme.id}`, { state: { focusComment: true } });
  };

  const openLikesModal = (e) => {
    e.stopPropagation();
    setIsLikesModalOpen(true);
  };

  return (
    <>
      <div className="relative group break-inside-avoid overflow-hidden rounded-xl border border-purple-500/20 bg-zinc-900 hover:border-purple-500/60 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] flex flex-col">

        <div className="relative cursor-pointer" onClick={handleCardClick}>
          <img
            src={`${BACKEND_URL}${meme.imageUrl}`}
            alt={meme.title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16 pointer-events-none">
            {meme.tags && meme.tags.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1 mb-1.5 pointer-events-auto">
                {meme.tags.map(tag => (
                  <span key={tag.id} className="text-purple-400 text-xs sm:text-sm font-bold drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
            <h2 className="text-white font-bold text-sm sm:text-base line-clamp-2 drop-shadow-md">
              {meme.title}
            </h2>
            <p className="text-xs text-gray-400 mt-1">di @{meme.user?.username}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-t border-purple-500/20">
          <div className="flex gap-4 sm:gap-5 items-center">

            {/* Sezione Upvote (Cliccabile con modale) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => handleVote(1, e)}
                className={`transition-all group/btn ${userVote === 1
                    ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]'
                    : 'text-gray-400 hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]'
                  }`}
              >
                <Heart size={20} className={`group-active/btn:scale-75 transition-transform ${userVote === 1 ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={openLikesModal}
                className="font-bold text-sm text-gray-400 hover:text-white transition-colors"
              >
                {likes}
              </button>
            </div>

            {/* Sezione Downvote */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => handleVote(-1, e)}
                className={`transition-all group/btn ${userVote === -1
                    ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : 'text-gray-400 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                  }`}
              >
                <HeartCrack size={20} className={`group-active/btn:scale-75 transition-transform ${userVote === -1 ? 'fill-current' : ''}`} />
              </button>
              
              {/* Mostra il numero assoluto positivo dei downvote in tinta con l'interfaccia */}
              <span className="font-bold text-sm text-gray-400 select-none">
                {dislikes}
              </span>
            </div>
          </div>

          <button
            onClick={handleCommentClick}
            className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all"
          >
            <MessageCircle size={20} />
            <span className="font-bold text-sm">{meme._count?.comments || 0}</span>
          </button>
        </div>
      </div>

      {/* MODALE DI CONTROLLO DEI LIKE */}
      {isLikesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-purple-500/30 rounded-2xl w-full max-w-sm shadow-[0_0_30px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col max-h-[70vh]">

            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-bold text-lg text-white">Piace a</h3>
              <button
                onClick={(e) => { e.stopPropagation(); setIsLikesModalOpen(false); }}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex flex-col gap-3">
              {likedUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nessun like ancora.</p>
              ) : (
                likedUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-purple-500/30 overflow-hidden flex items-center justify-center shrink-0">
                      {user.imageUrl ? (
                        <img src={`${BACKEND_URL}${user.imageUrl}`} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} className="text-gray-400" />
                      )}
                    </div>
                    <span className="font-bold text-gray-200">@{user.username}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemeCard;