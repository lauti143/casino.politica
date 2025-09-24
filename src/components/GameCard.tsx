import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  minBet: number;
  maxBet: number;
  onClick: () => void;
  disabled?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon: Icon,
  minBet,
  maxBet,
  onClick,
  disabled = false
}) => {
  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`relative group cursor-pointer bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl border border-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-yellow-400/50'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-red-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className="h-8 w-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
          <div className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full text-xs font-bold text-white">
            NUEVO
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Apuesta mínima</p>
            <p className="text-green-400 font-bold">{minBet} créditos</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Apuesta máxima</p>
            <p className="text-yellow-400 font-bold">{maxBet} créditos</p>
          </div>
        </div>
        
        <div className="mt-4 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-red-400 rounded-full transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;