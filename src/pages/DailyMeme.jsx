import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DailyMeme = () => {
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/memes/daily')
      .then(response => {
        navigate(`/meme/${response.data.id}`, { replace: true });
      })
      .catch(error => {
        console.error("Errore recupero meme del giorno", error);
        alert("Ops, oggi il curatore del museo è in sciopero! Riprova più tardi.");
        navigate('/', { replace: true });
      });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="text-purple-400 font-bold animate-pulse text-2xl drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
        ✨ Scelta del curatore in corso... ✨
      </div>
    </div>
  );
};

export default DailyMeme;