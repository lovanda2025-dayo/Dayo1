import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { UserProfile } from '../types';
import ActionButton from './ActionButton';
import { CommentIcon, HeartIcon, XIcon, ArchiveIcon, StarIcon, FilterIcon } from '../constants'; // Removed SendIcon

interface ProfileViewProps {
  profile: UserProfile;
  onLike: () => void;
  onDislike: () => void;
  onFavorite: () => void; // New prop for favoriting
  onArchive: () => void; // New prop for archiving
  onComment: () => void; // New prop for commenting
  onOpenFilters: () => void; // New prop for opening filters
  onAnimationEnd: (isLiked: boolean) => void; // Callback when the exit animation completes
  isAnimatingOut: boolean; // Signal from App.tsx to start the exit animation
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onLike, onDislike, onFavorite, onArchive, onComment, onOpenFilters, onAnimationEnd, isAnimatingOut }) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null); // To control the exit animation direction

  const [overlayProps, setOverlayProps] = useState({
    text: '',
    opacity: 0,
    color: '',
    borderColor: '',
    transform: '',
    transition: 'none',
  });

  const swipeableImageRef = useRef<HTMLDivElement>(null); // Changed from containerRef to swipeableImageRef
  const navigationLockRef = useRef(false);

  const SWIPE_THRESHOLD = 100;
  const MOVE_THRESHOLD_FOR_PRESS = 10;
  const NAVIGATION_LOCK_DURATION = 300;
  const EXIT_ANIMATION_DURATION = 400; // Duration of the swipe-out animation

  // Reset state when profile changes or when entering the view (not animating out)
  useEffect(() => {
    if (!isAnimatingOut) {
      setCurrentImageIndex(0);
      setCardStyle({});
      setExitDirection(null);
      setOverlayProps(prev => ({ ...prev, opacity: 0 }));
    }
  }, [profile.id, isAnimatingOut]);

  // Handles the exit animation trigger from the parent (App.tsx)
  useEffect(() => {
    if (isAnimatingOut && exitDirection) {
      const transformX = exitDirection === 'right' ? '500px' : '-500px';
      const rotation = exitDirection === 'right' ? '30deg' : '-30deg';
      setCardStyle({
        transform: `translateX(${transformX}) rotate(${rotation})`,
        transition: `transform ${EXIT_ANIMATION_DURATION}ms ease-in, opacity ${EXIT_ANIMATION_DURATION}ms ease-in`,
        opacity: 0,
      });
      // Call onAnimationEnd after the animation completes
      const timer = setTimeout(() => {
        onAnimationEnd(exitDirection === 'right'); // Pass true if liked, false if disliked
      }, EXIT_ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isAnimatingOut, exitDirection, onAnimationEnd]);
  
  const goToNextImage = useCallback(() => {
    if (navigationLockRef.current) return;
    navigationLockRef.current = true;
    setTimeout(() => { navigationLockRef.current = false; }, NAVIGATION_LOCK_DURATION);

    setCurrentImageIndex(prevIndex => Math.min(prevIndex + 1, profile.imageUrls.length - 1));
  }, [profile.imageUrls.length]);

  const goToPrevImage = useCallback(() => {
    if (navigationLockRef.current) return;
    navigationLockRef.current = true;
    setTimeout(() => { navigationLockRef.current = false; }, NAVIGATION_LOCK_DURATION);

    setCurrentImageIndex(prevIndex => Math.max(prevIndex - 1, 0));
  }, [profile.imageUrls.length]);

  const triggerLike = useCallback(() => {
    setExitDirection('right'); // Signal for right-swipe exit animation
    onLike(); // Notify parent of like action
  }, [onLike]);

  const triggerDislike = useCallback(() => {
    setExitDirection('left'); // Signal for left-swipe exit animation
    onDislike(); // Notify parent of dislike action
  }, [onDislike]);
  
  const resetCard = () => {
    setCardStyle({
      transform: 'translateX(0px) rotate(0deg)',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    });
    setOverlayProps(prev => ({ ...prev, opacity: 0, transition: 'opacity 0.3s ease-out' }));
    setExitDirection(null); // Clear exit direction if card is reset
  };

  const handlePressStart = (x: number, y: number) => {
    setIsDragging(true);
    setTouchStart({ x, y });
  };

  const handlePressMove = (x: number, y: number) => {
    if (!isDragging || !touchStart || isAnimatingOut) return; // Prevent dragging during exit animation

    const deltaX = x - touchStart.x;
    const rotation = deltaX / 20;
    setCardStyle({
      transform: `translateX(${deltaX}px) rotate(${rotation}deg)`,
      transition: 'none',
    });

    const opacity = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1);
    if (deltaX > 10) {
      setOverlayProps({ text: 'CURTI', opacity, color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.7)', transform: 'rotate(-25deg)', transition: 'none' });
    } else if (deltaX < -10) {
      setOverlayProps({ text: 'NÃO', opacity, color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.7)', transform: 'rotate(25deg)', transition: 'none' });
    } else {
      setOverlayProps(prev => ({ ...prev, opacity: 0, transition: 'none' }));
    }
  };
  
  const handlePressEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, endX: number, endY: number) => {
    if (isAnimatingOut) return; // Prevent actions during exit animation

    // Prevent tap/swipe if a button was clicked
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
        setIsDragging(false);
        setTouchStart(null);
        return;
    }

    if (!touchStart) return;

    const deltaX = endX - touchStart.x;
    const deltaY = endY - touchStart.y;
    const isTap = Math.abs(deltaX) < MOVE_THRESHOLD_FOR_PRESS && Math.abs(deltaY) < MOVE_THRESHOLD_FOR_PRESS;

    if (isTap) {
      // Use swipeableImageRef for width calculation
      const containerWidth = swipeableImageRef.current?.clientWidth || window.innerWidth;
      const xOffset = (window.innerWidth - containerWidth) / 2; // Assuming parent is centered
      const xInElement = endX - xOffset;
      
      if (xInElement > containerWidth / 2) goToNextImage();
      else goToPrevImage();
    } else {
      if (deltaX > SWIPE_THRESHOLD) triggerLike();
      else if (deltaX < -SWIPE_THRESHOLD) triggerDislike();
      else resetCard();
    }
    
    setIsDragging(false);
    setTouchStart(null);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && !isAnimatingOut) {
      e.preventDefault();
      handlePressStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && !isAnimatingOut) {
      e.preventDefault();
      handlePressMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0 && !isAnimatingOut) {
      handlePressEnd(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  };

  return (
    <div 
      className="ProfileViewContainer relative h-full w-full bg-black touch-none overflow-hidden rounded-2xl"
    >
      {/* Static Filter Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onOpenFilters(); }}
        className="absolute top-2 right-4 z-30 w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg text-white hover:bg-white/20 transition-all duration-200 ease-in-out active:scale-95 transform"
        aria-label="Filtrar perfis"
      >
        <FilterIcon />
      </button>

      {/* Swipeable Image Area */}
      <div 
        ref={swipeableImageRef} // Apply ref here
        className="absolute inset-0 overflow-hidden rounded-2xl" // Apply rounded-2xl here for visual clipping
        style={cardStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => handlePressStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePressMove(e.clientX, e.clientY)}
        onMouseUp={(e) => handlePressEnd(e, e.clientX, e.clientY)}
        onMouseLeave={() => { if (isDragging) resetCard(); }}
      >
        {/* Image Progress Indicators (moves with image) */}
        <div className="absolute top-2 left-0 right-0 z-20 flex justify-center space-x-1 px-4">
          {profile.imageUrls.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full transition-all duration-200 ease-in-out ${currentImageIndex === index ? 'bg-white shadow-md shadow-white/50' : 'bg-white/30'}`} />
          ))}
        </div>
        
        <img 
          key={profile.id + '-' + currentImageIndex}
          src={profile.imageUrls[currentImageIndex]} 
          alt={profile.name} 
          className="ProfileImage absolute inset-0 w-full h-full object-cover animate-fade-in" 
          style={{ animationDuration: '0.5s' }}
          draggable="false"
          loading="lazy"
        />

        {/* Overlay (CURTI/NÃO, moves with image) */}
        <div className="absolute inset-0 flex justify-center items-start pt-20 pointer-events-none">
          <span className="text-6xl font-extrabold border-8 rounded-2xl px-6 py-2 tracking-wider" style={{ fontFamily: "'Yeseva One', cursive", opacity: overlayProps.opacity, color: overlayProps.color, borderColor: overlayProps.borderColor, transform: overlayProps.transform, transition: overlayProps.transition, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {overlayProps.text}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Static Profile Details (always visible) */}
      <div className="absolute bottom-40 left-0 right-0 p-5 z-10 space-y-4"> {/* Adjusted bottom for spacing */}
        <div className="text-white">
          <h1 className="text-4xl font-bold drop-shadow-lg text-gradient" style={{ fontFamily: "'Yeseva One', cursive" }}>
            {profile.name}
          </h1>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/20 shadow-md">
              {profile.relationshipIntention}
            </span>
            <span className="text-white text-3xl font-bold ml-4" style={{ fontFamily: "'Yeseva One', cursive" }}>
              {profile.age}
            </span>
          </div>
        </div>
      </div>

      {/* Static Action Buttons (always visible) */}
      <div className="absolute bottom-24 left-0 right-0 p-5 z-10 flex justify-around items-center text-white"> {/* Adjusted bottom for spacing */}
        <ActionButton onClick={triggerDislike} className="hover:!bg-red-500/50 hover:text-red-300"> <XIcon /> </ActionButton>
        <ActionButton onClick={onArchive} className="hover:!bg-blue-500/50 hover:text-blue-300"> <ArchiveIcon /> </ActionButton>
        <ActionButton onClick={triggerLike} className="!w-20 !h-20 !bg-gradient-to-br !from-[#ff0800] !to-[#ff9900] !border-none shadow-orange-500/50 hover:!shadow-orange-400/60"> <HeartIcon isGradient={false}/> </ActionButton>
        <ActionButton onClick={onFavorite} className="hover:!bg-yellow-500/50 hover:text-yellow-300"> <StarIcon /> </ActionButton> {/* Replaced SendIcon with StarIcon */}
        <ActionButton onClick={onComment} className="hover:!bg-purple-500/50 hover:text-purple-300"> <CommentIcon /> </ActionButton>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(1.05); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in { animation: fade-in forwards; }
          .text-gradient { background: linear-gradient(to right, #ff0800, #ff9900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
      `}</style>
    </div>
  );
};

export default ProfileView;