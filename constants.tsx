import React from 'react';
import type { UserProfile } from './types';

export const PROFILES: UserProfile[] = [
  { id: 1, name: 'Jessica Smith', age: 28, bio: 'Alma aventureira que adora trilhas e experimentar novas cozinhas. Procurando por um parceiro para todas as horas.', imageUrls: ['https://picsum.photos/seed/jessica/800/1200', 'https://picsum.photos/seed/jessica2/800/1200', 'https://picsum.photos/seed/jessica3/800/1200'], relationshipIntention: 'Relacionamento Sério', lifeDesires: ['Quer Casar', 'Quer ter Filhos', 'Viajar', 'Cozinhar', 'Quer crescer na carreira'] },
  { id: 2, name: 'Alex Johnson', age: 31, bio: 'Engenheiro de software de dia, músico à noite. Provavelmente consigo consertar seu computador e escrever uma música para você.', imageUrls: ['https://picsum.photos/seed/alex/800/1200', 'https://picsum.photos/seed/alex2/800/1200'], relationshipIntention: 'Amizade', lifeDesires: ['Música', 'Jogos', 'Quer estabilidade financeira', 'Quer construir/comprar uma casa'] },
  { id: 3, name: 'Maria Garcia', age: 26, bio: 'Curadora de galeria de arte com paixão por pintura e filmes antigos. Fluente em sarcasmo e café.', imageUrls: ['https://picsum.photos/seed/maria/800/1200', 'https://picsum.photos/seed/maria2/800/1200', 'https://picsum.photos/seed/maria3/80um.photos/seed/maria4/800/1200'], relationshipIntention: 'Ficante', lifeDesires: ['Arte', 'Filmes', 'Leitura', 'Viajar', 'Quer abrir o seu próprio negócio'] },
  { id: 4, name: 'David Lee', age: 29, bio: 'Entusiasta de fitness e amante de cães. Meu golden retriever é meu melhor amigo. Vamos correr?', imageUrls: ['https://picsum.photos/seed/david/800/1200'], relationshipIntention: 'Relacionamento Sério', lifeDesires: ['Esportes', 'Natureza', 'Quer Formar uma Família', 'Quer fortalecer laços familiares'] },
  { id: 5, name: 'Chloe Brown', age: 24, bio: 'Apenas uma garota que adora viajar e documentar tudo. Meu rolo da câmera é 90% pores do sol e comida.', imageUrls: ['https://picsum.photos/seed/chloe/800/1200', 'https://picsum.photos/seed/chloe2/800/1200', 'https://picsum.photos/seed/chloe3/800/1200'], relationshipIntention: 'Encontro Casual', lifeDesires: ['Viajar', 'Arte', 'Fotografia', 'Não quer casar', 'Não quer ter filhos'] },
  { id: 6, name: 'Marcus Aurelius', age: 35, bio: 'Filósofo e aspirante a estoico. Gosta de conversas profundas, manhãs tranquilas e um bom livro.', imageUrls: ['https://picsum.photos/seed/marcus/800/1200', 'https://picsum.photos/seed/marcus2/800/1200'], relationshipIntention: 'Relacionamento Sério', lifeDesires: ['Leitura', 'Filosofia', 'Quer Casar', 'Quer ter Filhos', 'Quer Formar uma Família'] },
  { id: 7, name: 'Sophia Chen', age: 27, bio: 'Apaixonada por um estilo de vida sustentável e adora experimentar receitas veganas. Sempre disposta a uma boa conversa.', imageUrls: ['https://picsum.photos/seed/sophia/800/1200', 'https://picsum.photos/seed/sophia2/800/1200'], relationshipIntention: 'Amizade', lifeDesires: ['Cozinhar', 'Natureza', 'Estudante', 'Quer estabilidade financeira'] },
  { id: 8, name: 'Lucas Silva', age: 30, bio: 'Programador e surfista, buscando ondas e boas companhias.', imageUrls: ['https://picsum.photos/seed/lucas/800/1200', 'https://picsum.photos/seed/lucas2/800/1200'], relationshipIntention: 'Ficante', lifeDesires: ['Esportes', 'Natureza', 'Programação', 'Viajar'] },
];

