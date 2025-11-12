import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { UserProfile, ChatMessage } from '../types';
import { ArrowLeftIcon, SendIcon } from '../constants';

interface RealtimeChatConversationScreenProps {
  matchedProfile: UserProfile;
  onBack: () => void;
  // Prop para inicializar o histórico de mensagens
  initialChatHistory: ChatMessage[];
}

const RealtimeChatConversationScreen: React.FC<RealtimeChatConversationScreenProps> = ({ matchedProfile, onBack, initialChatHistory }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatHistory);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); // New state for typing indicator
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() === '') return;

    const userMsg: ChatMessage = {
      id: Date.now().toString() + '-me',
      sender: 'me',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage('');

    // Simulate typing effect and response from the other user
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: ChatMessage = {
        id: Date.now().toString() + '-other',
        sender: 'other',
        text: 'Isso é muito interessante! Conte-me mais.', // Dummy response
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 2000 + Math.random() * 1000); // Simulate 2-3 seconds of typing
  }, [newMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-start animate-fade-in" style={{ animationDuration: '0.5s' }}>
      {/* Header (fixed at top) */}
      <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 flex items-center flex-shrink-0 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="text-white hover:text-gray-300 transition-colors duration-200 p-1 mr-2"
          aria-label="Voltar para a lista de chats"
        >
          <ArrowLeftIcon />
        </button>
        <img
          src={matchedProfile.imageUrls[0]}
          alt={matchedProfile.name}
          className="w-10 h-10 rounded-full object-cover border border-white/50 mr-3"
          loading="lazy"
        />
        <h1 className="text-xl font-bold text-gradient" style={{ fontFamily: "'Yeseva One', cursive" }}>
          {matchedProfile.name}
        </h1>
      </div>

      {/* Message Area (scrollable) */}
      <div className="flex-grow w-full max-w-md p-4 overflow-y-auto custom-scrollbar flex flex-col space-y-3 pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-xl text-white shadow-md text-sm break-words
                          ${msg.sender === 'me'
                              ? 'bg-gradient-to-br from-[#ff0800]/70 to-[#ff9900]/70'
                              : 'bg-white/10 backdrop-blur-lg border border-white/20'}`}>
              <p>{msg.text}</p>
              <span className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/80' : 'text-gray-300'} block text-right`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[75%] px-4 py-2 rounded-xl text-white shadow-md text-sm break-words bg-white/10 backdrop-blur-lg border border-white/20 flex items-center">
              <span className="dot-typing"></span>
              <span className="ml-2">Digitando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
      </div>

      {/* Input Area (fixed at bottom) */}
      <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border-t border-white/10 p-4 flex items-center flex-shrink-0 sticky bottom-0 z-10">
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow py-3 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all duration-200 mr-3"
          aria-label="Campo de entrada de mensagem"
        />
        <button
          onClick={handleSendMessage}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ff0800] to-[#ff9900] text-white shadow-lg
                     hover:from-[#ff9900] hover:to-[#ff0800] transition-all duration-200 ease-in-out transform active:scale-95"
          aria-label="Enviar mensagem"
          disabled={newMessage.trim() === ''}
        >
          <SendIcon />
        </button>
      </div>

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

        /* Typing indicator styles */
        .dot-typing {
          position: relative;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #f87171; /* A light color for the dots */
          color: #f87171;
          animation: dot-typing 1.5s infinite ease-in-out;
        }
        .dot-typing::before, .dot-typing::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #f87171;
          color: #f87171;
          animation: dot-typing 1.5s infinite ease-in-out;
        }
        .dot-typing::before {
          left: -12px;
          animation-delay: -0.3s;
        }
        .dot-typing::after {
          left: 12px;
          animation-delay: 0.3s;
        }

        @keyframes dot-typing {
          0% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-4px);
          }
          40% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RealtimeChatConversationScreen;