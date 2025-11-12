
export interface UserProfile {
  id: number;
  name: string;
  age: number;
  bio: string;
  imageUrls: string[];
  relationshipIntention: string;
  lifeDesires?: string[]; 
  
  // Novas propriedades para edição de perfil
  province?: string;
  gender?: string;
  genderInterest?: string;

  occupation?: string;
  company?: string;
  education?: string;
  educationalInstitution?: string;
  neighborhood?: string; // Bairro

  height?: number; // em cm
  smoking?: 'Não' | 'Socialmente' | 'Sim';
  drinking?: 'Não' | 'Socialmente' | 'Sim';
  exercise?: 'Ativo' | 'Moderado' | 'Ocasional' | 'Sedentário';
  diet?: string[];
  pets?: string[];
  children?: 'Quer ter' | 'Não quer ter' | 'Já tem' | 'Talvez';

  interests?: string[]; // Até 10 interesses
  languages?: string[];
  religion?: string;
  politicalView?: string;

  lastAgeUpdate?: number; // Timestamp da última atualização da idade
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}