export const CURRENT_USER_PROFILE: UserProfile = {
  id: 99,
  name: 'Seu Nome',
  age: 29,
  bio: 'Esta é a sua biografia. Edite-a para contar mais sobre você!',
  imageUrls: ['https://picsum.photos/seed/myprofile/800/1200'], // Foto de perfil padrão
  relationshipIntention: 'Relacionamento Sério',
  lifeDesires: ['Viajar', 'Quer crescer na carreira'],
  province: 'Luanda',
  gender: 'Feminino',
  genderInterest: 'Masculino',
  occupation: 'Designer Gráfico',
  company: 'Criativa Studio',
  education: 'Ensino Superior',
  educationalInstitution: 'Universidade de Luanda',
  neighborhood: 'Ingombota',
  height: 165,
  smoking: 'Não',
  drinking: 'Socialmente',
  exercise: 'Moderado',
  diet: ['Vegetariano'],
  pets: ['Cachorro'],
  children: 'Talvez',
  interests: ['Arte', 'Fotografia', 'Leitura', 'Música', 'Viagens'],
  languages: ['Português', 'Inglês'],
  religion: 'Cristianismo',
  politicalView: 'Centro',
  lastAgeUpdate: Date.now() - (70 * 24 * 60 * 60 * 1000), // Simula que a idade foi atualizada há 70 dias
};

// --- Categorias de Desejos de Vida para a tela de Exploração ---
export const RELATIONSHIP_AND_FAMILY_DESIRES = [
  'Quer Casar',
  'Quer ter Filhos',
  'Quer Formar uma Família',
  'Quer Fortalecer laços familiares',
  'Não quer casar',
  'Não quer ter filhos',
  'Talvez Casar',
  'Talvez ter filhos',
];

export const FUTURE_AND_LIFESTYLE_DESIRES = [
  'Quer estabilidade financeira',
  'Quer construir/comprar uma casa',
  'Quer abrir o seu próprio negócio',
  'Quer crescer na carreira',
  'Empreendedor',
  'Estudante',
  'Trabalhador',
  'Pós-Graduado',
];

export const ALL_LIFE_DESIRES = [ // Usado na tela de Registro e Edição para todas as opções
  ...RELATIONSHIP_AND_FAMILY_DESIRES,
  ...FUTURE_AND_LIFESTYLE_DESIRES,
  'Viajar', 'Cozinhar', 'Leitura', 'Filmes', 'Jogos', 'Esportes', 'Música', 'Dança', 'Arte', 'Natureza',
];

// --- Opções para Edição de Perfil ---
export const GENDERS = ['Masculino', 'Feminino', 'Outro'];
export const RELATIONSHIP_INTENTIONS = ['Relacionamento Sério', 'Ficante', 'Encontro Casual', 'Amizade'];
export const GENDER_INTERESTS = ['Masculino', 'Feminino', 'Outro'];

export const OCCUPATIONS = [
  'Estudante', 'Engenheiro', 'Médico', 'Professor', 'Designer', 'Programador',
  'Empreendedor', 'Artista', 'Advogado', 'Vendedor', 'Marketing', 'Jornalista',
  'Outro',
];
export const EDUCATIONAL_LEVELS = [
  'Ensino Médio', 'Ensino Superior', 'Pós-Graduação', 'Mestrado', 'Doutorado',
];

export const SMOKING_OPTIONS = ['Não', 'Socialmente', 'Sim'];
export const DRINKING_OPTIONS = ['Não', 'Socialmente', 'Sim'];
export const EXERCISE_OPTIONS = ['Ativo', 'Moderado', 'Ocasional', 'Sedentário'];
export const DIET_OPTIONS = ['Omnívoro', 'Vegetariano', 'Vegano', 'Pescetariano', 'Outro'];
export const PET_OPTIONS = ['Cachorro', 'Gato', 'Outro', 'Nenhum'];
export const CHILDREN_OPTIONS = ['Quer ter', 'Não quer ter', 'Já tem', 'Talvez'];

