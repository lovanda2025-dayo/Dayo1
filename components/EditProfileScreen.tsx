import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { UserProfile } from '../types';
import {
  ArrowLeftIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  GENDERS,
  RELATIONSHIP_INTENTIONS,
  GENDER_INTERESTS,
  OCCUPATIONS,
  EDUCATIONAL_LEVELS,
  SMOKING_OPTIONS,
  DRINKING_OPTIONS,
  EXERCISE_OPTIONS,
  DIET_OPTIONS,
  PET_OPTIONS,
  CHILDREN_OPTIONS,
  LANGUAGE_OPTIONS,
  RELIGION_OPTIONS,
  POLITICAL_OPTIONS,
  INTEREST_CATEGORIES,
  ALL_LIFE_DESIRES
} from '../constants';

interface EditProfileScreenProps {
  currentUserProfile: UserProfile;
  onBack: () => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

const provinces = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte",
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte",
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
].sort();

const MIN_AGE = 18;
const AGE_UPDATE_INTERVAL_DAYS = 60; // 60 dias para atualizar a idade

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ currentUserProfile, onBack, onUpdateProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(currentUserProfile);
  const [initialFormData, setInitialFormData] = useState<UserProfile>(currentUserProfile);
  const [isAgeUpdateDisabled, setIsAgeUpdateDisabled] = useState(false);
  const [ageUpdateMessage, setAgeUpdateMessage] = useState('');

  useEffect(() => {
    // Initialize form data with current user profile
    setFormData(currentUserProfile);
    setInitialFormData(currentUserProfile); // Store initial state to check for changes
    
    // Check age update restriction
    const lastUpdateTimestamp = currentUserProfile.lastAgeUpdate || 0;
    const now = Date.now();
    const daysSinceLastUpdate = (now - lastUpdateTimestamp) / (1000 * 60 * 60 * 24);

    if (daysSinceLastUpdate < AGE_UPDATE_INTERVAL_DAYS) {
      setIsAgeUpdateDisabled(true);
      const remainingDays = Math.ceil(AGE_UPDATE_INTERVAL_DAYS - daysSinceLastUpdate);
      setAgeUpdateMessage(`Você pode alterar sua idade novamente em ${remainingDays} dias.`);
    } else {
      setIsAgeUpdateDisabled(false);
      setAgeUpdateMessage('');
    }
  }, [currentUserProfile]);

  const hasChanges = useCallback(() => {
    // Simple deep comparison (can be more robust if needed)
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    // Special handling for age field (number)
    if (name === 'age') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < MIN_AGE) {
        setFormData((prev) => ({ ...prev, [name]: '' as any })); // Clear if invalid
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: numValue }));
      return;
    }

    // Special handling for height field (number)
    if (name === 'height') {
      const numValue = parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: isNaN(numValue) ? undefined : numValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (fieldName: keyof UserProfile, option: string) => {
    setFormData((prev) => {
      const currentArray = (prev[fieldName] || []) as string[];
      if (currentArray.includes(option)) {
        return { ...prev, [fieldName]: currentArray.filter((item) => item !== option) };
      } else {
        // Limit interests to 10
        if (fieldName === 'interests' && currentArray.length >= 10) {
          alert('Você pode selecionar no máximo 10 interesses.');
          return prev;
        }
        return { ...prev, [fieldName]: [...currentArray, option] };
      }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'profilePhoto' | 'additionalPhotos', index?: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => {
          if (field === 'profilePhoto') {
            const newImageUrls = prev.imageUrls ? [...prev.imageUrls] : [];
            newImageUrls[0] = base64String;
            return { ...prev, imageUrls: newImageUrls };
          } else if (field === 'additionalPhotos') {
            const newAdditionalPhotos = prev.imageUrls ? [...prev.imageUrls.slice(1)] : [];
            if (index !== undefined && newAdditionalPhotos[index]) {
              newAdditionalPhotos[index] = base64String;
            } else if (newAdditionalPhotos.length < 5) { // Limit to 5 additional photos
              newAdditionalPhotos.push(base64String);
            } else {
              alert('Você pode adicionar no máximo 5 fotos adicionais.');
            }
            return { ...prev, imageUrls: [prev.imageUrls[0], ...newAdditionalPhotos].filter(Boolean) };
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setFormData((prev) => {
      const newAdditionalPhotos = [...(prev.imageUrls?.slice(1) || [])];
      newAdditionalPhotos.splice(index, 1);
      return { ...prev, imageUrls: [prev.imageUrls[0], ...newAdditionalPhotos].filter(Boolean) };
    });
  };


  const handleSave = useCallback(() => {
    // Add validation logic here if needed beyond what's handled by input types
    const ageNum = parseInt(formData.age as any);
    if (isNaN(ageNum) || ageNum < MIN_AGE) {
      alert('Por favor, insira uma idade válida (mínimo 18 anos).');
      return;
    }

    // If age was changed and disabled, prevent save
    if (isAgeUpdateDisabled && formData.age !== initialFormData.age) {
      alert(ageUpdateMessage);
      return;
    }

    // Update lastAgeUpdate if age was changed successfully
    const updatedProfile: UserProfile = {
      ...formData,
      lastAgeUpdate: formData.age !== initialFormData.age ? Date.now() : formData.lastAgeUpdate,
    };

    onUpdateProfile(updatedProfile);
  }, [formData, initialFormData, onUpdateProfile, isAgeUpdateDisabled, ageUpdateMessage]);

  const sectionClass = "bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg mb-6";
  const titleClass = "text-3xl font-bold text-gradient mb-6 drop-shadow-lg"
  const inputClass = "input-glassmorphism mb-4"; // Re-using RegistrationScreen's style
  const selectClass = "input-glassmorphism select-arrow-glassmorphism mb-4"; // Re-using RegistrationScreen's style
  const multiSelectButtonClass = (isSelected: boolean) => `
    flex-1 min-w-[100px] py-3 px-4 rounded-xl text-white text-sm font-semibold transition-all duration-200 ease-in-out transform active:scale-95 hover:scale-105 selection-glassmorphism
    ${isSelected ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] border-transparent shadow-lg scale-105' : 'hover:bg-white/20'}
  `;

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-start bg-black p-4 animate-fade-in" style={{ animationDuration: '0.5s' }}>
      {/* Scrollable Content Area */}
      <div className="flex-grow w-full max-w-md p-4 overflow-y-auto custom-scrollbar pb-24">
        {/* Header - agora dentro da área de rolagem */}
        <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center flex-shrink-0 mb-8">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 transition-colors duration-200 p-1 mr-4"
            aria-label="Voltar para o perfil"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg text-center flex-grow" style={{ fontFamily: "'Yeseva One', cursive" }}>
            Editar Perfil
          </h1>
        </div>

        {/* Secção: Fotos do Perfil */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Fotos do Perfil</h2>
          <div className="flex flex-col items-center mb-8">
            {/* Foto de Perfil Principal */}
            <div className="relative w-48 h-48 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden shadow-lg mb-6">
              {formData.imageUrls?.[0] ? (
                <>
                  <img src={formData.imageUrls[0]} alt="Foto de Perfil" className="w-full h-full object-cover" loading="lazy" />
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
            <h3 className="text-xl font-bold text-white mb-4">Fotos Adicionais (Máx. 5)</h3>
            <div className="w-full grid grid-cols-3 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="relative w-full aspect-square rounded-xl bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden shadow-lg">
                  {formData.imageUrls && formData.imageUrls[index + 1] ? ( // Skip first image (main profile photo)
                    <>
                      <img src={formData.imageUrls[index + 1]} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
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
          </div>
        </section>

        {/* Secção: Informações Básicas */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Informações Básicas</h2>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name || ''}
            onChange={handleInputChange}
            className={inputClass}
            aria-label="Nome"
          />
          <input
            type="number"
            name="age"
            placeholder="Idade"
            value={formData.age || ''}
            onChange={handleInputChange}
            min={MIN_AGE}
            className={inputClass}
            disabled={isAgeUpdateDisabled}
            aria-label="Idade"
          />
          {isAgeUpdateDisabled && (
            <p className="text-yellow-400 text-sm mb-4" role="alert">{ageUpdateMessage}</p>
          )}
          <textarea
            name="bio"
            placeholder="Biografia (máx. 500 caracteres)"
            value={formData.bio || ''}
            onChange={handleInputChange}
            rows={4}
            maxLength={500}
            className={`${inputClass} resize-none`}
            aria-label="Biografia"
          ></textarea>
          <p className="text-right text-sm text-white/70 mb-4">{formData.bio?.length || 0}/500</p>

          <select
            name="gender"
            value={formData.gender || ''}
            onChange={handleInputChange}
            className={selectClass}
            aria-label="Gênero"
          >
            <option value="" disabled>Gênero</option>
            {GENDERS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            name="genderInterest"
            value={formData.genderInterest || ''}
            onChange={handleInputChange}
            className={selectClass}
            aria-label="Interesse em Gênero"
          >
            <option value="" disabled>Interesse em Gênero</option>
            {GENDER_INTERESTS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
           <select
            name="relationshipIntention"
            value={formData.relationshipIntention || ''}
            onChange={handleInputChange}
            className={selectClass}
            aria-label="Intenção de Relacionamento"
          >
            <option value="" disabled>Intenção de Relacionamento</option>
            {RELATIONSHIP_INTENTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </section>

        {/* Secção: Ocupação e Localização */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Ocupação e Localização</h2>
          <select
            name="occupation"
            value={formData.occupation || ''}
            onChange={handleInputChange}
            className={selectClass}
            aria-label="Ocupação"
          >
            <option value="" disabled>Ocupação</option>
            {OCCUPATIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <input
            type="text"
            name="company"
            placeholder="Empresa"
            value={formData.company || ''}
            onChange={handleInputChange}
            className={inputClass}
            aria-label="Empresa"
          />
          <select
            name="education"
            value={formData.education || ''}
            onChange={handleInputChange}
            className={selectClass}
            aria-label="Escolaridade"
          >
            <option value="" disabled>Escolaridade</option>
            {EDUCATIONAL_LEVELS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <input
            type="text"
            name="educationalInstitution"
            placeholder="Instituição de Ensino"
            value={formData.educationalInstitution || ''}
            onChange={handleInputChange}
            className={inputClass}
            aria-label="Instituição de Ensino"
          />
          <select
            name="province"
            value={formData.province || ''}
            onChange={handleInputChange}
            className={selectClass}
            aria-label="Província"
          >
            <option value="" disabled>Província</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            type="text"
            name="neighborhood"
            placeholder="Bairro"
            value={formData.neighborhood || ''}
            onChange={handleInputChange}
            className={inputClass}
            aria-label="Bairro"
          />
        </section>

        {/* Secção: Estilo de Vida */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Estilo de Vida</h2>
          <input
            type="number"
            name="height"
            placeholder="Altura (cm)"
            value={formData.height || ''}
            onChange={handleInputChange}
            min="50"
            max="250"
            className={inputClass}
            aria-label="Altura em centímetros"
          />

          <h3 className="text-xl font-bold text-white mb-2">Fumar</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {SMOKING_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFormData(prev => ({ ...prev, smoking: option }))}
                className={multiSelectButtonClass(formData.smoking === option)}
                aria-pressed={formData.smoking === option}
              >
                {option}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Beber</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {DRINKING_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFormData(prev => ({ ...prev, drinking: option }))}
                className={multiSelectButtonClass(formData.drinking === option)}
                aria-pressed={formData.drinking === option}
              >
                {option}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Exercícios</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {EXERCISE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFormData(prev => ({ ...prev, exercise: option }))}
                className={multiSelectButtonClass(formData.exercise === option)}
                aria-pressed={formData.exercise === option}
              >
                {option}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Dieta</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {DIET_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('diet', option)}
                className={multiSelectButtonClass(formData.diet?.includes(option) || false)}
                aria-pressed={formData.diet?.includes(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Pets</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {PET_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('pets', option)}
                className={multiSelectButtonClass(formData.pets?.includes(option) || false)}
                aria-pressed={formData.pets?.includes(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Filhos</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {CHILDREN_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFormData(prev => ({ ...prev, children: option }))}
                className={multiSelectButtonClass(formData.children === option)}
                aria-pressed={formData.children === option}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        {/* Secção: Interesses */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Interesses (Máx. 10)</h2>
          {Object.entries(INTEREST_CATEGORIES).map(([category, interests]) => (
            <div key={category} className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleMultiSelect('interests', option)}
                    className={multiSelectButtonClass(formData.interests?.includes(option) || false)}
                    aria-pressed={formData.interests?.includes(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Secção: Desejos de Vida */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Desejos de Vida</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_LIFE_DESIRES.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('lifeDesires', option)}
                className={multiSelectButtonClass(formData.lifeDesires?.includes(option) || false)}
                aria-pressed={formData.lifeDesires?.includes(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        {/* Secção: Outras Informações */}
        <section className={sectionClass}>
          <h2 className={titleClass}>Outras Informações</h2>
          <h3 className="text-xl font-bold text-white mb-2">Idiomas</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('languages', option)}
                className={multiSelectButtonClass(formData.languages?.includes(option) || false)}
                aria-pressed={formData.languages?.includes(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Religião</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {RELIGION_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFormData(prev => ({ ...prev, religion: option }))}
                className={multiSelectButtonClass(formData.religion === option)}
                aria-pressed={formData.religion === option}
              >
                {option}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Visão Política</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {POLITICAL_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFormData(prev => ({ ...prev, politicalView: option }))}
                className={multiSelectButtonClass(formData.politicalView === option)}
                aria-pressed={formData.politicalView === option}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Botão Salvar (sticky) */}
      <div className="w-full max-w-md bg-black/50 backdrop-blur-xl border-t border-white/10 p-4 flex-shrink-0 sticky bottom-0 z-10">
        <button
          onClick={handleSave}
          disabled={!hasChanges()}
          className={`w-full py-4 px-6 rounded-full text-white text-xl font-semibold shadow-lg transition-all duration-300 ease-in-out transform active:scale-95
            ${hasChanges() ? 'bg-gradient-to-br from-[#ff0800] to-[#ff9900] hover:from-[#ff9900] hover:to-[#ff0800]' : 'bg-gray-600 opacity-70 cursor-not-allowed'}
          `}
          aria-label="Salvar alterações do perfil"
        >
          Salvar Alterações
        </button>
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
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in forwards; }
      `}</style>
    </div>
  );
};

export default EditProfileScreen;