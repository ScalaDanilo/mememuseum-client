import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ChevronDown, X, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';

const Upload = () => {
  const navigate = useNavigate();

  // Stati del form
  const [imageFile, setImageFile] = useState(null); // Il File reale da inviare
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Stati per i Tag
  const [searchTag, setSearchTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]); // Arrivano dal DB
  const [selectedTags, setSelectedTags] = useState([]); // Ora salveremo interi oggetti {id, name}
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Cerca i tag dinamicamente sul server quando l'utente digita
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get(`/tags?search=${searchTag}`);
        // Rimuoviamo dalla tendina i tag che l'utente ha già selezionato
        const filtered = response.data.filter(
          tag => !selectedTags.some(selected => selected.id === tag.id)
        );
        setAvailableTags(filtered);
      } catch (error) {
        console.error("Errore nel recupero dei tag:", error);
      }
    };
    fetchTags();
  }, [searchTag, selectedTags]);

  // Gestione click fuori dal dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Salviamo il file per FormData
      setImagePreview(URL.createObjectURL(file)); // Salviamo l'URL per l'anteprima
    }
  };

  const handleAddTag = (tagObject) => {
    setSelectedTags([...selectedTags, tagObject]);
    setSearchTag('');
    setIsDropdownOpen(false);
  };

  const handleRemoveTag = (tagIdToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagIdToRemove));
  };

  // --- SUBMIT: INVIO AL BACKEND ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !title) return alert("Inserisci titolo e immagine!");

    setIsLoading(true);

    // Essendo un file (Multer), dobbiamo usare FormData, NON un JSON standard!
    const formData = new FormData();
    formData.append('title', title);
    if (description) formData.append('description', description);
    formData.append('image', imageFile); // 'image' deve corrispondere a quello configurato in Multer nel backend
    
    // Il backend si aspetta un array di ID (tagIds)
    const tagIds = selectedTags.map(tag => tag.id);
    if (tagIds.length > 0) {
      formData.append('tagIds', JSON.stringify(tagIds)); // Convertiamo in stringa, il backend farà .split(',')
    }

    try {
      await api.post('/memes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/'); // Rimanda alla home se il caricamento ha successo
    } catch (error) {
      console.error("Errore caricamento:", error);
      alert(error.response?.data?.error || "Errore durante il caricamento del meme.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
          Condividi il tuo disagio
        </h1>
        <p className="text-gray-400 mt-2 font-medium">Carica il tuo meme e aggiungi i tag giusti.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* SINISTRA: Upload Immagine */}
          <div className="w-full md:w-1/2">
            <label 
              className={`
                flex flex-col items-center justify-center w-full aspect-square md:aspect-[4/5] 
                rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden relative
                ${imagePreview 
                  ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                  : 'border-zinc-700 hover:border-purple-500 hover:bg-purple-900/10'
                }
              `}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white font-bold drop-shadow-md flex items-center gap-2">
                      <ImageIcon size={20}/> Cambia Immagine
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                  <UploadCloud className="w-16 h-16 mb-4 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-bounce" />
                  <p className="mb-2 text-lg font-bold text-white">Clicca per caricare</p>
                  <p className="text-sm">PNG, JPG o GIF</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!imagePreview} />
            </label>
          </div>

          {/* DESTRA: Testi e Tag */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Categoria / Tag</label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cerca un tag (es. react, black humor)..."
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full px-4 py-3 bg-zinc-900 text-white placeholder-gray-500 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Tendina Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-20 w-full mt-2 bg-zinc-800 border border-purple-500/50 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="flex flex-wrap gap-2 p-3 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-zinc-900">
                    {availableTags.length > 0 ? (
                      availableTags.map(tag => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="px-3 py-1.5 bg-zinc-950 border border-purple-500/30 text-gray-300 rounded-md text-sm hover:bg-purple-600 hover:text-white transition-all font-medium"
                        >
                          #{tag.name} {/* Aggiunto il cancelletto qui */}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm w-full text-center py-2">
                        Nessun tag trovato per "{searchTag}"
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tag Selezionati (pillole) */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedTags.map(tag => (
                    <span key={tag.id} className="flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/50 rounded-full text-sm font-bold shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                      #{tag.name} {/* Aggiunto il cancelletto qui */}
                      <button type="button" onClick={() => handleRemoveTag(tag.id)} className="hover:text-white transition-colors ml-1">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Titolo del Meme</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Un titolo ad effetto..."
                className="w-full px-4 py-3 bg-zinc-900 text-white placeholder-gray-500 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                required
              />
            </div>

            <div className="flex-grow flex flex-col">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Descrizione (Opzionale)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Spiega il disagio dietro questo capolavoro..."
                className="w-full flex-grow min-h-[150px] px-4 py-3 bg-zinc-900 text-white placeholder-gray-500 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all resize-none"
              />
            </div>

          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button 
            type="submit"
            disabled={isLoading}
            className={`px-10 py-4 bg-purple-600 text-white text-lg font-bold rounded-xl transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]'}`}
          >
            {isLoading ? 'Caricamento in corso...' : 'Crea Meme'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Upload;