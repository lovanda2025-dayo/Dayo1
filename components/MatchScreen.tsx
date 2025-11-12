import React from 'react';
import type { UserProfile } from '../types';
import { SendIcon } from '../constants'; 

interface MatchScreenProps {
  matchedProfile: UserProfile;
  onSendMessage: () => void; // Modificado para permitir a navegação para o chat
  onKeepSwiping: () => void;
}

const MatchScreen: React.FC<MatchScreenProps> = ({ matchedProfile, onSendMessage, onKeepSwiping }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
      style={{ animationDuration: '0.3s' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
      aria-describedby="match-description"
    >
      <div className="relative p-8 rounded-2xl text-center flex flex-col items-center justify-center h-full w-full max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff0800]/20 to-[#ff9900]/20 rounded-2xl opacity-50"></div>
        
        <h2 id="match-title" className="text-6xl font-extrabold text-gradient mb-8 drop-shadow-lg" style={{ fontFamily: "'Yeseva One', cursive" }}>
          DEU MATCH!
        </h2>

        <p id="match-description" className="text-white text-lg mb-10 px-4">
          Você e {matchedProfile.name} se curtiram.
        </p>

        <div className="relative flex justify-center items-center -space-x-8 mb-10">
          {/* Current user's avatar (placeholder) */}
          <img 
            src="https://picsum.photos/seed/currentuser/150/150" 
            alt="Seu perfil" 
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
            loading="lazy"
          />
          {/* Matched user's avatar */}
          <img 
            src={matchedProfile.imageUrls[0]} 
            alt={matchedProfile.name} 
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
            loading="lazy"
          />
        </div>

        <h3 className="text-white text-4xl font-bold drop-shadow-lg text-gradient mb-12" style={{ fontFamily: "'Yeseva One', cursive" }}>
          {matchedProfile.name}
        </h3>

        <div className="flex flex-col space-y-4 w-full px-4">
          <button 
            onClick={onSendMessage} 
            className="w-full py-4 px-6 rounded-full bg-gradient-to-br from-[#ff0800] to-[#ff9900] text-white text-xl font-semibold shadow-lg hover:from-[#ff9900] hover:to-[#ff0800] transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 transform active:scale-95"
          >
            <SendIcon />
            <span>Enviar Mensagem</span>
          </button>
          <button 
            onClick={onKeepSwiping} 
            className="w-full py-4 px-6 rounded-full bg-transparent border-2 border-white text-white text-xl font-semibold hover:bg-white/10 transition-all duration-300 ease-in-out transform active:scale-95"
          >
            Continuar Deslizando
          </button>
        </div>
      </div>
      <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in forwards; }
          .text-gradient { background: linear-gradient(to right, #ff0800, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
      `}</style>
    </div>
  );
};

export default MatchScreen;