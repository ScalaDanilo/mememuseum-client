import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DailyMeme = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Appena si apre la pagina /daily, chiediamo al backend chi ha vinto oggi
    api.get('/memes/daily')
      .then(response => {
        // Preso! Ora ti reindirizzo alla SUA pagina di dettaglio.
        // { replace: true } serve per evitare che, cliccando "Indietro" nel browser,
        // l'utente torni in questa schermata di caricamento creando un loop infinito!
        navigate(`/meme/${response.data.id}`, { replace: true });
      })
      .catch(error => {
        console.error("Errore recupero meme del giorno", error);
        alert("Ops, oggi il curatore del museo è in sciopero! Riprova più tardi.");
        navigate('/', { replace: true }); // Torniamo alla home in caso di errore
      });
  }, [navigate]);

  // Mentre fa la richiesta, mostriamo un bel caricamento al centro dello schermo
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="text-purple-400 font-bold animate-pulse text-2xl drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
        ✨ Scelta del curatore in corso... ✨
      </div>
    </div>
  );
};

export default DailyMeme;