import React from 'react';
import { Crown, Coins, TrendingUp } from 'lucide-react';
import SoundToggle from './SoundToggle';

interface HeaderProps {
  credits: number;
  gamesPlayed: number;
  totalWins: number;
}

const Header: React.FC<HeaderProps> = ({ credits, gamesPlayed, totalWins }) => {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 p-6 shadow-2xl border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Crown className="h-10 w-10 text-yellow-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
              CASINO ROYAL
            </h1>
            <p className="text-sm text-gray-300">Desarrollado por <span className="text-yellow-400 font-semibold"></span></p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <SoundToggle />
          
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 px-4 py-2 rounded-lg border border-yellow-400/30">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="text-xl font-bold text-white">{credits.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-300">Créditos</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-400/20 px-4 py-2 rounded-lg border border-green-400/30">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-lg font-bold text-white">{totalWins}</span>
            </div>
            <p className="text-xs text-gray-300">Victorias</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;