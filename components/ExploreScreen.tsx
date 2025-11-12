

import React from 'react';
import { RELATIONSHIP_AND_FAMILY_DESIRES, FUTURE_AND_LIFESTYLE_DESIRES } from '../constants';
// REMOVED: ArrowLeftIcon no longer needed as the back button is removed.

interface ExploreScreenProps {
  onFilterSelect: (filter: string) => void;
  // REMOVED: onBackToExplore prop no longer needed.
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onFilterSelect }) => { // MODIFIED: `onBackToExplore` removed from destructuring.
  return (
    <div className="h-full w-full bg-black p-4 flex flex-col items-center justify-start animate-fade-in" style={{ animationDuration: '0.5s' }}>
      <div className="w-full max-w-md mx-auto flex flex-col items-center flex-grow pt-4 min-h-0">
        <div className="flex flex-col w-full px-4 flex-grow overflow-y-auto custom-scrollbar pb-24">
          <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center" style={{ fontFamily: "'Yeseva One', cursive" }}>
            Descobre pessoas com os mesmos desejos de vida que tu
          </h1>

          {/* Categoria: Relacionamento e Família */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-6 drop-shadow-lg" style={{ fontFamily: "'Yeseva One', cursive" }}>
              🩷 Relacionamento e Família
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {RELATIONSHIP_AND_FAMILY_DESIRES.map((desire) => (
                <button
                  key={desire}
                  onClick={() => onFilterSelect(desire)}
                  className="aspect-square flex items-center justify-center text-center p-4 rounded-xl text-white text-base font-semibold selection-glassmorphism hover:bg-white/20 transition-all duration-200 ease-in-out transform active:scale-95 active:bg-gradient-to-br active:from-[#ff0800] active:to-[#ff9900] active:border-transparent active:shadow-lg"
                  aria-label={`Filtrar por ${desire}`}
                >
                  {desire}
                </button>
              ))}
            </div>
          </section>

          {/* Categoria: Futuro e Estilo de Vida */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-6 drop-shadow-lg" style={{ fontFamily: "'Yeseva One', cursive" }}>
              💼 Futuro e Estilo de Vida
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {FUTURE_AND_LIFESTYLE_DESIRES.map((desire) => (
                <button
                  key={desire}
                  onClick={() => onFilterSelect(desire)}
                  className="aspect-square flex items-center justify-center text-center p-4 rounded-xl text-white text-base font-semibold selection-glassmorphism hover:bg-white/20 transition-all duration-200 ease-in-out transform active:scale-95 active:bg-gradient-to-br active:from-[#ff0800] to-[#ff9900] active:border-transparent active:shadow-lg"
                  aria-label={`Filtrar por ${desire}`}
                >
                  {desire}
                </button>
              ))}
            </div>
          </section>

          {/* REMOVED: "Ver todos os perfis" button removed as navigation is handled by BottomNavBar */}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in forwards; }
        .text-gradient { background: linear-gradient(to right, #ff0800, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
        .selection-glassmorphism {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
        }
        .selection-glassmorphism:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        /* Custom scrollbar for better aesthetics */
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;  /* Largura para Webkit */
          background: transparent;  /* Fundo transparente */
        }
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
          touch-action: pan-y; /* Força a interação de deslizar verticalmente */
          overscroll-behavior-y: contain; /* Impede o scroll chaining */
        }
      `}</style>
    </div>
  );
};

export default ExploreScreen;