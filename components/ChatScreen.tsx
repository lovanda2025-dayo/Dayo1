import React, { useCallback } from 'react';
import type { UserProfile } from '../types';

interface ChatScreenProps {
  matchesList: UserProfile[];
  onOpenChat: (profile: UserProfile) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ matchesList, onOpenChat }) => {
  const getDummyLastMessage = useCallback((profileId: number) => {
    // Simula uma última mensagem para exibir na lista de chats
    switch (profileId) {
      case 1: return 'Oi! Qual a sua trilha favorita?'; // Jessica
      case 2: return 'Terminei a nova música, quer ouvir?'; // Alex
      case 3: return 'Visitou a nova exposição de arte?'; // Maria
      case 4: return 'Meus cães adoram correr! 😂'; // David
      case 5: return 'Quais os seus próximos planos de viagem?'; // Chloe
      case 6: return 'Lendo um livro interessante...'; // Marcus
      case 7: return 'Novas receitas veganas para experimentar!'; // Sophia
      case 8: return 'Boas ondas por aqui.'; // Lucas
      default: return 'Você deu match!'; // Mensagem padrão para matches sem histórico de chat específico
    }
  }, []);

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-start animate-fade-in" style={{ animationDuration: '0.5s' }}>
      <div className="w-full max-w-md mx-auto flex flex-col items-center flex-grow pt-4 min-h-0">
        <div className="flex flex-col w-full px-4 flex-grow overflow-y-auto custom-scrollbar pb-24">
          {/* Header - agora dentro da área de rolagem */}
          <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center flex-shrink-0 mb-8">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg text-center flex-grow" style={{ fontFamily: "'Yeseva One', cursive" }}>
              Meus Chats
            </h1>
          </div>

          <div className="flex flex-col w-full flex-grow space-y-4">
            {matchesList.length > 0 ? (
              matchesList.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onOpenChat(profile)}
                  className="w-full text-left bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-lg flex items-center space-x-4
                         hover:bg-white/20 transition-all duration-200 ease-in-out transform active:scale-98"
                  aria-label={`Abrir chat com ${profile.name}`}
                >
                  <img
                    src={profile.imageUrls[0]}
                    alt={profile.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/50 flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-gradient" style={{ fontFamily: "'Yeseva One', cursive" }}>{profile.name}</h2>
                    <p className="text-white/80 text-sm mt-1 truncate">{getDummyLastMessage(profile.id)}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow py-10 text-center px-4">
                <p className="text-white/70 text-2xl font-semibold mb-4">
                  Parece que está um pouco vazio por aqui...
                </p>
                <p className="text-white/70 text-lg">
                  Continue deslizando pelos perfis para encontrar o seu próximo match!
                </p>
              </div>
            )}
          </div>
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
      `}</style>
    </div>
  );
};

export default ChatScreen;