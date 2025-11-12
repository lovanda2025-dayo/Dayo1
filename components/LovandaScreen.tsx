import React from 'react';

interface LovandaScreenProps {
  onEnter: () => void;
  onRegister: () => void;
}

const LovandaScreen: React.FC<LovandaScreenProps> = ({ onEnter, onRegister }) => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black p-4">
      <h1 className="text-7xl font-extrabold text-gradient mb-12 drop-shadow-lg" style={{ fontFamily: "'Yeseva One', cursive" }}>
        Lovanda
      </h1>

      <div className="mb-8">
        <img
          src="https://picsum.photos/seed/couple/400/400"
          alt="Casal"
          className="w-80 h-80 object-cover rounded-2xl"
        />
      </div>

      <p className="text-white text-xl text-center mb-12 px-4 opacity-90">
        Encontre seu par perfeito. Onde conexões reais florescem.
      </p>

      <div className="flex flex-col space-y-6 w-full max-w-sm">
        <button
          onClick={onEnter}
          className="w-[85%] mx-auto py-4 px-6 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-xl font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 ease-in-out transform active:scale-95 active:bg-gradient-to-br active:from-[#ff0800] active:to-[#ff9900] active:border-transparent"
          aria-label="Entrar no aplicativo"
        >
          Entrar
        </button>
        <button
          onClick={onRegister}
          className="w-[85%] mx-auto py-4 px-6 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-xl font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 ease-in-out transform active:scale-95 active:bg-gradient-to-br active:from-[#ff0800] active:to-[#ff9900] active:border-transparent"
          aria-label="Registrar nova conta"
        >
          Registrar
        </button>
      </div>
      <style>{`
          .text-gradient { background: linear-gradient(to right, #ff0800, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
      `}</style>
    </div>
  );
};

export default LovandaScreen;