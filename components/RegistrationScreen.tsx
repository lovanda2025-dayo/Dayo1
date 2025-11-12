
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ALL_LIFE_DESIRES, PlusIcon, EditIcon, TrashIcon } from '../constants'; // Importa a lista completa de desejos e os ícones

interface RegistrationScreenProps {
  onFinish: () => void;
  onBack: () => void; // Callback para voltar para a tela anterior (LovandaScreen)
}

const provinces = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte",
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte",
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
].sort();

// Helper component for PIN input with individual digit boxes
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
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer text-transparent" // Hidden but clickable, text transparent
        autoComplete="one-time-code" // Suggests OTP/PIN input for browsers
      />
      <div className="flex justify-between gap-2" aria-hidden="true"> {/* Visual representation, hidden from screen readers */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-16 flex items-center justify-center rounded-xl text-3xl font-bold
                        bg-white/10 backdrop-blur-lg border ${isError ? 'border-red-400' : 'border-white/20'}
                        shadow-inner text-white transition-colors duration-200`}
          >
            {value[i] ? '•' : ''} {/* Display bullet for entered digit */}
          </div>
        ))}
      </div>
    </div>
  );
};


const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onFinish, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7; // Incrementado para incluir a nova etapa do PIN

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    province: '',
    gender: '',
    relationshipIntention: '',
    genderInterest: '',
    lifeDesires: [] as string[],
    profilePhoto: null as string | null, // Para armazenar base64 ou URL da foto de perfil
    additionalPhotos: [] as string[], // Para armazenar base64 ou URLs de fotos adicionais
    bio: '',
    pin: '', // Novo campo para o PIN
    confirmPin: '', // Novo campo para confirmação do PIN
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'pin' | 'confirmPin') => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleOptionSelect = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[name as keyof typeof prev] as string[];
      if (currentArray.includes(value)) {
        return { ...prev, [name]: currentArray.filter((item) => item !== value) };
      } else {
        return { ...prev, [name]: [...currentArray, value] };
      }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'profilePhoto' | 'additionalPhotos', index?: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (field === 'profilePhoto') {
          setFormData((prev) => ({ ...prev, profilePhoto: base64String }));
        } else if (field === 'additionalPhotos') {
          setFormData((prev) => {
            const newPhotos = [...prev.additionalPhotos];
            if (index !== undefined && newPhotos[index]) {
              newPhotos[index] = base64String;
            } else {
              newPhotos.push(base64String);
            }
            return { ...prev, additionalPhotos: newPhotos };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalPhotos: prev.additionalPhotos.filter((_, i) => i !== index),
    }));
  };

  const isStep1Valid = useCallback(() => {
    const ageNum = parseInt(formData.age);
    return formData.firstName.trim() !== '' &&
           formData.lastName.trim() !== '' &&
           !isNaN(ageNum) && ageNum >= 18 &&
           formData.province.trim() !== '';
  }, [formData]);

  const isStep2Valid = useCallback(() => {
    return formData.gender !== '';
  }, [formData]);

  const isStep3Valid = useCallback(() => {
    return formData.relationshipIntention !== '';
  }, [formData]);

  const isStep4Valid = useCallback(() => {
    return formData.genderInterest !== '';
  }, [formData]);

  const isStep5Valid = useCallback(() => {
    return formData.lifeDesires.length > 0;
  }, [formData]);

  const isStep6Valid = useCallback(() => {
    return formData.profilePhoto !== null; // Bio is now optional
  }, [formData]);

  const isPinMismatch = formData.pin.length === 4 && formData.confirmPin.length === 4 && formData.pin !== formData.confirmPin;
  const isPinIncomplete = (formData.pin.length > 0 && formData.pin.length < 4) || (formData.confirmPin.length > 0 && formData.confirmPin.length < 4);

  const isStep7Valid = useCallback(() => {
    return formData.pin.length === 4 && formData.confirmPin.length === 4 && formData.pin === formData.confirmPin;
  }, [formData]);


  const isCurrentStepValid = useCallback(() => {
    switch (currentStep) {
      case 1: return isStep1Valid();
      case 2: return isStep2Valid();
      case 3: return isStep3Valid();
      case 4: return isStep4Valid();
      case 5: return isStep5Valid();
      case 6: return isStep6Valid();
      case 7: return isStep7Valid(); // Nova validação para a etapa 7
      default: return false;
    }
  }, [currentStep, isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid, isStep5Valid, isStep6Valid, isStep7Valid]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack(); // Se estiver na primeira etapa, volta para a LovandaScreen
    }
  };

  const renderStepContent = () => {
    const navButtons = (
      <div className="flex justify-center gap-4 w-full max-w-sm py-4 flex-shrink-0">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 py-3 px-6 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-lg font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 ease-in-out transform active:scale-95"
            aria-label="Voltar para etapa anterior"
          >
            Voltar
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
          className={`flex-1 py-3 px-6 rounded-full text-white text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform active:scale-95
            ${isCurrentStepValid() ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] hover:from-[#ff9900] hover:to-[#ff0800]' : 'bg-white/5 backdrop-blur-lg border border-white/10 text-gray-400 cursor-not-allowed'}
          `}
          aria-label={currentStep === totalSteps ? "Concluir Registro" : "Avançar para próxima etapa"}
        >
          {currentStep === totalSteps ? 'Concluir Registro' : 'Avançar'}
        </button>
      </div>
    );

    // Usa a lista completa importada de constants.tsx
    const lifeDesireOptions = ALL_LIFE_DESIRES;

    switch (currentStep) {
      case 1:
        return (
          <div className="h-full flex flex-col items-center justify-between w-full"> {/* main step container, pushes button to bottom */}
            <div className="flex flex-col items-center flex-grow justify-center w-full max-w-sm"> {/* content area, grows to fill space */}
              <h2 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg text-center" style={{ fontFamily: "'Yeseva One', cursive" }}>
                Oi, nos conte mais sobre você...
              </h2>
              <div className="flex flex-col space-y-6 w-full"> {/* inputs */}
                <input
                  type="text"
                  name="firstName"
                  placeholder="Primeiro nome"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input-glassmorphism"
                  aria-label="Primeiro nome"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Último nome"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input-glassmorphism"
                  aria-label="Último nome"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Idade (min 18)"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  className="input-glassmorphism"
                  aria-label="Idade"
                />
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="input-glassmorphism select-arrow-glassmorphism"
                  aria-label="Selecione sua Província"
                >
                  <option value="" disabled>Selecione sua Província</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            {navButtons}
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col items-center justify-between w-full"> {/* main step container */}
            <div className="h-full flex flex-col items-center justify-center w-full max-w-sm"> {/* content area, grows to fill space, inner justify-center for options */}
              <h2 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg text-center" style={{ fontFamily: "'Yeseva One', cursive" }}>
                Qual o seu gênero?
              </h2>
              <div className="flex flex-wrap justify-center gap-4 w-[85%] max-w-sm mx-auto">
                {['Masculino', 'Feminino', 'Outro'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect('gender', option)}
                    className={`flex-1 min-w-[120px] py-5 px-6 rounded-xl text-white text-xl font-semibold transition-all duration-200 ease-in-out transform active:scale-95 hover:scale-105 selection-glassmorphism
                    ${formData.gender === option ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] border-transparent shadow-lg scale-105' : 'hover:bg-white/20'}`}
                    aria-pressed={formData.gender === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {navButtons}
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col items-center justify-between w-full"> {/* main step container */}
            <div className="h-full flex flex-col items-center justify-center w-full max-w-sm"> {/* content area, grows to fill space, inner justify-center for options */}
              <h2 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg text-center" style={{ fontFamily: "'Yeseva One', cursive" }}>
                O que você procura?
              </h2>
              <div className="flex flex-col gap-4 w-[85%] max-w-sm mx-auto">
                {['Relacionamento Sério', 'Ficante', 'Encontro Casual', 'Amizade'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect('relationshipIntention', option)}
                    className={`py-5 px-6 rounded-xl text-white text-xl font-semibold transition-all duration-200 ease-in-out transform active:scale-95 hover:scale-105 selection-glassmorphism
                    ${formData.relationshipIntention === option ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] border-transparent shadow-lg scale-105' : 'hover:bg-white/20'}`}
                    aria-pressed={formData.relationshipIntention === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {navButtons}
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col items-center justify-between w-full">
            <div className="flex flex-col items-center flex-grow justify-center w-full max-w-sm px-4">
              <h2 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg text-center" style={{ fontFamily: "'Yeseva One', cursive" }}>
                Quem você quer encontrar?
              </h2>
              <div className="flex flex-wrap justify-center gap-4 w-[85%] max-w-sm mx-auto">
                {['Masculino', 'Feminino', 'Outro'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect('genderInterest', option)}
                    className={`flex-1 min-w-[120px] py-5 px-6 rounded-xl text-white text-xl font-semibold transition-all duration-200 ease-in-out transform active:scale-95 hover:scale-105 selection-glassmorphism
                    ${formData.genderInterest === option ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] border-transparent shadow-lg scale-105' : 'hover:bg-white/20'}`}
                    aria-pressed={formData.genderInterest === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {navButtons}
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center justify-between w-full h-full"> {/* Parent of content and nav buttons, takes full height */}
            {/* This sub-div contains the title and the scrollable options. It needs to grow and allow internal scrolling. */}
            <div className="flex flex-col items-center w-full max-w-sm flex-grow pt-4 min-h-0">
              <h2 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg text-center flex-shrink-0" style={{ fontFamily: "'Yeseva One', cursive" }}>
                Quais seus desejos de vida?
              </h2>
              {/* This div holds all the actual selectable buttons and is the one that should scroll. */}
              {/* Giving it flex-grow and overflow-y-auto ensures it takes remaining space and scrolls if content overflows. */}
              <div className="grid grid-cols-2 gap-4 w-full px-4 flex-grow overflow-y-auto custom-scrollbar"> {/* MODIFIED: Changed to grid layout for cards, increased gap */}
                {lifeDesireOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleMultiSelect('lifeDesires', option)}
                    className={`aspect-square flex items-center justify-center text-center p-4 rounded-xl text-white text-base font-semibold transition-all duration-200 ease-in-out transform active:scale-95 hover:scale-105 selection-glassmorphism
                      ${formData.lifeDesires.includes(option) ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] border-transparent shadow-lg scale-105' : 'hover:bg-white/20'}`}
                    aria-pressed={formData.lifeDesires.includes(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {navButtons}
          </div>
        );
      case 6:
        return (
          <div className="h-full flex flex-col items-center justify-between w-full"> {/* main step container */}
            {/* Content wrapper: flex-grow to take up vertical space between progress bar and nav buttons */}
            <div className="flex flex-col items-center w-full max-w-sm flex-grow pt-4 min-h-0">
              <h2 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg text-center flex-shrink-0" style={{ fontFamily: "'Yeseva One', cursive" }}>
                Adicione suas fotos e bio
              </h2>
              {/* Scrollable content container: takes remaining space, allows scrolling */}
              <div className="flex flex-col items-center w-full px-4 flex-grow overflow-y-auto custom-scrollbar space-y-8">
                {/* Foto de Perfil Principal */}
                <div className="relative w-48 h-48 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden shadow-lg">
                  {formData.profilePhoto ? (
                    <>
                      <img src={formData.profilePhoto} alt="Foto de Perfil" className="w-full h-full object-cover" />
                      <label htmlFor="profilePhotoUpload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <EditIcon />
                      </label>
                    </>
                  ) : (
                    <label htmlFor="profilePhotoUpload" className="flex flex-col items-center text-white/70 cursor-pointer">
                      <PlusIcon />
                      <span className="text-sm mt-2">Adicionar Foto</span>
                    </label>
                  )}
                  <input
                    id="profilePhotoUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'profilePhoto')}
                    aria-label="Upload de foto de perfil"
                  />
                </div>

                {/* Fotos Adicionais */}
                <div className="w-full grid grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="relative w-full aspect-square rounded-xl bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden shadow-lg">
                      {formData.additionalPhotos[index] ? (
                        <>
                          <img src={formData.additionalPhotos[index]} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                          <label htmlFor={`additionalPhotoUpload-${index}`} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <EditIcon />
                          </label>
                          <button
                            onClick={() => handleRemoveAdditionalPhoto(index)}
                            className="absolute top-1 right-1 bg-red-500/80 rounded-full p-1 text-white hover:bg-red-600/90 transition-colors z-10"
                            aria-label={`Remover foto ${index + 1}`}
                          >
                            <TrashIcon />
                          </button>
                        </>
                      ) : (
                        <label htmlFor={`additionalPhotoUpload-${index}`} className="flex flex-col items-center text-white/70 cursor-pointer">
                          <PlusIcon />
                          <span className="text-sm mt-2">Adicionar</span>
                        </label>
                      )}
                      <input
                        id={`additionalPhotoUpload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'additionalPhotos', index)}
                        aria-label={`Upload de foto adicional ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Campo de Biografia */}
                <textarea
                  name="bio"
                  placeholder="Escreva uma breve biografia (opcional)"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="input-glassmorphism w-full resize-none"
                  aria-label="Biografia (opcional)"
                ></textarea>
                <p className="text-right text-sm text-white/70 w-full">{formData.bio.length}/500</p>
              </div>
            </div>
            {navButtons}
          </div>
        );
      case 7:
        return (
          <div className="h-full flex flex-col items-center justify-between w-full"> {/* main step container */}
            <div className="h-full flex flex-col items-center justify-center w-full max-w-sm"> {/* content area, grows to fill space, inner justify-center for options */}
              <h2 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg text-center" style={{ fontFamily: "'Yeseva One', cursive" }}>
                Crie seu PIN
              </h2>
              <div className="flex flex-col space-y-6 w-full max-w-[200px] items-center">
                <p className="text-white text-lg font-semibold -mb-2" id="create-pin-label">Criar seu PIN</p>
                <PinInput
                  value={formData.pin}
                  onChange={(e) => handlePinChange(e, 'pin')}
                  ariaLabel="Criar PIN de 4 dígitos"
                  isError={isPinMismatch}
                />
                <p className="text-white text-lg font-semibold -mb-2" id="confirm-pin-label">Confirmar seu PIN</p>
                <PinInput
                  value={formData.confirmPin}
                  onChange={(e) => handlePinChange(e, 'confirmPin')}
                  ariaLabel="Confirmar PIN de 4 dígitos"
                  isError={isPinMismatch}
                />
                {isPinMismatch && (
                  <p className="text-red-400 text-sm mt-2" role="alert">Os PINs não correspondem!</p>
                )}
                {isPinIncomplete && !isPinMismatch && (
                  <p className="text-yellow-400 text-sm mt-2" role="alert">O PIN deve ter 4 dígitos.</p>
                )}
              </div>
            </div>
            {navButtons}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-start bg-black p-4">
      {/* Barra de Progresso */}
      <div className="w-full max-w-sm flex justify-between items-center mb-8 px-4 py-2 flex-shrink-0">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#ff0800] to-[#ff9900] h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Progresso do registro: Etapa ${currentStep} de ${totalSteps}`}
          ></div>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-start w-full max-w-md">
        {renderStepContent()}
      </div>

      <style>{`
        .text-gradient { background: linear-gradient(to right, #ff0800, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
        .input-glassmorphism {
          width: 100%;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem; /* rounded-xl */
          background-color: rgba(255, 255, 255, 0.1); /* bg-white/10 */
          backdrop-filter: blur(12px); /* backdrop-blur-lg */
          border: 1px solid rgba(255, 255, 255, 0.2); /* border border-white/20 */
          color: white;
          placeholder-color: rgba(209, 213, 219, 0.7); /* placeholder-gray-300 */
          outline: none;
          transition: all 0.2s ease-in-out;
        }
        .input-glassmorphism:focus {
          ring: 2px; /* focus:ring-2 */
          ring-color: rgba(255, 255, 255, 0.5); /* focus:ring-white/50 */
        }
        .input-glassmorphism::placeholder {
          color: rgba(209, 213, 219, 0.7);
        }

        .select-arrow-glassmorphism {
          -webkit-appearance: none; /* Remove default arrow on Webkit */
          -moz-appearance: none;    /* Remove default arrow on Firefox */
          appearance: none;         /* Remove default arrow */
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem; /* Make space for the arrow */
        }

        .selection-glassmorphism {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
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
        }
      `}</style>
    </div>
  );
};

export default RegistrationScreen;