import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Importate le icone
import api from '../api/axios'; // Assicurati che il percorso sia corretto

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // Stato per gestire la visibilità della password
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Pulisce l'errore se l'utente inizia a scrivere di nuovo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Chiamata reale al backend
      const response = await api.post('/auth/login', {
        username: formData.username,
        password: formData.password
      });

      // Salviamo il token nel localStorage
      localStorage.setItem('token', response.data.token);
      
      // Reindirizziamo l'utente alla home
      navigate('/'); 

    } catch (err) {
      // Cattura l'errore "Credenziali non valide" dal backend
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Impossibile connettersi al server. Riprova più tardi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 min-h-full rounded-xl">
      <div className="bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-500/50 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
            Bentornato!
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Pronto a giudicare i nuovi meme?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Username
            </label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Il tuo username" 
              className="w-full px-4 py-3 bg-zinc-950 text-white placeholder-gray-600 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="La tua password" 
                className="w-full pl-4 pr-12 py-3 bg-zinc-950 text-white placeholder-gray-600 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-400 hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.8)] transition-all"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* MESSAGGIO DI ERRORE */}
          {error && (
            <div className="text-center text-red-500 text-sm font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)]'}`}
          >
             {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Non hai ancora un account?{' '}
          <Link to="/register" className="text-purple-400 font-bold hover:text-purple-300 hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.8)] transition-all">
            Registrati qui
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;