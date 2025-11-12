import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`
        w-16 h-16 rounded-full flex items-center justify-center 
        bg-white/10 backdrop-blur-lg border border-white/20 
        shadow-lg
        hover:bg-white/20 transition-all duration-200 ease-in-out
        active:scale-95 active:opacity-75 transform
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ActionButton;