export const LANGUAGE_OPTIONS = ['Português', 'Inglês', 'Francês', 'Espanhol', 'Kimbundu', 'Umbundu', 'Outro'];
export const RELIGION_OPTIONS = ['Cristianismo', 'Islão', 'Hinduísmo', 'Budismo', 'Judaísmo', 'Ateísmo', 'Outro', 'Prefiro não dizer'];
export const POLITICAL_OPTIONS = ['Esquerda', 'Centro-Esquerda', 'Centro', 'Centro-Direita', 'Direita', 'Outro', 'Prefiro não dizer'];

export const INTEREST_CATEGORIES = {
  'Música e Arte': ['Música', 'Dança', 'Pintura', 'Escultura', 'Teatro', 'Cinema', 'Fotografia', 'Literatura'],
  'Desportos e Atividade Física': ['Futebol', 'Basquetebol', 'Voleibol', 'Natação', 'Corrida', 'Ciclismo', 'Musculação', 'Yoga', 'Surf', 'Caminhada'],
  'Gastronomia e Culinária': ['Cozinhar', 'Comer fora', 'Vinho', 'Cerveja artesanal', 'Café', 'Culinária internacional', 'Culinária vegana'],
  'Viagens e Aventura': ['Viajar', 'Aventura', 'Praia', 'Montanha', 'Exploração urbana', 'Acampar'],
  'Tecnologia e Jogos': ['Jogos de vídeo', 'Tecnologia', 'Programação', 'Realidade Virtual', 'Gadgets'],
  'Leitura e Aprendizagem': ['Livros', 'Documentários', 'Notícias', 'Estudar', 'Cursos online'],
  'Natureza e Ar Livre': ['Natureza', 'Parques', 'Animais', 'Jardinagem'],
  'Hobbies e Criatividade': ['DIY (Faça você mesmo)', 'Artesanato', 'Colecionar', 'Moda', 'Escrita'],
  'Social e Voluntariado': ['Voluntariado', 'Eventos sociais', 'Conversar', 'Causas sociais'],
};

// Flat list of all interests for multi-select
export const ALL_INTERESTS = Object.values(INTEREST_CATEGORIES).flat();

// Action Icons
export const CommentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
export const HeartIcon = ({ isGradient = false }: { isGradient?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={isGradient ? "url(#gradient)" : "currentColor"} stroke={isGradient ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {isGradient && (
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0800" />
          <stop offset="100%" stopColor="#ff9900" />
        </linearGradient>
      </defs>
    )}
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
export const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
export const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>;
export const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>; // New StarIcon for Favorite
export const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
export const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;

// Helper SVG Icons
export const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

export const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

{/* Fix: Add ArrowLeftIcon for use in RealtimeChatConversationScreen and potentially other components. */}
export const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

export const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);


// Nav Icons
export const ExploreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
export const ChatsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
export const LikesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
export const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
export const MatchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="url(#gradient)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff0800" />
        <stop offset="100%" stopColor="#ff9900" />
      </linearGradient>
    </defs>
    <path d="M11.68 14.94c-3.34-2.79-4.9-8.2-2.42-12.04a.5.5 0 0 1 .84.42c-.22 1.34.82 2.45 2.14 2.21 1.3-.24 2.15-1.5 1.9-2.85a.5.5 0 0 1 .88-.35c2.61 4.3.43 9.3-2.34 12.61z"/>
    <path d="M12.32 14.94c3.34-2.79 4.9-8.2 2.42-12.04a.5.5 0 0 0-.84.42c.22 1.34-.82 2.45-2.14 2.21-1.3-.24-2.15-1.5-1.9-2.85a.5.5 0 0 1 .88-.35c-2.61 4.3-.43 9.3 2.34 12.61z"/>
    <path d="M12.5 10.5c-4.67 4.67-4.67 12.83 0 12.5 4.67-.33 4.67-7.83 0-12.5z"/>
  </svg>
);

export const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);