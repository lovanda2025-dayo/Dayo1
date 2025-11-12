
import React, { useState } from 'react';
import { SupportIcon } from '../constants'; // Import the new icon

interface LoginScreenProps {
  onFinish: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onFinish }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pin, setPin] = useState('');

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite apenas números e limita a 4 dígitos
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  const handleSupportClick = () => {
    console.log('Botão de suporte clicado! Entrar em contato com o suporte para redefinir o PIN.');
    // Aqui você pode adicionar lógica para abrir um modal de suporte, navegar para uma página de contato, etc.
  };

  const isFormValid = firstName.trim() !== '' && lastName.trim() !== '' && pin.length === 4;

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black p-4">
      <h1 className="text-5xl font-extrabold text-white mb-12 drop-shadow-lg text-center" style={{ fontFamily: "'Yeseva One', cursive" }}>
        Tudo bem? É bom ter você de volta
      </h1>

      <div className="flex flex-col space-y-6 w-full max-w-sm mb-12">
        <input
          type="text"
          placeholder="Primeiro nome"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full py-4 px-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 ease-in-out"
          aria-label="Primeiro nome"
        />
        <input
          type="text"
          placeholder="Último nome"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full py-4 px-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 ease-in-out"
          aria-label="Último nome"
        />
        <input
          type="password" // Usar password para esconder os dígitos
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          placeholder="PIN de 4 dígitos"
          value={pin}
          onChange={handlePinChange}
          className="w-full py-4 px-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 ease-in-out"
          aria-label="PIN de 4 dígitos"
        />
      </div>

      <button
        onClick={onFinish}
        disabled={!isFormValid}
        className={`w-[85%] mx-auto py-4 px-6 rounded-full text-white text-xl font-semibold shadow-lg transition-all duration-300 ease-in-out transform active:scale-95
          ${isFormValid ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] hover:from-[#ff9900] hover:to-[#ff0800]' : 'bg-gray-600 opacity-70 cursor-not-allowed'}
        `}
        aria-label="Continuar"
      >
        Continuar
      </button>

      {/* Support button and text */}
      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={handleSupportClick}
          className="w-16 h-16 rounded-full flex items-center justify-center
                     bg-white/10 backdrop-blur-lg border border-white/20
                     shadow-lg text-white hover:bg-white/20 transition-all duration-200 ease-in-out active:scale-95 transform"
          aria-label="Contactar suporte para PIN"
        >
          <SupportIcon />
        </button>
        <p className="text-white text-sm mt-3 opacity-80 text-center">
          Esqueceu o seu PIN? Contacte o Suporte
        </p>
      </div>

      <style>{`
          .text-gradient { background: linear-gradient(to right, #ff0800, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
      `}</style>
    </div>
  );
};

export default LoginScreen;
