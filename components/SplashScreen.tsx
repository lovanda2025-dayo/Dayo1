
import React, { useEffect } from 'react';
import { MatchIcon } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // Exibir por 2 segundos

    return () => clearTimeout(timer); // Limpar o timer na desmontagem do componente
  }, [onFinish]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black" 
      role="status"
      aria-label="Carregando aplicativo Flame Match"
    >
      <div className="w-24 h-24 flex items-center justify-center animate-pulse">
        <MatchIcon />
      </div>
    </div>
  );
};

export default SplashScreen;
