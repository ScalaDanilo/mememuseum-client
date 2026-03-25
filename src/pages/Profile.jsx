import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit2, LogOut, Trash2, Camera, Eye, EyeOff, X } from 'lucide-react';
import api, { BACKEND_URL } from '../api/axios';
import MemeCard from '../components/MemeCard';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [memes, setMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null);   

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile'); 
        setUser(response.data);
        setMemes(response.data.memes || []);
        setEditUsername(response.data.username);
      } catch (error) {
        console.error("Errore caricamento profilo:", error);
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsEditing(true); 
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (editUsername !== user.username) formData.append('username', editUsername);
    if (editPassword) formData.append('password', editPassword);
    if (selectedImage) formData.append('image', selectedImage); 

    try {
      const response = await api.put('/users/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUser({ ...user, ...response.data.user });
      setIsEditing(false);
      setEditPassword(''); 
      alert("Profilo aggiornato con successo!");

      window.dispatchEvent(new Event('profileUpdated')); 

    } catch (error) {
      alert(error.response?.data?.error || "Errore durante il salvataggio.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Sei SICURO di voler eliminare il tuo account e tutti i tuoi meme? L'azione è irreversibile.")) {
      try {
        await api.delete('/users/delete-account');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authChange'));
        alert("Account eliminato addio!");
        navigate('/');
      } catch (error) {
        alert("Errore durante l'eliminazione dell'account.");
      }
    }
  };

  if (isLoading) return <div className="text-center py-20 text-purple-500 font-bold animate-pulse">Caricamento profilo...</div>;
  if (!user) return <div className="text-center py-20 text-red-500 font-bold">Errore nel caricamento dei dati utente. Riprova.</div>;

  const displayImage = previewImage || (user.imageUrl ? `${BACKEND_URL}${user.imageUrl}` : null);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
      
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-zinc-900 p-6 md:p-10 rounded-3xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
        
        <div className="relative group shrink-0">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-zinc-950 shadow-[0_0_20px_rgba(168,85,247,0.4)] overflow-hidden bg-zinc-800 flex items-center justify-center">
            {displayImage ? (
              <img src={displayImage} alt="Profilo" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-gray-500" />
            )}
          </div>
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-2 right-2 p-3 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.8)] border-2 border-zinc-900 hover:scale-110"
            title="Cambia Immagine"
          >
            <Camera size={20} />
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
        </div>

        <div className="flex-grow w-full flex flex-col items-center md:items-start text-center md:text-left">
          
          {!isEditing ? (
            <>
              <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] mb-2">
                {user.username}
              </h1>
              <p className="text-gray-400 mb-8 font-medium text-sm md:text-base">Membro dal {new Date().getFullYear()} • {memes.length} Meme caricati</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start w-full">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-800 border border-purple-500/50 hover:bg-purple-900/30 text-purple-300 rounded-full font-bold transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                >
                  <Edit2 size={18} /> Modifica Profilo
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 text-gray-300 rounded-full font-bold transition-all"
                >
                  <LogOut size={18} /> Esci
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 text-red-400 rounded-full font-bold transition-all"
                >
                  <Trash2 size={18} /> Elimina Account
                </button>
              </div>
            </>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Modifica Dati</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Username</label>
                <input 
                  type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Nuova Password (lascia vuoto per non cambiare)</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} value={editPassword} onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Nuova password sicura..."
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                  Salva Modifiche
                </button>
                <button onClick={() => { setIsEditing(false); setPreviewImage(null); setSelectedImage(null); setEditUsername(user.username); }} className="px-4 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-all">
                  <X size={24} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] flex items-center gap-3">
          I tuoi Meme <span className="text-sm font-medium px-3 py-1 bg-purple-900/40 border border-purple-500/50 rounded-full text-purple-300">{memes.length}</span>
        </h2>

        {memes.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-700">
            <p className="text-gray-400 text-lg">Non hai ancora caricato nessun meme.</p>
            <button onClick={() => navigate('/upload')} className="mt-4 px-6 py-2 bg-purple-600/20 text-purple-400 border border-purple-500 rounded-full hover:bg-purple-600 hover:text-white transition-colors">
              Carica il tuo primo meme!
            </button>
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-zinc-900">
            {memes.map(meme => (
              <div key={meme.id} className="snap-center shrink-0 w-[85vw] sm:w-[350px]">
                <MemeCard meme={meme} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;