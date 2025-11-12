import React, { useState, useCallback, useRef } from 'react';
import { ArrowLeftIcon } from '../constants'; // Re-use ArrowLeftIcon

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

// Helper component for PIN input with individual digit boxes - copied from RegistrationScreen
const PinInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  isError?: boolean;
}> = ({ value, onChange, ariaLabel, isError = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-[200px]" onClick={handleContainerClick} aria-label={ariaLabel}>
      <input
        ref={inputRef}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={value}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer text-transparent"
        autoComplete="new-password" // Helps with browser autofill for new PIN
      />
      <div className="flex justify-between gap-2" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-16 flex items-center justify-center rounded-xl text-3xl font-bold
                        bg-white/10 backdrop-blur-lg border ${isError ? 'border-red-400' : 'border-white/20'}
                        shadow-inner text-white transition-colors duration-200`}
          >
            {value[i] ? '•' : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onLogout, onDeleteAccount }) => {
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);

  const isPinMismatch = newPin.length === 4 && confirmNewPin.length === 4 && newPin !== confirmNewPin;
  const isPinComplete = newPin.length === 4 && confirmNewPin.length === 4;
  const canSavePin = isPinComplete && !isPinMismatch;

  const handlePinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, field: 'newPin' | 'confirmNewPin') => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      if (field === 'newPin') setNewPin(value);
      else setConfirmNewPin(value);
    }
  }, []);

  const handleSavePin = useCallback(() => {
    if (canSavePin) {
      console.log('PIN salvo:', newPin);
      alert('PIN atualizado com sucesso!');
      setNewPin('');
      setConfirmNewPin('');
      // In a real app, send to backend
    }
  }, [newPin, canSavePin]);

  const handleDeleteAccount = useCallback(() => {
    if (window.confirm('Tem certeza que deseja excluir/desativar sua conta? Esta ação não pode ser desfeita.')) {
      console.log('Conta excluída/desativada');
      onDeleteAccount(); // Placeholder for actual logic
    }
  }, [onDeleteAccount]);

  const handleLogout = useCallback(() => {
    if (window.confirm('Tem certeza que deseja terminar sua sessão?')) {
      console.log('Sessão terminada');
      onLogout(); // Placeholder for actual logic
    }
  }, [onLogout]);

  const sectionClass = "bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg mb-6";
  const titleClass = "text-2xl font-bold text-gradient mb-4";
  const primaryButtonClass = "w-full py-4 px-6 rounded-full text-white text-xl font-semibold shadow-lg transition-all duration-300 ease-in-out transform active:scale-95";

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-start bg-black p-4 animate-fade-in" style={{ animationDuration: '0.5s' }}>
      <div className="flex-grow w-full max-w-md p-4 overflow-y-auto custom-scrollbar pb-24">
        {/* Header */}
        <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center flex-shrink-0 mb-4 sticky top-0">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 transition-colors duration-200 p-1 mr-4"
            aria-label="Voltar para o perfil"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg text-center flex-grow" style={{ fontFamily: "'Yeseva One', cursive" }}>
            Definições
          </h1>
        </div>

        {/* Alterar PIN */}
        <section className={`${sectionClass} mt-4`}>
          <h2 className={titleClass}>Alterar PIN</h2>
          <div className="flex flex-col space-y-4 items-center">
            <p className="text-white text-lg font-semibold" id="new-pin-label">Novo PIN</p>
            <PinInput
              value={newPin}
              onChange={(e) => handlePinChange(e, 'newPin')}
              ariaLabel="Inserir novo PIN de 4 dígitos"
              isError={isPinMismatch}
            />
            <p className="text-white text-lg font-semibold mt-4" id="confirm-new-pin-label">Confirmar Novo PIN</p>
            <PinInput
              value={confirmNewPin}
              onChange={(e) => handlePinChange(e, 'confirmNewPin')}
              ariaLabel="Confirmar novo PIN de 4 dígitos"
              isError={isPinMismatch}
            />
            {isPinMismatch && (
              <p className="text-red-400 text-sm mt-2" role="alert">Os PINs não correspondem!</p>
            )}
            {!isPinComplete && (newPin.length > 0 || confirmNewPin.length > 0) && (
              <p className="text-yellow-400 text-sm mt-2" role="alert">O PIN deve ter 4 dígitos.</p>
            )}
          </div>
          <button
            onClick={handleSavePin}
            disabled={!canSavePin}
            className={`${primaryButtonClass} mt-6 ${canSavePin ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] hover:from-[#ff9900] hover:to-[#ff0800]' : 'bg-gray-600 opacity-70 cursor-not-allowed'}`}
            aria-label="Guardar novo PIN"
          >
            Guardar PIN
          </button>
        </section>

        {/* Notificações Push */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Notificações Push</h2>
          <div className="flex items-center justify-between">
            <span className="text-white text-lg">Ativar Notificações</span>
            <label htmlFor="pushToggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="pushToggle"
                className="sr-only peer"
                checked={pushNotificationsEnabled}
                onChange={() => {
                  setPushNotificationsEnabled(prev => !prev);
                  console.log('Notificações push:', !pushNotificationsEnabled ? 'ativadas' : 'desativadas');
                }}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            </label>
          </div>
        </section>

        {/* Gestão de Conta */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Gestão de Conta</h2>
          <button
            onClick={handleDeleteAccount}
            className={`${primaryButtonClass} mb-4 !bg-red-700 hover:!bg-red-800`}
            aria-label="Excluir ou desativar conta"
          >
            Excluir/Desativar Conta
          </button>
          <button
            onClick={handleLogout}
            className={`${primaryButtonClass} !bg-gray-700 hover:!bg-gray-800`}
            aria-label="Terminar sessão"
          >
            Terminar Sessão (Logout)
          </button>
        </section>
      </div>

      {/* Style definitions (copied for self-containment) */}
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

export default SettingsScreen;