import React, { useState } from 'react';
import { EditIcon, ArrowLeftIcon } from '../constants'; // Removed SettingsIcon
import type { UserProfile } from '../types';

interface UserProfileScreenProps {
  currentUserProfile: UserProfile; // Pass the current user's profile
  onBack: () => void;
  onEditProfile: () => void;
  onManageSubscription: () => void;
  onBuyCurrency: () => void;
  onOpenSettings: () => void; // New prop for settings
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  currentUserProfile,
  onBack,
  onEditProfile,
  onManageSubscription,
  onBuyCurrency,
  onOpenSettings, // Destructure new prop
}) => {
  // Dummy data for profile statistics and currency (these would ideally come from currentUserProfile or a global state)
  const [currentPlan, setCurrentPlan] = useState('Plano SANZALA (Gratuito)');
  const [likesReceived, setLikesReceived] = useState(125);
  const [matchesCount, setMatchesCount] = useState(32);
  const [dislikesReceived, setDislikesReceived] = useState(18);
  const [receivedComments, setReceivedComments] = useState(7);
  const [archivedCount, setArchivedCount] = useState(3);

  const [batidas, setBatidas] = useState(50);

  const handleBuyBatidas = () => {
    console.log('Comprar Batidas clicado');
    setBatidas(prev => prev + 100); // Simulate purchase
    onBuyCurrency(); // Placeholder
  };

  const handleSettingsClick = () => {
    console.log('Botão de Definições clicado!');
    onOpenSettings(); // Call the handler from App.tsx
  };

  const sectionClass = "bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg mb-6";
  const titleClass = "text-2xl font-bold text-white mb-4"
  const buttonClass = "w-full py-3 rounded-full bg-white/10 border border-white/20 text-white text-lg font-semibold hover:bg-white/20 transition-all transform active:scale-95 flex items-center justify-center space-x-2";

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-start animate-fade-in" style={{ animationDuration: '0.5s' }}>
      {/* Scrollable Content */}
      <div className="flex-grow w-full max-w-md p-4 overflow-y-auto custom-scrollbar pb-24">
        {/* Header - agora dentro da área de rolagem */}
        <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center flex-shrink-0 mb-4">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 transition-colors duration-200 p-1 mr-4"
            aria-label="Voltar para a tela de perfis"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg text-center flex-grow" style={{ fontFamily: "'Yeseva One', cursive" }}>
            Meu Perfil
          </h1>
        </div>

        {/* Profile Summary */}
        <section className={`${sectionClass} flex flex-col items-center mt-4`}> {/* Added mt-4 to the first section */}
          <img
            src={currentUserProfile.imageUrls[0]} // Use actual user profile image
            alt="Foto do meu perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-white/50 mb-4"
            loading="lazy"
          />
          <h2 className="text-3xl font-bold text-gradient mb-2" style={{ fontFamily: "'Yeseva One', cursive" }}>
            {currentUserProfile.name}, {currentUserProfile.age}
          </h2>
          <p className="text-white/80 text-center mb-4 px-4 max-w-sm">{currentUserProfile.bio}</p>
          <button onClick={onEditProfile} className={`${buttonClass} mt-4 !bg-gradient-to-br !from-[#ff0800] !to-[#ff9900] !border-none !text-white hover:!from-[#ff9900] hover:!to-[#ff0800]`}>
            <EditIcon />
            <span>Editar Perfil</span>
          </button>
        </section>

        {/* Profile Statistics */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Estatísticas do Perfil</h2>
          <ul className="text-white text-base space-y-2">
            <li><span role="img" aria-label="like">👍</span> Likes Recebidos: {likesReceived}</li>
            <li><span role="img" aria-label="match">❤️‍🔥</span> Matches: {matchesCount}</li>
            <li><span role="img" aria-label="dislike">👎</span> Dislikes Recebidos: {dislikesReceived}</li>
            <li><span role="img" aria-label="comment">💬</span> Comentários Recebidos: {receivedComments}</li>
            <li><span role="img" aria-label="archived">📁</span> Perfis Arquivados: {archivedCount}</li>
          </ul>
        </section>

        {/* Subscription Management */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Meu Plano de Subscrição</h2>
          <p className="text-white text-lg mb-4">Plano Atual: <span className="font-semibold text-gradient">{currentPlan}</span></p>
          <button onClick={onManageSubscription} className={`${buttonClass} mb-3`}>
            <span>Gerir Plano</span>
          </button>
        </section>

        {/* Currency/Boosts */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Meus Batidas</h2>
          <div className="flex justify-between items-center text-white text-lg mb-4">
            <span>Batidas: <span className="font-bold text-gradient">{batidas}</span></span>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleBuyBatidas} className={buttonClass}>
              <span>Comprar Batidas</span>
            </button>
          </div>
        </section>

        {/* Settings Button - Pill shape at the bottom */}
        <div className="w-full flex justify-center mt-6 mb-8">
            <button
                onClick={handleSettingsClick}
                className="w-[85%] py-4 px-6 rounded-full bg-gradient-to-br from-[#ff0800] to-[#ff9900] text-white text-xl font-semibold shadow-lg hover:from-[#ff9900] hover:to-[#ff0800] transition-all duration-300 ease-in-out transform active:scale-95"
                aria-label="Abrir definições"
            >
                Definições
            </button>
        </div>

      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in forwards; }
        .text-gradient { background: linear-gradient(to right, #ff0800, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .text-gradient-hover:hover {
          background: linear-gradient(to right, #ff9900, #ff0800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default UserProfileScreen;