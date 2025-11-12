import React, { useState, useCallback } from 'react';
import { PROFILES, CURRENT_USER_PROFILE } from './constants';
import ProfileView from './components/ProfileView';
import BottomNavBar from './components/BottomNavBar';
import MatchScreen from './components/MatchScreen';
import SplashScreen from './components/SplashScreen';
import LovandaScreen from './components/LovandaScreen';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import SubscriptionPlansScreen from './components/SubscriptionPlansScreen';
import ExploreScreen from './components/ExploreScreen';
import LikesScreen from './components/LikesScreen';
import ChatScreen from './components/ChatScreen'; 
import RealtimeChatConversationScreen from './components/RealtimeChatConversationScreen';
import UserProfileScreen from './components/UserProfileScreen';
import EditProfileScreen from './components/EditProfileScreen'; // Import the new EditProfileScreen
import type { UserProfile, ChatMessage } from './types';

type AppView = 'splash' | 'lovanda' | 'login' | 'registration' | 'subscription' | 'profiles' | 'explore' | 'likes' | 'chats' | 'chatConversation' | 'userProfile' | 'editProfile'; // Added 'editProfile'

// Dummy chat history for demonstration
const dummyChatHistory: { [profileId: number]: ChatMessage[] } = {
  1: [ // Jessica
    { id: '1', sender: 'other', text: 'Oi! Adorei seu perfil.', timestamp: '10:00' },
    { id: '2', sender: 'me', text: 'Olá! O seu também é ótimo.', timestamp: '10:01' },
    { id: '3', sender: 'other', text: 'Vi que você gosta de trilhas, qual a sua favorita?', timestamp: '10:05' },
  ],
  2: [ // Alex
    { id: '4', sender: 'other', text: 'Música à noite? Me conta mais!', timestamp: 'Ontem' },
    { id: '5', sender: 'me', text: 'Toco violão e canto. Curte rock?', timestamp: 'Ontem' },
  ],
  3: [ // Maria
    { id: '6', sender: 'me', text: 'Curadora de galeria! Que legal, qual seu tipo de arte favorito?', timestamp: 'Seg' },
    { id: '7', sender: 'other', text: 'Adoro arte moderna e expressionismo. E você?', timestamp: 'Seg' },
  ],
  4: [ // David
    { id: '8', sender: 'other', text: 'Amo cachorros! Qual a raça do seu?', timestamp: '09:30' },
    { id: '9', sender: 'me', text: 'Um Golden Retriever chamado Max! É um doce.', timestamp: '09:31' },
  ],
  6: [ // Marcus Aurelius
    { id: '10', sender: 'me', text: 'Adoro filosofia. Algum livro para recomendar?', timestamp: '8:45' },
    { id: '11', sender: 'other', text: 'Meditações, de Marco Aurélio, é um clássico!', timestamp: '8:47' },
  ],
  7: [ // Sophia Chen
    { id: '12', sender: 'other', text: 'Sustentabilidade é um tema importante. Quais suas dicas?', timestamp: '11:00' },
    { id: '13', sender: 'me', text: 'Começar com pequenas mudanças, como reduzir o consumo de plástico!', timestamp: '11:02' },
  ],
  8: [ // Lucas Silva
    { id: '14', sender: 'me', text: 'Surfista! Que legal. Quais suas praias favoritas para surfar?', timestamp: '14:15' },
    { id: '15', sender: 'other', text: 'Em Angola, Cabo Ledo e Barra do Kwanza são tops!', timestamp: '14:18' },
  ],
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [activeProfiles, setActiveProfiles] = useState<UserProfile[]>(PROFILES);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const [showMatchScreen, setShowMatchScreen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // User Profile state - THIS IS THE PROFILE OF THE CURRENT USER LOGGED IN
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(CURRENT_USER_PROFILE);

  // New states for LikesScreen
  const [likedByProfiles, setLikedByProfiles] = useState<UserProfile[]>(() => [PROFILES[1], PROFILES[3]]); // Alex and David liked the user (dummy data)
  const [anonymousComments, setAnonymousComments] = useState<string[]>(() => [
    "Você tem um sorriso lindo!",
    "Parece muito divertido(a)!",
    "Adorei suas fotos!",
  ]);
  const [favoritedProfiles, setFavoritedProfiles] = useState<UserProfile[]>(() => [PROFILES[0]]); // Jessica favorited (dummy data)
  const [archivedProfiles, setArchivedProfiles] = useState<UserProfile[]>(() => [PROFILES[4]]); // Chloe archived (dummy data)

  // New states for ChatScreen and RealtimeChatConversationScreen
  const [matchesList, setMatchesList] = useState<UserProfile[]>(() => [PROFILES[0], PROFILES[2], PROFILES[3], PROFILES[5], PROFILES[7]]); // Dummy matches for chat: Jessica, Maria, David, Marcus, Lucas
  const [currentChatProfile, setCurrentChatProfile] = useState<UserProfile | null>(null);

  // Callbacks para gerenciamento de tela
  const handleSplashFinish = useCallback(() => setCurrentView('lovanda'), []);
  const handleLovandaEnter = useCallback(() => setCurrentView('login'), []);
  const handleLovandaRegister = useCallback(() => setCurrentView('registration'), []);
  const handleLoginFinish = useCallback(() => {
    setCurrentView('profiles');
    setActiveProfiles(PROFILES); // Reinicia perfis após login
    setCurrentProfileIndex(0);
    setSelectedFilter(null);
  }, []);
  const handleRegistrationFinish = useCallback(() => setCurrentView('subscription'), []);
  const handleSubscriptionPlansFinish = useCallback(() => {
    setCurrentView('profiles');
    setActiveProfiles(PROFILES); // Reinicia perfis após seleção de plano
    setCurrentProfileIndex(0);
    setSelectedFilter(null);
  }, []);

  const handleExploreClick = useCallback(() => setCurrentView('explore'), []);
  const handleLikesClick = useCallback(() => setCurrentView('likes'), []);
  const handleChatsClick = useCallback(() => {
    setCurrentView('chats');
  }, []);
  const handleProfileClick = useCallback(() => {
    setCurrentView('userProfile'); 
  }, []);
  const handleGoToProfiles = useCallback(() => {
    setCurrentView('profiles');
    setActiveProfiles(PROFILES); // Remove filtros
    setCurrentProfileIndex(0);
    setSelectedFilter(null);
  }, []);

  const handleFilterSelect = useCallback((filter: string) => {
    const filtered = PROFILES.filter(profile => profile.lifeDesires?.includes(filter));
    setActiveProfiles(filtered.length > 0 ? filtered : PROFILES); // Mostra todos se nenhum resultado
    setCurrentProfileIndex(0);
    setSelectedFilter(filter);
    setCurrentView('profiles');
  }, []);

  const advanceProfile = useCallback(() => {
    setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % activeProfiles.length);
  }, [activeProfiles.length]);

  const handleProfileAnimationEnd = useCallback((isLiked: boolean) => {
    setIsAnimatingOut(false);
    const currentActionedProfile = activeProfiles[currentProfileIndex];

    if (isLiked) {
      if (Math.random() < 0.3) { // Simulate a match
        setMatchedProfile(currentActionedProfile);
        setShowMatchScreen(true);
        // Add to matches list if not already there
        setMatchesList(prev => {
          if (!prev.some(p => p.id === currentActionedProfile.id)) {
            return [...prev, currentActionedProfile];
          }
          return prev;
        });
      } else {
        advanceProfile();
      }
    } else {
      advanceProfile();
    }
    if (!showMatchScreen) { // Only clear if MatchScreen is not shown
      setMatchedProfile(null);
    }
  }, [currentProfileIndex, showMatchScreen, activeProfiles, advanceProfile]);

  const handleLike = useCallback(() => {
    console.log('Curtiu:', activeProfiles[currentProfileIndex]?.name);
    setIsAnimatingOut(true);
    // In a real app, this would send a 'like' to the backend.
  }, [currentProfileIndex, activeProfiles]);

  const handleDislike = useCallback(() => {
    console.log('Não curtiu:', activeProfiles[currentProfileIndex]?.name);
    setIsAnimatingOut(true);
    // In a real app, this would send a 'dislike' to the backend.
  }, [currentProfileIndex, activeProfiles]);

  const handleFavorite = useCallback(() => {
    const profileToFavorite = activeProfiles[currentProfileIndex];
    if (profileToFavorite && !favoritedProfiles.some(p => p.id === profileToFavorite.id)) {
      setFavoritedProfiles(prev => [...prev, profileToFavorite]);
      console.log('Favoritou:', profileToFavorite.name);
    }
  }, [currentProfileIndex, activeProfiles, favoritedProfiles]);

  const handleArchive = useCallback(() => {
    const profileToArchive = activeProfiles[currentProfileIndex];
    if (profileToArchive && !archivedProfiles.some(p => p.id === profileToArchive.id)) {
      setArchivedProfiles(prev => [...prev, profileToArchive]);
      console.log('Arquivou:', profileToArchive.name);
    }
  }, [currentProfileIndex, activeProfiles, archivedProfiles]);

  const handleComment = useCallback(() => {
    const profileName = activeProfiles[currentProfileIndex]?.name;
    const newComment = `Comentário anónimo para ${profileName}!`; // Dummy comment
    setAnonymousComments(prev => [...prev, newComment]);
    console.log('Comentou anonimamente sobre:', profileName);
  }, [currentProfileIndex, activeProfiles]);

  // Modified handleSendMessage to navigate to chat with the matched profile
  const handleSendMessageFromMatch = useCallback(() => {
    if (matchedProfile) {
      console.log('Navegando para o chat com:', matchedProfile.name);
      setCurrentChatProfile(matchedProfile);
      setCurrentView('chatConversation');
    }
    setMatchedProfile(null);
    setShowMatchScreen(false);
  }, [matchedProfile]);

  const handleKeepSwiping = useCallback(() => {
    advanceProfile();
    setMatchedProfile(null);
    setShowMatchScreen(false);
  }, [advanceProfile]);

  // Handlers for new chat functionality
  const handleOpenChatConversation = useCallback((profile: UserProfile) => {
    setCurrentChatProfile(profile);
    setCurrentView('chatConversation');
  }, []);

  const handleBackFromChatConversation = useCallback(() => {
    setCurrentChatProfile(null);
    setCurrentView('chats');
  }, []);

  // Handlers for UserProfileScreen actions
  const handleEditProfile = useCallback(() => {
    setCurrentView('editProfile');
  }, []);

  const handleManageSubscription = useCallback(() => {
    setCurrentView('subscription');
  }, []);

  const handleBuyCurrency = useCallback(() => {
    console.log('Navegar para a tela de compra de batidas/raios (pode ser um modal ou nova tela)');
    // Implement navigation/modal for buying currency
  }, []);

  const handleBackFromSubscription = useCallback(() => {
    // Determine where to go back from subscription screen (e.g., UserProfile or Registration)
    // For now, assume it always goes back to UserProfileScreen if accessed from there
    setCurrentView('userProfile'); 
  }, []);

  const handleUpdateUserProfile = useCallback((updatedProfile: UserProfile) => {
    console.log('Perfil do utilizador atualizado:', updatedProfile);
    setCurrentUserProfile(updatedProfile);
    setCurrentView('userProfile'); // Go back to UserProfileScreen after saving
  }, []);

  const handleBackFromEditProfile = useCallback(() => {
    setCurrentView('userProfile');
  }, []);

  const handleOpenSettings = useCallback(() => {
    console.log('Navegar para a tela de configurações!');
    // Implement navigation to a settings screen here if one exists in the future
  }, []);


  const displayProfile = activeProfiles[currentProfileIndex];

  return (
    <main className="h-screen w-screen bg-gray-900 font-sans overflow-hidden">
      <div className="relative h-full w-full max-w-md mx-auto border-x border-gray-800/50 shadow-2xl shadow-black flex flex-col">
        {currentView === 'splash' && <SplashScreen onFinish={handleSplashFinish} />}
        {currentView === 'lovanda' && <LovandaScreen onEnter={handleLovandaEnter} onRegister={handleLovandaRegister} />}
        {currentView === 'login' && <LoginScreen onFinish={handleLoginFinish} />}
        {currentView === 'registration' && <RegistrationScreen onFinish={handleRegistrationFinish} onBack={() => setCurrentView('lovanda')} />}
        {currentView === 'subscription' && <SubscriptionPlansScreen onFinish={handleSubscriptionPlansFinish} onBack={handleBackFromSubscription} />}
        
        {/* Main content area */}
        <div className="flex-grow relative w-full overflow-hidden">
          {currentView === 'explore' && (
            <ExploreScreen 
              onFilterSelect={handleFilterSelect} 
            />
          )}
          {currentView === 'likes' && (
            <LikesScreen
              likedByProfiles={likedByProfiles}
              anonymousComments={anonymousComments}
              favoritedProfiles={favoritedProfiles}
              archivedProfiles={archivedProfiles}
            />
          )}
          {currentView === 'chats' && (
            <ChatScreen
              matchesList={matchesList}
              onOpenChat={handleOpenChatConversation}
            />
          )}
          {currentView === 'chatConversation' && currentChatProfile && (
            <RealtimeChatConversationScreen
              matchedProfile={currentChatProfile}
              onBack={handleBackFromChatConversation}
              initialChatHistory={dummyChatHistory[currentChatProfile.id] || []}
            />
          )}
          {currentView === 'userProfile' && (
            <UserProfileScreen
              currentUserProfile={currentUserProfile} // Pass the current user's profile
              onBack={handleGoToProfiles} 
              onEditProfile={handleEditProfile}
              onManageSubscription={handleManageSubscription}
              onBuyCurrency={handleBuyCurrency}
              onOpenSettings={handleOpenSettings} // Pass the new handler for settings
            />
          )}
          {currentView === 'editProfile' && (
            <EditProfileScreen
              currentUserProfile={currentUserProfile}
              onBack={handleBackFromEditProfile}
              onUpdateProfile={handleUpdateUserProfile}
            />
          )}
          {currentView === 'profiles' && (
            <>
              {displayProfile ? (
                <ProfileView 
                  key={displayProfile.id} 
                  profile={displayProfile} 
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onFavorite={handleFavorite}
                  onArchive={handleArchive}
                  onComment={handleComment}
                  onOpenFilters={handleExploreClick} // Pass the handler to open filters
                  onAnimationEnd={handleProfileAnimationEnd}
                  isAnimatingOut={isAnimatingOut}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <p className="text-white text-xl">
                    Não há mais perfis para mostrar
                    {selectedFilter && ` com o filtro "${selectedFilter}"`}.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* BottomNavBar should be visible on specific screens */}
        {(currentView === 'profiles' || currentView === 'explore' || currentView === 'likes' || currentView === 'chats' || currentView === 'userProfile') && (
          <BottomNavBar 
            onExploreClick={handleExploreClick} 
            onLikesClick={handleLikesClick} 
            onMatchButtonClick={handleGoToProfiles}
            onChatsClick={handleChatsClick}
            onProfileClick={handleProfileClick}
          />
        )}

        {showMatchScreen && matchedProfile && (
          <MatchScreen 
            matchedProfile={matchedProfile} 
            onSendMessage={handleSendMessageFromMatch} 
            onKeepSwiping={handleKeepSwiping} 
          />
        )}
      </div>
    </main>
  );
};

export default App;