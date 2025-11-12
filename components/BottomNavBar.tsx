import React from 'react';
import { ExploreIcon, ChatsIcon, LikesIcon, ProfileIcon, MatchIcon } from '../constants';

interface BottomNavBarProps {
  onExploreClick: () => void;
  onMatchButtonClick: () => void; // Central button now always goes to profiles view
  onLikesClick: () => void; // Now opens the LikesScreen
  onChatsClick: () => void; // Now opens the ChatScreen
  onProfileClick: () => void; // New prop for Profile icon
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onExploreClick, onMatchButtonClick, onLikesClick, onChatsClick, onProfileClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/30 backdrop-blur-xl z-20">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {/* Primeiro Ícone: Explorar */}
        <button 
          onClick={onExploreClick} 
          className="text-gray-400 hover:text-white transition-all transform active:scale-90 duration-150" 
          aria-label="Explorar Perfis"
        >
          <ExploreIcon />
        </button>
        
        {/* Segundo Ícone: Likes (Estrela) */}
        <button 
          onClick={onLikesClick} 
          className="text-gray-400 hover:text-white transition-all transform active:scale-90 duration-150" 
          aria-label="Ver Curtidas e Mais"
        >
          <LikesIcon />
        </button>
        
        {/* Botão Central: Deu Match / Ver Perfis */}
        <button 
          onClick={onMatchButtonClick} 
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff0800] to-[#ff9900] flex items-center justify-center -mt-8 shadow-lg shadow-orange-700/40 border-4 border-gray-800 transform hover:scale-105 active:scale-95 transition-transform duration-200" 
          aria-label="Voltar para a tela de perfis"
        >
            <MatchIcon />
        </button>
        
        {/* Quarto Ícone: Chats (Balão de Fala) */}
        <button 
          onClick={onChatsClick} 
          className="text-gray-400 hover:text-white transition-all transform active:scale-90 duration-150" 
          aria-label="Ver Chats"
        >
          <ChatsIcon />
        </button>
        
        {/* Quinto Ícone: Ver Perfil */}
        <button 
          onClick={onProfileClick} // New onClick for profile icon
          className="text-gray-400 hover:text-white transition-all transform active:scale-90 duration-150" 
          aria-label="Ver Perfil"
        >
          <ProfileIcon />
        </button>
      </div>
    </div>
  );
};

export default BottomNavBar;