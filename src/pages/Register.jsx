import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Le due password non combaciano.');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_?+-]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return setError('Password non conforme alle regole di sicurezza.');
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      
      window.dispatchEvent(new Event('authChange'));
      
      navigate('/'); 
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Si è verificato un errore di connessione col server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 min-h-full rounded-xl">
      <div className="bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-500/50 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">Benvenuto su MemeMuseum</h1>
          <p className="text-gray-400 text-sm font-medium">l'unica piattaforma per mostrare il tuo black-humor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Il tuo nome meme" className="w-full px-4 py-3 bg-zinc-950 text-white placeholder-gray-600 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="La tua password sicura" className="w-full pl-4 pr-12 py-3 bg-zinc-950 text-white placeholder-gray-600 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-400 hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.8)] transition-all">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Ripeti Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Conferma la password" className="w-full pl-4 pr-12 py-3 bg-zinc-950 text-white placeholder-gray-600 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all" required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-400 hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.8)] transition-all">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="text-center text-red-500 text-sm font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse">{error}</div>}

          <button type="submit" disabled={isLoading} className={`w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)]'}`}>
            {isLoading ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Se hai già un account <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.8)] transition-all">clicca qui per accedere</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;