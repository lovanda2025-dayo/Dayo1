import React from 'react';
import type { UserProfile } from '../types';

interface LikesScreenProps {
  likedByProfiles: UserProfile[];
  anonymousComments: string[];
  favoritedProfiles: UserProfile[];
  archivedProfiles: UserProfile[];
}

const LikesScreen: React.FC<LikesScreenProps> = ({ likedByProfiles, anonymousComments, favoritedProfiles, archivedProfiles }) => {
  const ProfileCard: React.FC<{ profile: UserProfile, label: string }> = ({ profile, label }) => (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-lg border border-white/20">
      <img src={profile.imageUrls[0]} alt={profile.name} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
        <span className="text-white text-lg font-bold drop-shadow-md">{profile.name}</span>
      </div>
      <span className="absolute top-2 left-2 text-xs text-white/80 bg-black/50 px-2 py-1 rounded-full">{label}</span>
    </div>
  );

  const CommentBubble: React.FC<{ comment: string }> = ({ comment }) => (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-md text-white text-base leading-relaxed break-words">
      <p className="opacity-90">{comment}</p>
      <p className="text-sm text-white/70 mt-2 italic">- Anónimo</p>
    </div>
  );

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-start animate-fade-in" style={{ animationDuration: '0.5s' }}>
      {/* Scrollable Content */}
      <div className="flex-grow w-full max-w-md p-4 overflow-y-auto custom-scrollbar pb-24">
        {/* Header - agora dentro da área de rolagem */}
        <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center flex-shrink-0 mb-8">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg text-center flex-grow" style={{ fontFamily: "'Yeseva One', cursive" }}>
            Curtidas & Mais
          </h1>
        </div>

        {/* Section: Quem Curtiu Meu Perfil */}
        <section className="mb-10 mt-4"> {/* Added mt-4 to the first section */}
          <h2 className="text-3xl font-bold text-gradient mb-6 drop-shadow-lg" style={{ fontFamily: "'Yeseva One', cursive" }}>
            🔥 Quem Curtiu Meu Perfil
          </h2>
          {likedByProfiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {likedByProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} label="Curtiu Você" />
              ))}
            </div>
          ) : (
            <p className="text-white/70 text-center text-lg mt-4">Ninguém curtiu seu perfil ainda. Continue deslizando!</p>
          )}
        </section>

        {/* Section: Comentários Anónimos */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gradient mb-6 drop-shadow-lg" style={{ fontFamily: "'Yeseva One', cursive" }}>
            💬 Comentários Anónimos
          </h2>
          {anonymousComments.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {anonymousComments.map((comment, index) => (
                <CommentBubble key={index} comment={comment} />
              ))}
            </div>
          ) : (
            <p className="text-white/70 text-center text-lg mt-4">Nenhum comentário anónimo recebido ainda.</p>
          )}
        </section>

        {/* Section: Perfis Favoritados/Arquivados */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gradient mb-6 drop-shadow-lg" style={{ fontFamily: "'Yeseva One', cursive" }}>
            🌟 Meus Favoritos & Arquivados
          </h2>
          {(favoritedProfiles.length > 0 || archivedProfiles.length > 0) ? (
            <div className="grid grid-cols-2 gap-4">
              {favoritedProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} label="Favorito" />
              ))}
              {archivedProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} label="Arquivado" />
              ))}
            </div>
          ) : (
            <p className="text-white/70 text-center text-lg mt-4">Você ainda não favoritou ou arquivou nenhum perfil.</p>
          )}
        </section>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in forwards; }
        .text-gradient { background: linear-gradient(to right, #ff0800, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
        /* Custom scrollbar for better aesthetics */
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;  /* Largura para Webkit */
          background: transparent;  /* Fundo transparente */
        }
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default LikesScreen;