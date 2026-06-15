import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Send, ArrowLeft, MessageSquare, Heart, HeartCrack, X, AlertCircle, Trash2 } from 'lucide-react';
import api, { BACKEND_URL } from '../api/axios';

const MemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [meme, setMeme] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0); // 🌟 Nuovo stato per i downvote
  const [userVote, setUserVote] = useState(0);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);

  // STATO PER I POPUP ALERT PERSONALIZZATI
  const [customAlert, setCustomAlert] = useState({ isOpen: false, message: '' });

  const commentInputRef = useRef(null);
  const loginToCommentRef = useRef(null);

  const getCurrentUsername = () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken || currentToken === 'undefined' || currentToken === 'null') return null;
    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      return payload.username;
    } catch (e) {
      return null;
    }
  };

  const getCurrentUserId = () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken || currentToken === 'undefined' || currentToken === 'null') return null;
    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      return payload.userId;
    } catch (e) {
      return null;
    }
  };

  const isAuthenticated = !!getCurrentUsername();

  const triggerAlert = (message) => {
    setCustomAlert({ isOpen: true, message });
  };

  useEffect(() => {
    const fetchDati = async () => {
      setIsLoading(true);

      try {
        const memeResponse = await api.get(`/memes/${id}`);
        setMeme(memeResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 404) navigate('/');
        return;
      }

      try {
        const commentsResponse = await api.get(`/comments/${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Errore nel caricamento dei commenti", error);
      }

      try {
        const votesResponse = await api.get(`/votes/${id}`);
        setLikes(votesResponse.data.likesCount);
        setDislikes(votesResponse.data.dislikesCount || 0);
        setLikedUsers(votesResponse.data.likedBy);

        const username = getCurrentUsername();
        if (username && votesResponse.data.likedBy && votesResponse.data.dislikedBy) {
          if (votesResponse.data.likedBy.includes(username)) setUserVote(1);
          else if (votesResponse.data.dislikedBy.includes(username)) setUserVote(-1);
          else setUserVote(0);
        }
      } catch (error) {
        console.error("Errore nel caricamento dei voti", error);
      }

      setIsLoading(false);
    };

    fetchDati();
  }, [id, navigate]);

  useEffect(() => {
    if (!isLoading && meme && location.state?.focusComment) {
      setTimeout(() => {
        if (isAuthenticated && commentInputRef.current) {
          commentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          commentInputRef.current.focus();
        } else if (!isAuthenticated && loginToCommentRef.current) {
          loginToCommentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [isLoading, meme, location.state, isAuthenticated]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/comments/${id}`, { text: newComment });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      triggerAlert(error.response?.data?.error || "Errore durante la pubblicazione del commento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (value) => {
    try {
      await api.post(`/votes/${id}`, { value: value });

      const response = await api.get(`/votes/${id}`);
      setLikes(response.data.likesCount);
      setDislikes(response.data.dislikesCount || 0); // 🌟 Aggiorna i downvote dopo il voto
      setLikedUsers(response.data.likedBy);

      const username = getCurrentUsername();
      if (response.data.likedBy.includes(username)) setUserVote(1);
      else if (response.data.dislikedBy.includes(username)) setUserVote(-1);
      else setUserVote(0);

    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        triggerAlert("Devi effettuare l'accesso per poter votare questo meme!");
      } else {
        console.error("Errore durante il voto", error);
      }
    }
  };

  const handleDeleteMeme = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare definitivamente questo meme capolavoro?")) return;

    try {
      await api.delete(`/memes/${id}`);
      triggerAlert("Meme eliminato con successo!");
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      triggerAlert(error.response?.data?.error || "Errore durante l'eliminazione del meme.");
    }
  };

  if (isLoading) return <div className="text-center py-20 text-purple-500 font-bold animate-pulse text-xl">Caricamento capolavoro...</div>;
  if (!meme) return null;

  const authorImage = meme.user?.imageUrl ? `${BACKEND_URL}${meme.user.imageUrl}` : null;

  return (
    <>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-6 transition-colors font-semibold">
          <ArrowLeft size={20} /> Torna indietro
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* COLONNA SINISTRA: RIQUADRO FOTO ADATTIVO ED ELEGANTE */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24 items-center justify-center">
            <div className="bg-zinc-950 rounded-2xl border border-purple-500/20 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] flex items-center justify-center h-auto max-h-[65vh] p-2 w-fit">
              <img
                src={`${BACKEND_URL}${meme.imageUrl}`}
                alt={meme.title}
                className="w-auto h-auto max-h-[60vh] object-contain rounded-xl"
              />
            </div>

            {/* BARRA DEI VOTI AGGIORNATA */}
            <div className="flex items-center justify-center bg-zinc-900/80 px-8 py-3 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] self-center w-max mt-2">
              <div className="flex gap-8 items-center">
                
                {/* UPVOTE */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVote(1)}
                    className={`transition-all group/btn ${userVote === 1 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'text-gray-400 hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]'}`}
                  >
                    <Heart size={28} className={`group-active/btn:scale-75 transition-transform ${userVote === 1 ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsLikesModalOpen(true)}
                    className="font-black text-xl text-gray-400 hover:text-white transition-colors"
                  >
                    {likes}
                  </button>
                </div>

                {/* DOWNVOTE (Simmetrico con contatore numerico non cliccabile) */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVote(-1)}
                    className={`flex items-center gap-2 transition-all group/btn ${userVote === -1 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-gray-400 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`}
                  >
                    <HeartCrack size={28} className={`group-active/btn:scale-75 transition-transform ${userVote === -1 ? 'fill-current' : ''}`} />
                  </button>
                  
                  <span className="font-black text-xl text-gray-400 select-none">
                    {dislikes}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* COLONNA DESTRA: DETTAGLI E COMMENTI */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-800 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-purple-500/50 overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0">
                  {authorImage ? <img src={authorImage} alt="Autore" className="w-full h-full object-cover" /> : <User size={28} className="text-gray-500" />}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Caricato da</p>
                  <p className="text-lg font-bold text-purple-300">@{meme.user?.username}</p>
                </div>
              </div>

              {/* Mostra il tasto rosso solo se l'utente loggato è il creatore del meme */}
              {getCurrentUserId() === meme.userId && (
                <button
                  onClick={handleDeleteMeme}
                  className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-600 text-red-400 hover:text-white px-4 py-2 rounded-xl transition-all font-semibold text-sm shadow-[0_0_15px_rgba(239,68,68,0.05)] active:scale-95 cursor-pointer"
                >
                  <Trash2 size={16} />
                  Elimina Meme
                </button>
              )}
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {meme.tags?.map(tag => (
                  <span key={tag.id} className="text-xs font-bold px-3 py-1 bg-purple-900/30 text-purple-400 border border-purple-500/30 rounded-full">
                    #{tag.name}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] mb-4">{meme.title}</h1>
              {meme.description && <p className="text-gray-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">{meme.description}</p>}
            </div>

            <div className="mt-auto pt-6 flex-grow flex flex-col">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <MessageSquare size={20} className="text-purple-400" />
                Commenti ({comments.length})
              </h2>

              {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="mb-8 flex gap-3 relative">
                  <input
                    type="text"
                    ref={commentInputRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Scrivi un commento epico..."
                    className="flex-grow bg-zinc-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    maxLength={255}
                  />
                  <button type="submit" disabled={!newComment.trim() || isSubmitting} className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-gray-500 text-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center justify-center shrink-0">
                    <Send size={20} />
                  </button>
                </form>
              ) : (
                <div ref={loginToCommentRef} className="mb-8 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
                  <p className="text-gray-400 mb-2">Devi accedere per poter commentare.</p>
                  <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300">Accedi ora</Link>
                </div>
              )}

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Nessun commento ancora. Sii il primo!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/80 hover:border-purple-500/30 transition-colors">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                        {comment.user?.imageUrl ? (
                          <img src={`${BACKEND_URL}${comment.user.imageUrl}`} alt={comment.user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={20} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-purple-300 text-sm">{comment.user?.username}</span>
                          <span className="text-xs text-gray-500 ml-2">{new Date(comment.date).toLocaleDateString('it-IT')}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed break-words">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALE DI CONTROLLO DEI LIKE */}
      {isLikesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-purple-500/30 rounded-2xl w-full max-w-sm shadow-[0_0_30px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col max-h-[70vh]">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-bold text-lg text-white">Piace a</h3>
              <button onClick={() => setIsLikesModalOpen(false)} className="text-gray-400 hover:text-red-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex flex-col gap-3">
              {likedUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nessun like ancora.</p>
              ) : (
                likedUsers.map((username, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <span className="font-bold text-gray-200">@{username}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALE ALERT PERSONALIZZATA */}
      {customAlert.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-purple-500/40 rounded-2xl w-full max-w-sm shadow-[0_0_40px_rgba(168,85,247,0.3)] overflow-hidden p-6 text-center">
            <div className="flex justify-center mb-3 text-purple-400">
              <AlertCircle size={40} className="animate-bounce" />
            </div>
            <h3 className="font-black text-xl text-white mb-2">Attenzione Museale</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{customAlert.message}</p>
            <button
              onClick={() => setCustomAlert({ isOpen: false, message: '' })}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-98"
            >
              Ricevuto
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MemeDetail;