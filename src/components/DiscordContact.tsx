import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';

const DiscordContact: React.FC = () => {
  const discordId = '469607956590231553';
  
  const openDiscord = () => {
    // Try to open Discord app first, fallback to web
    window.open(`discord://users/${discordId}`, '_blank');
    setTimeout(() => {
      window.open(`https://discord.com/users/${discordId}`, '_blank');
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={openDiscord}
        className="group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-3 animate-pulse"
      >
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-white" />
          <ExternalLink className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute -top-12 right-0 bg-black/90 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Contactar Desarrollador
        </div>
      </button>
    </div>
  );
};

export default DiscordContact;