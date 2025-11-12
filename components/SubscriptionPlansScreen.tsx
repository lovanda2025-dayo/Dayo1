import React from 'react';
import { ArrowLeftIcon } from '../constants'; // Import the ArrowLeftIcon

interface SubscriptionPlansScreenProps {
  onFinish: () => void;
  onBack: () => void; // New prop for back navigation
}

const SubscriptionPlansScreen: React.FC<SubscriptionPlansScreenProps> = ({ onFinish, onBack }) => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-start bg-black p-4 animate-fade-in" style={{ animationDuration: '0.5s' }}>
      {/* Scrollable Content */}
      <div className="flex-grow w-full max-w-md p-4 overflow-y-auto custom-scrollbar pb-24">
        {/* Header - agora dentro da área de rolagem */}
        <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center flex-shrink-0 mb-4">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 transition-colors duration-200 p-1 mr-4"
            aria-label="Voltar para a tela anterior"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-extrabold text-gradient drop-shadow-lg text-center flex-grow" style={{ fontFamily: "'Yeseva One', cursive" }}>
            Planos de Subscrição
          </h1>
        </div>

        <p className="text-white text-lg text-center mt-4 mb-8 px-4 opacity-90">
          Escolhe o plano certo para ti e desfruta de todas as vantagens de conectar-te com novas pessoas.
        </p>

        <div className="w-full max-w-sm flex flex-col space-y-6 mb-8 mx-auto">
          {/* Plano SANZALA */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold text-gradient mb-4" style={{ fontFamily: "'Yeseva One', cursive" }}>
              Plano SANZALA
            </h2>
            <ul className="text-white text-base leading-relaxed space-y-2 mb-4">
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Chat (quando der match): só texto</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Likes/Deslikes ilimitados</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>3 comentários anónimos por dia (texto)</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Filtros: só género + idade</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>1 mensagem pré-match por semana</li>
            </ul>
            <button
              onClick={onFinish}
              className="w-full py-3 rounded-full bg-white/10 border border-white/20 text-white text-lg font-semibold hover:bg-white/20 transition-all transform active:scale-95"
              aria-label="Continuar com o Plano Sanzala"
            >
              Continuar
            </button>
          </div>

          {/* Plano VIP */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold text-gradient mb-4" style={{ fontFamily: "'Yeseva One', cursive" }}>
              Plano VIP
            </h2>
            <ul className="text-white text-base leading-relaxed space-y-2 mb-4">
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Chat (quando der match): texto + áudio</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Likes/Deslikes ilimitados</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>7 comentários anónimos/dia (texto)</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Filtros completos</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Recuar perfil (arrastar para baixo)</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>3 mensagens pré-match/semana</li>
            </ul>
            <p className="text-white text-2xl font-bold mt-4 mb-4">1500 Kz/mês</p>
            <button
              onClick={onFinish}
              className="w-full py-3 rounded-full bg-gradient-to-br from-[#ff0800] to-[#ff9900] text-white text-lg font-semibold shadow-lg hover:from-[#ff9900] hover:to-[#ff0800] transition-all transform active:scale-95"
              aria-label="Selecionar Plano VIP"
            >
              Selecionar Plano
            </button>
          </div>

          {/* Plano PREMIUM */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold text-gradient mb-4" style={{ fontFamily: "'Yeseva One', cursive" }}>
              Plano PREMIUM
            </h2>
            <ul className="text-white text-base leading-relaxed space-y-2 mb-4">
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Chat (quando der match): texto + áudio + foto</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Likes/Deslikes ilimitados</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Comentários anónimos ilimitados</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Filtros completos</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Recuar perfil (arrastar para baixo)</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Favoritar perfis</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Mensagens pré-match ilimitadas</li>
              <li><span className="fi fi-check text-green-400 mr-2" aria-hidden="true"></span>Desbloquear identidade de quem comentou anonimamente</li>
            </ul>
            <p className="text-white text-2xl font-bold mt-4 mb-4">3000 Kz/mês</p>
            <button
              onClick={onFinish}
              className="w-full py-3 rounded-full bg-gradient-to-br from-[#ff0800] to-[#ff9900] text-white text-lg font-semibold shadow-lg hover:from-[#ff9900] hover:to-[#ff0800] transition-all transform active:scale-95"
              aria-label="Selecionar Plano Premium"
            >
              Selecionar Plano
            </button>
          </div>

          {/* Extras (Compra Avulsa) */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-4" style={{ fontFamily: "'Yeseva One', cursive" }}>
              Extras (Compra Avulsa)
            </h2>
            <p className="text-white text-2xl font-bold mb-4">10 Kz/Batida</p>
            <div className="text-white text-base leading-relaxed space-y-1 mb-6">
              <p className="font-semibold">Custo por interação (chat):</p>
              <ul className="ml-4 list-disc list-inside">
                <li>Texto = 1 batida</li>
                <li>Áudio = 2 batidas</li>
                <li>Foto = 3 batidas</li>
              </ul>
            </div>
            <button
              onClick={onFinish}
              className="w-full py-3 rounded-full bg-gradient-to-br from-[#ff0800] to-[#ff9900] text-white text-lg font-semibold shadow-lg hover:from-[#ff9900] hover:to-[#ff0800] transition-all transform active:scale-95"
              aria-label="Comprar Batidas"
            >
              Comprar Batidas
            </button>
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

export default SubscriptionPlansScreen;